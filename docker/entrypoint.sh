#!/bin/sh
set -e

# Default values if not provided
API_GATEWAY_URL="${API_GATEWAY_URL:-http://localhost:18080}"
WS_ENDPOINT_URL="${WS_ENDPOINT_URL:-ws://localhost:18080}"

# Replace placeholders in index.html with actual values
sed -i "s|%VITE_API_GATEWAY_URL%|${API_GATEWAY_URL}|g" /usr/share/nginx/html/index.html
sed -i "s|%VITE_WS_ENDPOINT_URL%|${WS_ENDPOINT_URL}|g" /usr/share/nginx/html/index.html

echo "AgentSystems UI configured with:"
echo "  API Gateway: ${API_GATEWAY_URL}"
echo "  WebSocket:   ${WS_ENDPOINT_URL}"

# Execute the CMD
exec "$@"