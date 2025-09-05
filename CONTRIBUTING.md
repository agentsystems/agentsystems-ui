# Contributing to AgentSystems UI

Thank you for your interest in contributing to AgentSystems! This project consists of multiple repositories working together to provide a complete AI agent platform.

## Repository Structure

AgentSystems is organized into several focused repositories:

- **[agentsystems](https://github.com/agentsystems/agentsystems)** - Main documentation and platform overview
- **[agent-control-plane](https://github.com/agentsystems/agent-control-plane)** - Gateway and orchestration services
- **[agentsystems-sdk](https://github.com/agentsystems/agentsystems-sdk)** - CLI and deployment tools
- **[agentsystems-ui](https://github.com/agentsystems/agentsystems-ui)** - Web interface (this repo)
- **[agentsystems-toolkit](https://github.com/agentsystems/agentsystems-toolkit)** - Development libraries
- **[agent-template](https://github.com/agentsystems/agent-template)** - Reference implementation

## Getting Started

### Development Setup
```bash
# Clone and setup
git clone https://github.com/agentsystems/agentsystems-ui.git
cd agentsystems-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run type-check

# Build for production
npm run build
```

### Making Changes
1. **Fork** this repository
2. **Create a feature branch** from main
3. **Make your changes** with appropriate tests
4. **Submit a pull request** with a clear description

## Code Standards

- Follow the existing code style in each repository
- Include tests for new functionality
- Update documentation as needed
- Use clear, descriptive commit messages
- Maintain TypeScript strict mode compliance
- Follow accessibility guidelines (WCAG 2.1)

## Pull Request Process

1. Update documentation if you're changing functionality
2. Add tests for new features
3. Verify all CI checks pass
4. Request review from maintainers

## Community Guidelines

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

## Questions?

- **General questions**: Open a discussion in the [main repository](https://github.com/agentsystems/agentsystems)
- **Bug reports**: Create an issue in this repository
- **Real-time chat**: Join our [Discord community](https://discord.gg/H26CEWfT)

We appreciate all contributions, from typo fixes to major features!