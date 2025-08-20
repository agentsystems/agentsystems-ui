#!/usr/bin/env node
/**
 * License Attribution Verification Script
 * 
 * Verifies that all production dependencies from package.json are properly
 * attributed in the container's license files. This ensures compliance with
 * open source license requirements.
 * 
 * Usage:
 *   node verify-attribution.js
 * 
 * Exit codes:
 *   0 - All dependencies properly attributed
 *   1 - Missing attributions or errors
 */

const fs = require('fs');
const path = require('path');

// Read expected dependencies from package.json if available
function getExpectedDepsFromPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.dependencies || {};
    }
  } catch (error) {
    console.warn('⚠️  Could not read package.json, using hardcoded list');
  }
  return null;
}

// Expected dependencies from package.json (fallback if file not available)
const expectedDeps = getExpectedDepsFromPackageJson() || {
  // Production dependencies
  "react": "^18.2.0",
  "react-dom": "^18.2.0", 
  "react-router-dom": "^6.21.1",
  "@tanstack/react-query": "^5.17.9",
  "@tanstack/react-query-devtools": "^5.17.9",
  "@heroicons/react": "^2.0.18",
  "zustand": "^4.4.7",
  "axios": "^1.6.5",
  "socket.io-client": "^4.5.4",
  "recharts": "^2.10.4",
  "clsx": "^2.1.0",
  "date-fns": "^3.0.6",
  "@sentry/react": "^7.99.0",
  "@sentry/tracing": "^7.99.0"
};

console.log('🔍 Verifying license attribution completeness...\n');

try {
  // Read the generated license file
  const licenses = JSON.parse(fs.readFileSync('/app/licenses/nodejs/THIRD_PARTY_LICENSES.json'));
  
  // Get all package names from attribution (normalize by removing version info)
  const attributedPackages = Object.keys(licenses).map(pkg => {
    // Handle scoped packages like @babel/runtime@7.28.3 -> @babel/runtime
    if (pkg.startsWith('@')) {
      const parts = pkg.split('@');
      return '@' + parts[1]; // @scope/package
    }
    // Handle regular packages like react@18.2.0 -> react  
    return pkg.split('@')[0];
  });

  const uniqueAttributedPackages = [...new Set(attributedPackages)];
  
  console.log(`📊 Attribution Statistics:`);
  console.log(`   - Total attributed packages: ${Object.keys(licenses).length}`);
  console.log(`   - Unique package names: ${uniqueAttributedPackages.length}`);
  console.log(`   - Expected production deps: ${Object.keys(expectedDeps).length}\n`);

  // Check each expected dependency
  const missing = [];
  const found = [];
  
  for (const [depName, version] of Object.entries(expectedDeps)) {
    if (uniqueAttributedPackages.includes(depName)) {
      found.push(depName);
      console.log(`✅ ${depName}`);
    } else {
      missing.push(depName);
      console.log(`❌ ${depName} - NOT FOUND`);
    }
  }

  console.log(`\n📋 Summary:`);
  console.log(`   - Found: ${found.length}/${Object.keys(expectedDeps).length}`);
  console.log(`   - Missing: ${missing.length}`);
  
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing packages:`);
    missing.forEach(pkg => console.log(`   - ${pkg}`));
  }

  // Show some additional packages that were attributed (transitive dependencies)
  const additionalPackages = uniqueAttributedPackages.filter(
    pkg => !Object.keys(expectedDeps).includes(pkg)
  ).slice(0, 10);
  
  if (additionalPackages.length > 0) {
    console.log(`\n🔗 Sample transitive dependencies also attributed:`);
    additionalPackages.forEach(pkg => console.log(`   - ${pkg}`));
    if (uniqueAttributedPackages.length > Object.keys(expectedDeps).length + 10) {
      console.log(`   ... and ${uniqueAttributedPackages.length - Object.keys(expectedDeps).length - 10} more`);
    }
  }

  // Final verdict
  // Check for common problematic license types
  const problematicLicenses = [];
  const allLicenses = Object.values(licenses).map(pkg => pkg.licenses);
  const uniqueLicenses = [...new Set(allLicenses)].sort();
  
  for (const license of uniqueLicenses) {
    if (license && (
      license.toLowerCase().includes('gpl') ||
      license.toLowerCase().includes('agpl') ||
      license.toLowerCase().includes('copyleft')
    )) {
      problematicLicenses.push(license);
    }
    
    // Check for UNLICENSED packages (but exclude our own package)
    if (license === 'UNLICENSED') {
      const unlicensedPackages = Object.entries(licenses)
        .filter(([pkg, info]) => info.licenses === 'UNLICENSED')
        .filter(([pkg]) => !pkg.startsWith('agentsystems-ui@')); // Exclude our own package
      
      if (unlicensedPackages.length > 0) {
        problematicLicenses.push(`UNLICENSED (${unlicensedPackages.length} packages)`);
      }
    }
  }
  
  if (problematicLicenses.length > 0) {
    console.log(`\n⚠️  WARNING: Found potentially problematic licenses:`);
    problematicLicenses.forEach(license => console.log(`   - ${license}`));
    console.log(`   Please review these manually for compliance.`);
  }
  
  console.log(`\n📄 License types in use: ${uniqueLicenses.join(', ')}`);

  if (missing.length === 0) {
    console.log(`\n🎉 SUCCESS: All expected dependencies are properly attributed!`);
    console.log(`📊 Total attribution coverage: ${Object.keys(licenses).length} packages`);
    process.exit(0);
  } else {
    console.log(`\n❌ INCOMPLETE: ${missing.length} dependencies missing attribution`);
    console.log(`   This may indicate a build or dependency resolution issue.`);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Error reading license file:', error.message);
  process.exit(1);
}