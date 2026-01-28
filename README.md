# Cattos 🐱

A Twitter-like app for cat photos and interactions - built as a personal training project to learn modern web development practices.

## 🎯 Project Overview

Cattos is a social media platform specifically designed for sharing and interacting with cat photos. Think Twitter, but exclusively for cat content. The project is split into multiple phases for incremental development and learning.

## 📁 Project Structure

```
Cattos/
├── apps/
│   ├── web/                    # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── app/           # Main App component
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
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Avatar/
│   │   │   │   ├── Skeleton/
│   │   │   │   └── Layout/
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
- **Emotion** - CSS-in-JS styling

### Backend

- **Node.js 20+** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5.3** - Type safety
- **MongoDB** _(Phase 2)_ - Database
- **Mongoose** _(Phase 2)_ - ODM

### Monorepo Tools

- **Yarn Workspaces** - Package management
- **Turborepo** - Build system and task runner
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Authentication _(Phase 2)_

- **AWS Cognito** - User authentication
- **JWT** - Token-based auth

## 🛠️ Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- Yarn Classic 1.22+ ([Install](https://classic.yarnpkg.com/en/docs/install))
- Git

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Cattos

# Install all dependencies
yarn install
```

## 💻 Development

### Backend environment variables

The API requires MongoDB + a JWT signing secret. Copy the example file and fill it in:

```bash
# Option A (recommended): put it at repo root for turbo commands
copy apps\api\.env.example .env

# Option B: put it in the API package if you run commands from there
copy apps\api\.env.example apps\api\.env
```

Required keys:

- `MONGODB_URI` (Mongo connection string)
- `JWT_ACCESS_SECRET` (random long secret used to sign access tokens)

Notes:

- The API loads `.env` from either the repo root or `apps/api` (plus optional `.env.local`).
- If these vars are missing, the API will exit on startup instead of running and later returning generic 500s.

### Start Development Servers

```bash
yarn dev
```

This starts:

- Frontend at http://localhost:5173 (auto-opens in browser)
- Backend at http://localhost:3000

### Stop Servers

```bash
# Option 1: Press Ctrl+C in the terminal
# Option 2: Use the stop command
yarn stop
```

### Other Commands

```bash
yarn build        # Build all apps for production
yarn start        # Run production builds (after yarn build)
yarn prod         # Build and start in one command
yarn lint         # Lint all code
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

## 📋 Development Phases

### ✅ Phase 1: Infrastructure Setup (COMPLETED)

**Goal:** Set up the monorepo structure with a basic "Hello World" UI

**Completed Tasks:**

- [x] Monorepo setup with Yarn workspaces and Turborepo
- [x] TypeScript configuration with project references
- [x] Shared types package (`@cattos/shared`)
  - [x] User, Post, ApiResponse, ApiError types
  - [x] Axios API client utilities
- [x] Shared UI components package (`@cattos/ui`)
  - [x] Material-UI wrapper components (Button, Card, Avatar, Skeleton, Layout)
- [x] React frontend with Vite
  - [x] Twitter-like skeleton UI
  - [x] Sample posts with cat theme
  - [x] Auto-open browser on `yarn dev`
- [x] Express backend API
  - [x] Health check endpoint (`/api/health`)
  - [x] CORS configuration
  - [x] Layered architecture (routes → controllers → services)
- [x] Development tooling
  - [x] ESLint and Prettier
  - [x] Hot reload for both frontend and backend
  - [x] Parallel dev server execution

**Current State:**

- Frontend displays Twitter-like skeleton with mock cat posts
- Backend returns "Hello World from Cattos API! 🐱" from health endpoint
- Both servers run simultaneously with `yarn dev`

### 🔄 Phase 2: Backend Core & Authentication (PLANNED)

**Goal:** Add database, authentication, and basic API endpoints

**Planned Tasks:**

- [ ] MongoDB setup
  - [ ] Database connection with Mongoose
  - [ ] User schema/model
  - [ ] Post schema/model
- [ ] AWS Cognito integration
  - [ ] User registration
  - [ ] User login/logout
  - [ ] JWT token validation middleware
- [ ] API endpoints
  - [ ] `POST /api/auth/register` - Register new user
  - [ ] `POST /api/auth/login` - User login
  - [ ] `GET /api/posts` - Get all posts
  - [ ] `POST /api/posts` - Create new post
  - [ ] `GET /api/posts/:id` - Get single post
  - [ ] `DELETE /api/posts/:id` - Delete post
- [ ] Error handling middleware
- [ ] Environment variables setup (.env)

### 🔄 Phase 3: Frontend Features (PLANNED)

**Goal:** Connect frontend to backend and implement core features

**Planned Tasks:**

- [ ] Authentication UI
  - [ ] Login page
  - [ ] Register page
  - [ ] Protected routes
  - [ ] Auth context/state management
- [ ] Post feed
  - [ ] Fetch and display real posts from API
  - [ ] Infinite scroll pagination
- [ ] Create post
  - [ ] Post creation form
  - [ ] Image upload
  - [ ] Post validation
- [ ] User profile
  - [ ] View user profile
  - [ ] Edit profile
- [ ] Navigation
  - [ ] Home feed
  - [ ] Profile page
  - [ ] Create post page

### 🔄 Phase 4: Social Features (PLANNED)

**Goal:** Add interactions and social functionality

**Planned Tasks:**

- [ ] Like/unlike posts
- [ ] Comment on posts
- [ ] Follow/unfollow users
- [ ] User feed (posts from followed users)
- [ ] Notifications
- [ ] Search functionality (users and posts)

### 🔄 Phase 5: Advanced Features (PLANNED)

**Goal:** Polish and add advanced functionality

**Planned Tasks:**

- [ ] Real-time updates (WebSockets)
- [ ] Image optimization and CDN
- [ ] Analytics dashboard
- [ ] Moderation tools
- [ ] Dark mode
- [ ] Mobile responsive design improvements
- [ ] Performance optimization
- [ ] SEO optimization

### 🔄 Phase 6: Deployment (PLANNED)

**Goal:** Deploy to production

**Planned Tasks:**

- [ ] Frontend deployment (Vercel/Netlify)
- [ ] Backend deployment (Railway/AWS/Heroku)
- [ ] Database hosting (MongoDB Atlas)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment configuration
- [ ] Domain setup
- [ ] SSL certificates
- [ ] Monitoring and logging

## 🏗️ Architecture Decisions

### Why Monorepo?

- **Code sharing:** Shared types and components between frontend and backend
- **Consistent tooling:** Single ESLint/Prettier configuration
- **Atomic changes:** Update types in one place, affects both apps
- **Learning:** Experience with modern monorepo practices

### Why Material-UI?

- **Component library:** Pre-built, accessible components
- **Customizable:** Can be wrapped and customized
- **Production-ready:** Battle-tested in production apps
- **TypeScript support:** Full type definitions

### Why Turborepo?

- **Fast builds:** Intelligent caching and parallel execution
- **Task pipelines:** Define dependencies between tasks
- **Remote caching:** Share cache across team (future)

### Folder Structure Best Practices

- **Separation of concerns:** Routes → Controllers → Services
- **Colocation:** Components with their styles and tests
- **Barrel exports:** Clean import paths via index.ts files
- **Type safety:** Shared types prevent API contract mismatches

## 🔧 Configuration Notes

### TypeScript Path Aliases

- `@/` - Alias for `apps/web/src/`
- `@cattos/ui` - Shared UI components
- `@cattos/shared` - Shared types and utilities

**Note:** `baseUrl` path mapping may be deprecated in future TypeScript versions. Migrate to imports field or other solutions when needed.

### Port Configuration

- Frontend: `5173` (Vite default)
- Backend: `3000` (Express)

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are welcome!

## 📝 License

MIT

## 🐛 Known Issues

None currently - Phase 1 complete and working!

## 📚 Learning Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Material-UI Docs](https://mui.com/material-ui/)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Current Phase:** Phase 1 ✅ Complete  
**Next Phase:** Phase 2 - Backend Core & Authentication  
**Last Updated:** January 15, 2026
