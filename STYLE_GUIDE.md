# AgentSystems UI Style Guide

This document establishes consistent patterns for styling, component organization, and code conventions across the AgentSystems UI codebase.

## Table of Contents

1. [CSS Variables and Theming](#css-variables-and-theming)
2. [Component Architecture](#component-architecture)
3. [Button System](#button-system)
4. [Status Indicators](#status-indicators)
5. [Layout Patterns](#layout-patterns)
6. [Import Conventions](#import-conventions)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [File Organization](#file-organization)

## CSS Variables and Theming

### Standard Theme Variables

**Always use these standardized CSS variables** - never create custom `--color-*` variables:

```css
/* Core Colors */
--bg                /* Main background */
--surface           /* Card/panel background */
--surface-2         /* Secondary surface (inputs, hover states) */
--surface-3         /* Tertiary surface (borders, dividers) */
--border            /* Standard border color */
--border-strong     /* Emphasized borders */

/* Typography */
--text              /* Primary text color */
--text-secondary    /* Secondary text (labels, descriptions) */
--text-muted        /* Muted text (hints, placeholders) */

/* Accent Colors */
--accent            /* Primary accent (buttons, links, highlights) */
--accent-2          /* Secondary accent */
--accent-3          /* Tertiary accent */

/* Status Colors */
--success           /* Success states (green) */
--warning           /* Warning states (yellow/orange) */
--error             /* Error states (red) */
--info              /* Info states (blue) */

/* Status Backgrounds */
--success-bg        /* Success background (10% opacity) */
--warning-bg        /* Warning background (10% opacity) */
--error-bg          /* Error background (10% opacity) */
--info-bg           /* Info background (10% opacity) */

/* Typography */
--font-sans         /* Primary font family */
--font-mono         /* Monospace font family */

/* Layout */
--radius            /* Standard border radius */
--radius-lg         /* Large border radius */
```

### ❌ Don't Do This

```css
/* WRONG - Custom color variables */
.myComponent {
  color: var(--color-text-primary);     /* ❌ Use --text instead */
  background: var(--color-bg-secondary); /* ❌ Use --surface-2 instead */
  border: 1px solid var(--color-border); /* ❌ Use --border instead */
}
```

### ✅ Do This

```css
/* CORRECT - Standard theme variables */
.myComponent {
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
}
```

## Component Architecture

### Component File Structure

```
src/components/
├── common/           # Shared components used across multiple pages
│   ├── Card.tsx
│   ├── StatusBadge.tsx
│   ├── ExecutionsTable.tsx
│   └── LoadingSpinner.tsx
├── dashboard/        # Dashboard-specific components
│   ├── StatsGrid.tsx
│   ├── RecentExecutions.tsx
│   └── SystemHealth.tsx
├── agents/          # Agent-specific components
│   ├── AgentCard.tsx
│   ├── AgentGrid.tsx
│   └── AgentFilters.tsx
└── layouts/         # Layout components
    ├── MainLayout.tsx
    ├── Header.tsx
    └── Sidebar.tsx
```

### Component Size Guidelines

**Maximum component size**: 150 lines of TSX code

**Break components down when they handle multiple concerns:**

❌ **Too Large (Dashboard before refactor)**:
```tsx
export default function Dashboard() {
  // 50+ lines of data fetching logic
  // 30+ lines of calculations  
  // 200+ lines of JSX with multiple sections
  return (
    <div>
      {/* Stats section */}
      {/* Executions section */}
      {/* Health section */}
    </div>
  )
}
```

✅ **Properly Modularized (Dashboard after refactor)**:
```tsx
export default function Dashboard() {
  // Data fetching and calculations only
  return (
    <div>
      <StatsGrid {...} />
      <RecentExecutions {...} />
      <SystemHealth {...} />
    </div>
  )
}
```

## Button System

### Global Button Classes

**Always use the global button system** - never create component-specific button styles:

```css
/* Base Classes */
.btn              /* Base button styling */
.btn-sm           /* Small button (height: 32px) */
.btn-lg           /* Large button (height: 40px) */

/* Style Variants */
.btn-subtle       /* Subtle styling (secondary actions) */
.btn-bright       /* Bright styling (primary actions) */
.btn-ghost        /* Minimal styling (tertiary actions) */

/* Color Variants */
.btn-success      /* Green background (success actions) */
.btn-danger       /* Red background (destructive actions) */
.btn-success-color /* Green text/border (success styling without background) */
.btn-danger-color  /* Red text/border (danger styling without background) */

/* Icon Buttons */
.btn-icon         /* Icon-only buttons (square) */
```

### ✅ Correct Button Usage

```tsx
// Primary action
<button className="btn btn-lg btn-bright">Save Changes</button>

// Secondary action  
<button className="btn btn-sm btn-subtle">Cancel</button>

// Destructive action
<button className="btn btn-sm btn-danger-color">Delete</button>

// Icon button
<button className="btn btn-icon btn-ghost" aria-label="Close">
  <XMarkIcon />
</button>
```

### ❌ Don't Create Custom Button Styles

```css
/* WRONG - Component-specific button styles */
.saveButton {
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  /* ... more styles ... */
}
```

## Status Indicators

### StatusBadge Component

**Always use the StatusBadge component** for status display:

```tsx
/* Agent Status */
<StatusBadge type="agent" status="running" />
<StatusBadge type="agent" status="stopped" />
<StatusBadge type="agent" status="not-created" />

/* Execution Status */
<StatusBadge type="execution" status="completed" />
<StatusBadge type="execution" status="failed" />
<StatusBadge type="execution" status="running" />
<StatusBadge type="execution" status="queued" />
```

### ❌ Don't Create Custom Status Styling

```css
/* WRONG - Custom status styles */
.status.running {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  /* ... */
}
```

## Layout Patterns

### Grid Layouts

**Use consistent grid patterns:**

```css
/* Agent/Card grids */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* Stats grids */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Two-column panels */
.panels {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}
```

### Container Styling

**Standard page container:**

```css
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}
```

## Import Conventions

### Import Order

**Always follow this import order:**

```tsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

// 3. API and stores (absolute paths)
import { agentsApi } from '@api/agents'
import { useAuthStore } from '@stores/authStore'

// 4. Hooks (absolute paths)
import { useAudio } from '@hooks/useAudio'

// 5. Components (absolute paths)
import Card from '@components/common/Card'
import StatusBadge from '@components/common/StatusBadge'

// 6. Utils (absolute paths)
import { handleError } from '@utils/errorHandling'

// 7. Types (absolute paths)
import type { AgentData } from '@types/api'

// 8. Styles (relative - same directory only)
import styles from './ComponentName.module.css'
```

### ✅ Use Absolute Path Aliases

```tsx
import { useThemeStore } from '@stores/themeStore'         // ✅
import Card from '@components/common/Card'                 // ✅
import { validateUrl } from '@utils/validation'            // ✅
```

### ❌ Don't Use Relative Imports for Cross-Module References

```tsx
import { useThemeStore } from '../../stores/themeStore'    // ❌
import Card from '../common/Card'                          // ❌
import { validateUrl } from '../../utils/validation'       // ❌
```

## Accessibility Guidelines

### ARIA Labels and Landmarks

**Always include proper ARIA attributes:**

```tsx
// Page-level landmarks
<div role="main" aria-label="Dashboard">
  <h1 id="page-title">Dashboard</h1>
  
  // Section landmarks
  <div role="region" aria-labelledby="stats-heading">
    <h2 id="stats-heading" className="sr-only">Statistics</h2>
    {/* stats content */}
  </div>
</div>

// Interactive elements
<button 
  className="btn btn-sm btn-subtle"
  aria-label="Start hello-world-agent"
  aria-describedby="start-button-help"
>
  Start
</button>
<div id="start-button-help" className="sr-only">
  This will start the agent container
</div>

// Data tables
<div role="table" aria-label="Recent executions">
  <div role="row">
    <span role="columnheader">Agent</span>
    <span role="columnheader">Status</span>
  </div>
  <div role="row">
    <span role="cell">hello-world-agent</span>
    <span role="cell">running</span>
  </div>
</div>
```

### Screen Reader Support

**Include screen reader only content:**

```tsx
// Hidden headings for structure
<h2 className="sr-only">System Statistics</h2>

// Live regions for dynamic content
<div aria-live="polite">
  {/* Dynamic status updates */}
</div>

// Error announcements
<div 
  id="error-announcer" 
  aria-live="assertive" 
  className="sr-only"
/>
```

## File Organization

### Directory Structure Standards

```
src/
├── components/
│   ├── common/           # Shared across multiple pages
│   ├── [feature]/        # Feature-specific components
│   └── layouts/          # Layout components
├── pages/
│   ├── [PageName].tsx    # Main page components
│   └── [feature]/        # Sub-pages
├── hooks/                # Custom React hooks
├── stores/               # State management
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── api/                  # API clients
├── config/               # Configuration files
└── styles/               # Global styles
```

### Naming Conventions

```tsx
// Components: PascalCase
export default function AgentCard() {}

// Files: PascalCase matching component name
AgentCard.tsx
AgentCard.module.css

// CSS Classes: camelCase
.agentCard { }
.agentName { }
.statusBadge { }

// Props interfaces: ComponentName + Props
interface AgentCardProps {
  agent: Agent
  onStart: () => void
}
```

## Error Handling Patterns

### Standardized Error Handling

**Always use the ErrorMessage component:**

```tsx
import ErrorMessage from '@components/ErrorMessage'
import { handleError, useErrorHandler } from '@utils/errorHandling'

function MyComponent() {
  const handleComponentError = useErrorHandler('MyComponent')
  
  try {
    // risky operation
  } catch (error) {
    const appError = handleComponentError(error, 'operation_name')
    return <ErrorMessage error={appError} showRetry={true} onRetry={retry} />
  }
}
```

### ❌ Don't Use Inline Error Handling

```tsx
// WRONG
{error && <div style={{color: 'red'}}>{error.message}</div>}
```

## Performance Guidelines

### Code Splitting

**Use lazy loading for route components:**

```tsx
import { lazy, Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner'

const Dashboard = lazy(() => import('@pages/Dashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### CSS Modules

**Never use inline styles** - always use CSS modules:

```tsx
// ✅ CORRECT
<div className={styles.container}>
  <span className={styles.label}>Label</span>
</div>

// ❌ WRONG
<div style={{ padding: '1rem', background: 'var(--surface)' }}>
  <span style={{ color: 'var(--text-secondary)' }}>Label</span>
</div>
```

## Quality Standards

### TypeScript

- **Strict mode enabled** - no `any` types except for external APIs
- **Explicit return types** for complex functions
- **Interface documentation** with JSDoc comments

### Testing

- **Component tests** for all public components
- **Integration tests** for complex user flows
- **Accessibility tests** using `@testing-library/jest-dom`

### Documentation

- **JSDoc comments** for all public components and functions
- **Usage examples** in component documentation
- **Props documentation** with descriptions and types

## Migration Checklist

When adding new components or modifying existing ones:

- [ ] Use standard CSS variables (no `--color-*`)
- [ ] Use global button classes (no custom button styles)
- [ ] Use StatusBadge for all status indicators
- [ ] Use absolute import paths (no `../`)
- [ ] Include comprehensive ARIA labels
- [ ] Use CSS modules (no inline styles)
- [ ] Add JSDoc documentation
- [ ] Follow component size guidelines (< 150 lines)
- [ ] Include error handling with ErrorMessage component
- [ ] Test accessibility with screen readers

## Tools and Commands

### Development

```bash
# Type checking
npm run type-check

# Linting  
npm run lint

# Testing
npm test

# Bundle analysis
npm run build:analyze

# Development server
npm run dev
```

### Build Optimization

```bash
# Production build with source maps
npm run build

# Performance analysis
npm run build:analyze
```

This style guide ensures consistency, maintainability, and professional quality across the entire AgentSystems UI codebase.