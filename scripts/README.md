# AgentSystems UI - Build & Compliance Scripts

This directory contains scripts for building, testing, and ensuring compliance of the AgentSystems UI container.

## Scripts

### `generate-licenses.js`
Generates human-readable attribution files from license-checker JSON output.

**Used by**: Dockerfile during build process  
**Purpose**: Creates comprehensive license attribution with embedded license texts  
**Output**: `/app/licenses/nodejs/ATTRIBUTIONS.md`

### `verify-attribution.cjs`
Verifies that all production dependencies are properly attributed in the container.

**Usage**: 
```bash
node verify-attribution.cjs
```

**Purpose**: 
- Ensures compliance with open source license requirements
- Validates that package.json dependencies are all attributed
- Detects potentially problematic license types
- Can be used in CI/CD to prevent incomplete attribution

**Exit Codes**:
- `0` - All dependencies properly attributed
- `1` - Missing attributions or errors

**Features**:
- ✅ Reads dependencies from package.json automatically
- ✅ Validates against generated license files  
- ✅ Counts transitive dependencies
- ✅ Flags GPL/AGPL licenses for review
- ✅ Provides detailed attribution statistics

### `test-licenses.sh`
Basic test script to verify license files are present in container.

**Usage**:
```bash
./test-licenses.sh
```

**Purpose**: Quick smoke test for license file presence

## Integration

### Dockerfile
- `generate-licenses.js` is used during build to create attribution files
- Scripts are copied to `/tmp` and cleaned up after use

### GitHub Actions
- `verify-attribution.cjs` is integrated into the release workflow
- Prevents releases with incomplete license attribution
- Runs on every build to catch regressions

### Local Development
```bash
# Verify current attribution
npm run build
docker build -f Dockerfile.enhanced -t test .
node scripts/verify-attribution.cjs

# Test in container
docker run --rm test sh scripts/test-licenses.sh
```

## Compliance Notes

The verification script ensures:
- ✅ All package.json dependencies are attributed
- ✅ License texts are included (not just license names)
- ✅ Repository and publisher information is captured
- ✅ Transitive dependencies are also attributed
- ⚠️  GPL/AGPL licenses are flagged for manual review

This exceeds typical open source compliance requirements and provides enterprise-grade license attribution.