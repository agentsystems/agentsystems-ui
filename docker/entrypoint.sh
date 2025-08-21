#!/bin/sh
set -e

# Default values if not provided - use proxy paths for containerized deployment
API_GATEWAY_URL="${API_GATEWAY_URL:-/api}"
WS_ENDPOINT_URL="${WS_ENDPOINT_URL:-ws://localhost:3001/api}"

# Replace placeholders in index.html with actual values
sed -i "s|%API_GATEWAY_URL%|${API_GATEWAY_URL}|g" /usr/share/nginx/html/index.html
sed -i "s|%WS_ENDPOINT_URL%|${WS_ENDPOINT_URL}|g" /usr/share/nginx/html/index.html

echo "AgentSystems UI configured with:"
echo "  API Gateway: ${API_GATEWAY_URL}"
echo "  WebSocket:   ${WS_ENDPOINT_URL}"

# Execute the CMD
exec "$@"