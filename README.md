# AgentSystems UI

A modern, self-hostable web interface for the AgentSystems platform. Built with React, TypeScript, and Vite.

## Features

- 🎨 **Multiple Themes**: Dark, Light, and Cyberpunk themes
- 📊 **Real-time Dashboard**: Monitor agent status and system health
- 🤖 **Agent Management**: Start, stop, and invoke agents
- 📝 **Live Logs**: Stream real-time logs from the gateway
- 🔧 **Configuration**: Easy setup through environment variables
- 🐳 **Docker Ready**: Single container deployment

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + CSS Variables
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v6
- **Container**: nginx Alpine

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

# Build for production
npm run build

# Preview production build
npm run preview
```

## Themes

The UI supports three built-in themes:

1. **Dark** (default): Professional dark theme with electric cyan accents
2. **Light**: Clean, bright theme for daytime use
3. **Cyberpunk**: Matrix-inspired green terminal aesthetic

Themes use CSS variables for easy customization. See `src/styles/global.css` for the complete theme definitions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Part of the AgentSystems platform. See the main repository for license information.

## Links

- [AgentSystems Main Repository](https://github.com/agentsystems/agentsystems)
- [Agent Control Plane](https://github.com/agentsystems/agent-control-plane)
- [AgentSystems SDK](https://github.com/agentsystems/agentsystems-sdk)
