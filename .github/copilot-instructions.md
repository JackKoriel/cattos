# Cattos - AI Coding Guidelines

## Project Overview

Twitter-like app for cat photos with TypeScript monorepo architecture using Turbo, Yarn workspaces, React + Vite frontend, and Material-UI components.

## Architecture & Structure

**Monorepo Layout:**

- `apps/web` - React frontend with Vite (port 5173)
- `apps/api` - Express backend (planned, port 3000)
- `packages/ui` - Shared Material-UI components
- `packages/shared` - Domain types and API utilities

**Path Resolution:**
Use Vite aliases for imports: `@/` for web app, `@cattos/ui` and `@cattos/shared` for packages. TypeScript baseUrl paths are configured in [tsconfig.base.json](tsconfig.base.json) - avoid relying on these for future TS versions.

## Development Workflow

**Essential Commands:**

- `yarn dev` - Starts frontend and backend concurrently via Turbo
- `yarn build` - Production builds with dependency ordering
- `yarn lint` - ESLint across all workspaces
- `yarn format` - Prettier formatting for `*.{ts,tsx,json,md}`

**Package Management:**
Each workspace has independent dependencies. Add to specific packages with `yarn workspace @cattos/[name] add [package]`.

## Code Patterns

**Component Architecture:**

- UI components in `packages/ui/src/components/[name]/` with index.ts barrel exports
- Use Material-UI's `sx` prop and theme system consistently
- Export both component and Props interface from [packages/ui/src/index.ts](packages/ui/src/index.ts)

**Type System:**

- Domain models in `packages/shared/src/types/` (User, Post, ApiError, ApiResponse)
- Export all types through [packages/shared/src/types/index.ts](packages/shared/src/types/index.ts)
- API client pattern: `createApiClient()` and `handleApiError()` utilities

**State & Data Flow:**

- Currently UI-only with mock data in [apps/web/src/app/App.tsx](apps/web/src/app/App.tsx)
- Plan: API integration via shared utilities for consistent error handling
- Layout pattern: sidebar navigation with main content area using `@cattos/ui` Layout component

## Key Files to Reference

**Configuration:**

- [turbo.json](turbo.json) - Build pipeline and caching
- [apps/web/vite.config.ts](apps/web/vite.config.ts) - Path aliases and dev server
- [tsconfig.base.json](tsconfig.base.json) - Shared TypeScript configuration

**Domain Logic:**

- [packages/shared/src/types/post.types.ts](packages/shared/src/types/post.types.ts) - Core Post model with User relationship
- [packages/shared/src/utils/index.ts](packages/shared/src/utils/index.ts) - API client factory and error handling
- [packages/ui/src/components/layout/Layout.tsx](packages/ui/src/components/layout/Layout.tsx) - Sidebar + main content pattern

## Development Notes

- Phase 1 focus: Infrastructure setup (monorepo, shared packages, basic UI)
- Frontend uses React 18 + Material-UI v5 + TypeScript strict mode
- No backend API yet - prepare for Express integration
- ESModule configuration throughout (`"type": "module"`)
