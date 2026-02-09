# Cattos 🐱

A lightweight social platform focused on cat photo sharing and interaction, built as an experimental project with a modern monorepo architecture using React, TypeScript, Express, and Turborepo.

## 🎯 Features

- **Authentication** – Register, login, and secure JWT-based auth with rotating refresh tokens
- **Post Management** – Create, like, bookmark, and reply to posts
- **User Profiles** – View and edit user profiles with follow/unfollow functionality
- **Real-time Interactions** – Like, bookmark, and comment on posts
- **Responsive UI** – Built with Material-UI and optimized for all devices
- **Type-Safe** – Full TypeScript across monorepo for consistency and reliability

## 📁 Project Structure

```
cattos/
├── apps/
│   ├── web/                    # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── app/           # App shell + routing
│   │   │   ├── pages/         # Route-level containers (thin)
│   │   │   ├── features/      # Feature UI modules (auth, posts, comments, ...)
│   │   │   ├── hooks/         # Reusable hooks (cross-feature)
│   │   │   ├── services/      # Web service layer (API calls, uploads, client)
│   │   │   ├── shared/        # Shared web-only UI/utilities (layout, helpers)
│   │   │   ├── assets/        # Static assets (images, fonts)
│   │   │   └── main.tsx       # Entry point
│   │   ├── vite.config.ts     # Vite configuration
│   │   └── package.json
│   │
│   └── api/                    # Express backend (Node + TypeScript)
│       ├── src/
│       │   ├── routes/        # API route definitions
│       │   ├── controllers/   # Request handlers
│       │   ├── services/      # Business logic
│       │   ├── middleware/    # Express middleware
│       │   ├── models/        # Mongoose schemas
│       │   ├── types/         # Backend-specific types
│       │   ├── config/        # Configuration files
│       │   ├── app.ts         # Express app setup
│       │   └── server.ts      # Server entry point
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared Material-UI components
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── theme.ts       # MUI theme configuration
│   │   │   └── index.ts       # Barrel exports
│   │   └── package.json
│   │
│   └── shared/                 # Shared types and utilities
│       ├── src/
│       │   ├── types/         # TypeScript interfaces (User, Post, etc.)
│       │   ├── utils/         # Shared utilities (API client, error handlers)
│       │   └── index.ts       # Barrel exports
│       └── package.json
│
├── turbo.json                  # Turborepo pipeline configuration
├── tsconfig.base.json          # Shared TypeScript config
├── package.json                # Root workspace config
└── README.md
```

## 🚀 Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5** - Build tool and dev server
- **Material-UI 5** - Component library
- **React Router 6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client

### Backend

- **Node.js 20+** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5.3** - Type safety
- **MongoDB** - Document database
- **Mongoose** - ODM
- **Vitest** - Unit testing
- **JWT** - Authentication tokens

### Monorepo Tools

- **Yarn Workspaces** - Package management
- **Turborepo** - Build system and task runner
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🛠️ Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- Yarn Classic 1.22+ ([Install](https://classic.yarnpkg.com/en/docs/install))
- MongoDB (local or Atlas connection string)
- Git

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cattos.git
cd cattos

# Install dependencies
yarn install
```

## 💻 Development

### Backend Setup

Create a `.env` file at the repo root with:

```env
MONGODB_URI=mongodb://localhost:27017/cattos
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

For MongoDB Atlas cloud database, use your connection string instead.

### Start Development Servers

```bash
yarn dev
```

This starts:

- **Frontend:** http://localhost:5173 (auto-opens in browser)
- **Backend:** http://localhost:3000

### Other Commands

```bash
yarn build                    # Build all apps for production
yarn start                    # Run production builds (after yarn build)
yarn prod                     # Build and start in one command
yarn lint                     # Lint all code
yarn format                   # Format code with Prettier
yarn format:check             # Check code formatting
yarn test                     # Run tests
yarn test:api                 # Run backend tests only
```

## 🏗️ Architecture Decisions

### Why Monorepo?

- **Code sharing:** Shared types and components between frontend and backend
- **Consistent tooling:** Single ESLint/Prettier configuration
- **Atomic changes:** Update types in one place, affects both apps
- **Scalability:** Easy to add new apps and packages

### Why Material-UI?

- **Component library:** Pre-built, accessible components
- **Customizable:** Themeable and extensible
- **Production-ready:** Battle-tested in production apps
- **TypeScript support:** Full type definitions

### Why Turborepo?

- **Fast builds:** Intelligent caching and parallel execution
- **Task pipelines:** Define dependencies between tasks
- **Monorepo scaling:** Optimized for multi-package workspaces

## 🔧 Configuration Notes

### TypeScript Path Aliases

- `@/` - Alias for `apps/web/src/`
- `@cattos/ui` - Shared UI components
- `@cattos/shared` - Shared types and utilities

### Port Configuration

- Frontend: `5173` (Vite default)
- Backend: `3000` (Express)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License.

## 📚 Learning Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Material-UI Docs](https://mui.com/material-ui/)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---
