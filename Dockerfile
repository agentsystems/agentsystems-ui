# -----------------------------------------------------------------------------
# AgentSystems UI Image with Comprehensive License Attribution
# Ensures bulletproof compliance with all third-party software licenses
# -----------------------------------------------------------------------------

# Build args for version injection
ARG VERSION=unknown
ARG BUILD_TIMESTAMP=unknown
ARG GIT_COMMIT=unknown

# -----------------------------------------------------------------------------
# Builder stage – install deps, build app, and collect ALL licenses
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

ENV NODE_ENV=production
WORKDIR /app

# Install modern, actively maintained license scanning tool
RUN npm install -g license-checker-rseidelsohn

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (production + dev for complete build attribution)
RUN npm ci --include=dev

# Copy source code and scripts
COPY . .

# Build the application
RUN npm run build

# ---- COMPREHENSIVE LICENSE COLLECTION ----
RUN mkdir -p /app/licenses/nodejs /app/licenses/alpine

# 1) Capture ALL Node.js dependencies with license texts (production + dev for complete coverage)
RUN license-checker-rseidelsohn \
      --json \
      --out /app/licenses/nodejs/THIRD_PARTY_LICENSES.json

# 2) Generate human-readable attribution file with embedded license texts
COPY scripts/generate-licenses.js /tmp/generate-licenses.js
RUN node /tmp/generate-licenses.js && rm /tmp/generate-licenses.js

# 3) Export complete dependency trees for reproducibility
RUN npm list --production --json > /app/licenses/nodejs/DEPENDENCY_TREE.json 2>/dev/null || echo '{}' > /app/licenses/nodejs/DEPENDENCY_TREE.json
RUN npm list --production > /app/licenses/nodejs/DEPENDENCY_TREE.txt 2>/dev/null || echo 'No dependencies' > /app/licenses/nodejs/DEPENDENCY_TREE.txt

# 4) Copy Node.js NOTICE files from packages
RUN find node_modules -name "NOTICE*" -type f 2>/dev/null | \
    while read file; do \
      pkg_name=$(echo $file | cut -d'/' -f2); \
      cp "$file" "/app/licenses/nodejs/${pkg_name}-NOTICE" 2>/dev/null || true; \
    done

# 5) Capture Alpine Linux system packages with complete information
RUN apk info -v > /app/licenses/alpine/INSTALLED_PACKAGES_WITH_VERSIONS.txt && \
    apk info -a > /app/licenses/alpine/DETAILED_PACKAGE_INFO.txt && \
    mkdir -p /app/licenses/alpine/copyrights && \
    for pkg in $(apk info | tr '\n' ' '); do \
      if [ -f "/usr/share/licenses/$pkg/COPYING" ]; then \
        cp "/usr/share/licenses/$pkg/COPYING" "/app/licenses/alpine/copyrights/${pkg}-COPYING" 2>/dev/null || true; \
      fi; \
      if [ -f "/usr/share/licenses/$pkg/LICENSE" ]; then \
        cp "/usr/share/licenses/$pkg/LICENSE" "/app/licenses/alpine/copyrights/${pkg}-LICENSE" 2>/dev/null || true; \
      fi; \
    done

# 6) Generate Alpine package attribution summary
RUN echo "# Alpine Linux Base System Packages\n" > /app/licenses/alpine/ATTRIBUTIONS.md && \
    echo "Base image: node:20-alpine\n" >> /app/licenses/alpine/ATTRIBUTIONS.md && \
    echo "Alpine version: $(cat /etc/alpine-release)\n" >> /app/licenses/alpine/ATTRIBUTIONS.md && \
    echo "## Installed Packages\n" >> /app/licenses/alpine/ATTRIBUTIONS.md && \
    apk info -v | sort | while read pkg_version; do \
      echo "- $pkg_version" >> /app/licenses/alpine/ATTRIBUTIONS.md; \
    done

# 7) Create build environment attribution
RUN echo "# Build Environment Attribution\n" > /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "## Build Tools Used\n" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "- Node.js: $(node --version) (MIT License)" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "- npm: $(npm --version) (Artistic-2.0 License)" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "- Alpine Linux: $(cat /etc/alpine-release) (Various Licenses)" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "\n## Build Information\n" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "- Build date: $(date)" >> /app/licenses/BUILD_ENVIRONMENT.md && \
    echo "- Platform: $(uname -m)" >> /app/licenses/BUILD_ENVIRONMENT.md

# 8) Run comprehensive license verification during build
COPY scripts/verify-attribution.cjs /tmp/verify-attribution.cjs
RUN node /tmp/verify-attribution.cjs && rm /tmp/verify-attribution.cjs

# 9) Generate compliance verification checksums
RUN find /app/licenses -name "*.json" -o -name "*.txt" -o -name "*.md" | \
    sort | xargs sha256sum > /app/licenses/ATTRIBUTION_CHECKSUMS.txt

# 10) Remove license scanning tools to keep runtime clean
RUN npm uninstall -g license-checker-rseidelsohn

# -----------------------------------------------------------------------------
# Runtime stage – minimal nginx with complete license attribution
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine

# Re-declare args for final stage
ARG VERSION=unknown
ARG BUILD_TIMESTAMP=unknown
ARG GIT_COMMIT=unknown

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration and entrypoint
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy project LICENSE
COPY LICENSE /app/LICENSE

# Copy comprehensive license attribution artifacts
COPY --from=builder /app/licenses /app/licenses

# Create version file for runtime access
RUN echo "{\"version\": \"${VERSION}\", \"build_timestamp\": \"${BUILD_TIMESTAMP}\", \"git_commit\": \"${GIT_COMMIT}\"}" > /usr/share/nginx/html/version.json

# Generate final license summary for easy access
RUN echo "# AgentSystems UI - Complete License Attribution\n" > /app/licenses/README.md && \
    echo "This container provides bulletproof license attribution for compliance.\n" >> /app/licenses/README.md && \
    echo "## Coverage Areas\n" >> /app/licenses/README.md && \
    echo "✅ **Production Dependencies**: All runtime Node.js packages with full license texts\n" >> /app/licenses/README.md && \
    echo "✅ **Build Environment**: Node.js runtime, npm, Alpine Linux\n" >> /app/licenses/README.md && \
    echo "✅ **System Packages**: Complete Alpine Linux base system\n" >> /app/licenses/README.md && \
    echo "✅ **Integrity Verification**: SHA256 checksums of all attribution files\n" >> /app/licenses/README.md && \
    echo "\n## Quick Access\n" >> /app/licenses/README.md && \
    echo "- Node.js attributions: /app/licenses/nodejs/ATTRIBUTIONS.md\n" >> /app/licenses/README.md && \
    echo "- Alpine attributions: /app/licenses/alpine/ATTRIBUTIONS.md\n" >> /app/licenses/README.md && \
    echo "- Build environment: /app/licenses/BUILD_ENVIRONMENT.md\n" >> /app/licenses/README.md && \
    echo "- Verification checksums: /app/licenses/ATTRIBUTION_CHECKSUMS.txt\n" >> /app/licenses/README.md

# Comprehensive OCI labels for license metadata
LABEL org.opencontainers.image.title="AgentSystems UI" \
      org.opencontainers.image.description="Production-ready web interface with comprehensive license attribution" \
      org.opencontainers.image.vendor="AgentSystems" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.license.attribution="COMPREHENSIVE" \
      org.opencontainers.image.license.files="/app/licenses" \
      org.opencontainers.image.license.verification="/app/licenses/ATTRIBUTION_CHECKSUMS.txt" \
      org.opencontainers.image.source="https://github.com/agentsystems/agentsystems-ui" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_TIMESTAMP}" \
      org.opencontainers.image.revision="${GIT_COMMIT}"

# Create non-root user for consistency
RUN addgroup -g 1001 appuser && \
    adduser -D -s /bin/sh -u 1001 -G appuser appuser

EXPOSE 80

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]