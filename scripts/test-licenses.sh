#!/bin/bash
# Test script to verify license files are present and accessible in the container

echo "🔍 Testing license attribution in AgentSystems UI container..."

# Check if license directory exists
if [ ! -d "/app/licenses" ]; then
    echo "❌ ERROR: License directory not found at /app/licenses"
    exit 1
fi

echo "✅ License directory found"

# Check Node.js licenses
if [ ! -f "/app/licenses/nodejs/THIRD_PARTY_LICENSES.json" ]; then
    echo "❌ ERROR: Node.js license JSON not found"
    exit 1
fi

if [ ! -f "/app/licenses/nodejs/ATTRIBUTIONS.md" ]; then
    echo "❌ ERROR: Node.js attribution file not found"
    exit 1
fi

echo "✅ Node.js license files found"

# Check Alpine licenses  
if [ ! -f "/app/licenses/alpine/INSTALLED_PACKAGES.txt" ]; then
    echo "❌ ERROR: Alpine package list not found"
    exit 1
fi

if [ ! -f "/app/licenses/alpine/ATTRIBUTIONS.md" ]; then
    echo "❌ ERROR: Alpine attribution file not found"
    exit 1
fi

echo "✅ Alpine license files found"

# Check license summary
if [ ! -f "/app/licenses/README.md" ]; then
    echo "❌ ERROR: License summary not found"
    exit 1
fi

echo "✅ License summary found"

# Count packages
node_packages=$(jq 'keys | length' /app/licenses/nodejs/THIRD_PARTY_LICENSES.json 2>/dev/null || echo "0")
alpine_packages=$(wc -l < /app/licenses/alpine/INSTALLED_PACKAGES.txt 2>/dev/null || echo "0")

echo "📊 License Attribution Summary:"
echo "   - Node.js packages: $node_packages"
echo "   - Alpine packages: $alpine_packages"
echo "   - License files location: /app/licenses/"

# Show a sample of the attribution file
echo ""
echo "📋 Sample Node.js Attribution (first 10 lines):"
head -n 10 /app/licenses/nodejs/ATTRIBUTIONS.md

echo ""
echo "🎉 License attribution test PASSED - all files present and accessible"