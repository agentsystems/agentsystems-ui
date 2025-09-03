# AgentSystems UI

[![GitHub stars](https://img.shields.io/github/stars/agentsystems/agentsystems?style=flat-square&logo=github)](https://github.com/agentsystems/agentsystems/stargazers)
[![Tests](https://img.shields.io/badge/tests-73%20passing-brightgreen)](https://github.com/agentsystems/agentsystems-ui)

> [!NOTE]  
> **Public Beta** - Part of the AgentSystems platform. Official public launch September 15, 2025.
> ⭐ [**Star the main repository**](https://github.com/agentsystems/agentsystems) to show your support!

> This is the **web interface** for AgentSystems. See the [main repository](https://github.com/agentsystems/agentsystems) for platform overview and documentation.
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Security](https://img.shields.io/badge/security-hardened-orange)](https://github.com/agentsystems/agentsystems-ui/security)

A self-hostable web interface for the AgentSystems platform. Built with modern React patterns and TypeScript.

## Features

### 🎨 **Professional Theming**
- **Dark Theme**: Professional dark interface with electric cyan accents
- **Light Theme**: Clean, bright interface for daytime use  
- **Cyber Theme**: Retro terminal aesthetic with matrix effects and authentic audio feedback

### 🚀 **Core Functionality**
- 📊 **Real-time Dashboard**: Live agent monitoring with system metrics
- 🤖 **Agent Management**: Discover, start, stop, and invoke agents
- 📝 **Live Logs**: Stream real-time logs with filtering and search
- ⚙️ **Settings**: Configuration with validation and security checks
- 🔄 **File Uploads**: Support for agent file processing workflows

### 🛡️ **Enterprise Security**
- 🔒 **Input Sanitization**: XSS protection and malicious payload filtering
- 🚦 **Rate Limiting**: Abuse prevention for forms and API calls
- 🔐 **Authentication**: Secure token-handling practices (no hardcoded credentials)
- 📋 **Form Validation**: Comprehensive client-side validation with user feedback

### ♿ **Accessibility Excellence**
- **Accessibility**: Aims to meet WCAG 2.1 guidelines; includes screen-reader and keyboard navigation support
- **Skip Links**: Quick navigation for assistive technology users
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Semantic HTML**: Proper landmark and heading structure

### 🧪 **Quality Assurance**
- **Error Boundaries**: Graceful failure handling with user-friendly error messages
- **Performance Optimized**: Efficient rendering and state management

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite with optimized production builds
- **Styling**: CSS Modules + CSS Variables (theme system)
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack Query with caching and error handling
- **Routing**: React Router v6 with lazy loading support
- **Testing**: Vitest + React Testing Library
- **Security**: Comprehensive input sanitization and CSRF protection
- **Container**: Multi-stage Docker builds with nginx Alpine
- **Audio**: Web Audio API for cyber theme sound effects

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker

```bash
# Build the image
docker build -t agentsystems-ui:latest .

# Run the container
docker run -d \
  -p 3001:80 \
  -e API_GATEWAY_URL=http://localhost:18080 \
  -e WS_ENDPOINT_URL=ws://localhost:18080 \
  agentsystems-ui:latest
```

### Docker Compose

```bash
# Start with docker-compose
docker-compose up -d

# Access the UI
open http://localhost:3001
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_GATEWAY_URL` | `http://localhost:18080` | AgentSystems gateway URL |
| `WS_ENDPOINT_URL` | `ws://localhost:18080` | WebSocket endpoint for real-time updates |

## Project Structure

```
agentsystems-ui/
├── src/
│   ├── api/            # API client and endpoints
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route pages
│   ├── stores/         # Zustand state stores
│   ├── styles/         # Global styles and themes
│   └── types/          # TypeScript type definitions
├── docker/             # Docker configuration
├── public/             # Static assets
└── package.json
```

## Integration with AgentSystems

The UI integrates seamlessly with other AgentSystems components:

- **Agent Control Plane**: Connects to the gateway API on port 18080
- **Agent Discovery**: Auto-discovers and displays available agents
- **Invocation**: Supports sync/async agent invocation with progress tracking
- **Artifacts**: Handles file uploads and downloads through the gateway
- **Audit Logs**: Displays tamper-evident audit trail

## Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Running AgentSystems gateway (port 18080)

### Commands

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Run test suite
npm test

# Test with UI dashboard
npm run test:ui

# Coverage report
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

The application includes a test suite:

- **Component Tests**: All UI components thoroughly tested
- **Integration Tests**: Page-level functionality verification  
- **Security Tests**: Input sanitization and validation testing
- **Accessibility tests**: Automated checks against WCAG 2.1 rules
- **API Tests**: Client functionality and error handling

Run `npm test` to execute the test suite.

## 🎨 Themes & Customization

The UI supports three professionally designed themes:

### **Dark Theme** (Default)
- Deep space color palette with electric cyan accents
- Subtle gradient backgrounds for depth
- Optimized for extended use and eye comfort

### **Light Theme**
- Clean, bright interface perfect for daytime work
- High contrast for excellent readability
- Professional appearance for business environments

### **Cyber Theme** 🎮
- Authentic retro terminal aesthetic with matrix-inspired effects
- **Dynamic scanline effects** with customizable frequency (30s/90s/300s)
- **Audio feedback** with synthesized terminal click sounds (Web Audio API)
- **Terminal typography** with monospace fonts throughout
- Perfect for developers who want that classic hacker movie experience

All themes use CSS custom properties for easy customization and aim to align with WCAG 2.1 accessibility guidelines.

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Rate Limiting**: Protection against form spam and API abuse
- **Security headers**: CSRF protection and content-type validation
- **Authentication**: Secure token handling without hardcoded credentials
- **JSON Validation**: Safe parsing and sanitization of agent payloads

## 🤝 Contributing

We welcome contributions! The codebase is designed for easy contribution with:

- **Test coverage** - Changes are protected by tests
- **TypeScript strict mode** - Catch errors at compile time
- **ESLint + Prettier** - Consistent code formatting
- **Comprehensive documentation** - JSDoc comments throughout

### Development Workflow

1. **Fork the repository**
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Start development**: `npm run dev`
5. **Create feature branch**: `git checkout -b feature/amazing-feature`
6. **Make changes** with tests
7. **Verify quality**: `npm run lint && npm run type-check && npm test`
8. **Commit changes**: `git commit -m 'Add amazing feature'`
9. **Push to branch**: `git push origin feature/amazing-feature`
10. **Open Pull Request**

### Code Standards

- All new components must include TypeScript interfaces and JSDoc documentation
- Add tests for new functionality
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Security: Sanitize all user inputs and validate forms
- UI: Support all three themes (Dark, Light, Cyber)

## Links

- [AgentSystems Main Repository](https://github.com/agentsystems/agentsystems)
- [Agent Control Plane](https://github.com/agentsystems/agent-control-plane)
- [AgentSystems SDK](https://github.com/agentsystems/agentsystems-sdk)

## License

Licensed under the [Apache-2.0 license](./LICENSE).
