# ShopHub Frontend

Angular 21 frontend application for the ShopHub screening assignment.

## Prerequisites

- Node.js v22.16.0+
- npm 10.9.2+

## Setup

```bash
# Install all workspace dependencies (run from repo root)
npm run install:all

# Start API server (run from repo root)
npm run start:api

# Start frontend development server (run from repo root, opens at http://localhost:4200)
npm run start:frontend
```

## Available Commands

Run all commands from the **repo root**:

```bash
# Development
npm run start:frontend    # Start dev server with hot reload

# Building
npm run build:frontend    # Production build (output: frontend/dist/)

# Testing
npm test                  # Run unit tests (Vitest)

# Code Quality
npm run lint              # Check for linting issues
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code with Prettier
```

## Project Structure

```
src/app/
├── components/
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout form and order submission
│   ├── header/         # Navigation bar with cart counter
│   ├── login/          # Login form (fully implemented)
│   └── product-list/   # Product grid display
├── constants/
│   └── app.constants.ts
├── guards/
│   └── auth.guard.ts   # Route guards (fully implemented)
├── interceptors/
│   └── api-interceptor.ts  # Auth header injection (fully implemented)
├── models/
│   ├── cart.ts         # Cart / CartItem interfaces
│   └── product.ts      # Product interface
├── services/
│   ├── api.ts          # HTTP client wrapper (fully implemented)
│   ├── auth.ts         # Auth state management (fully implemented)
│   ├── cart.ts         # Cart state — TODO stubs to implement
│   ├── order.ts        # Order / checkout — TODO stubs to implement
│   └── product.ts      # Product fetching — TODO stubs to implement
└── utils/
    └── log.ts          # Logger utility (fully implemented)
```

## Project Structure Highlights

### Components

```
src/app/components/
├── header/              # Navigation bar with cart counter
├── product-list/        # Product grid display
├── cart/                # Shopping cart page
└── checkout/            # Order form & submission
```

### Services

```
src/app/services/
├── api.ts       # HTTP communication
├── auth.ts      # Authentication state
├── product.ts   # Product business logic
├── cart.ts      # Cart state management
└── order.ts     # Order operations
```

### Models

```
src/app/models/
├── product.ts   # Product interface
└── cart.ts      # Cart / CartItem interfaces
```

### Guards

```
src/app/guards/
└── auth.guard.ts   # authGuard (protected routes) + guestGuard (/login)
```

### Utils

```
src/app/utils/
└── log.ts   # Logger — centralized console wrapper with env checks
```

### Interceptors

```
src/app/interceptors/
└── api-interceptor.ts   # Injects Authorization header on every outgoing request
```

## Technology Stack

- **Angular 21** — Standalone components, signals-ready
- **TypeScript 5** — Strict mode enabled
- **RxJS 7.8** — Reactive state management
- **TailwindCSS 3.4** — Utility-first styling
- **Reactive Forms** — Form handling and validation
- **Vitest** — Unit test runner
- **jsdom** — Browser-like test environment

## What's Already Provided

- Full application scaffolding (routing, guards, interceptors, app config)
- Login component — fully working
- All HTML templates with structure and Tailwind styling
- Service class skeletons with JSDoc describing what each method must do
- Component class skeletons with JSDoc and `// TODO:` comments

## What You Need to Implement

See [`../wiki/candidate-tasks.md`](../wiki/candidate-tasks.md) for the full task list.

## API

The backend runs at `http://localhost:3000`. See [`../api/README.md`](../api/README.md) for endpoint documentation and how to start the API server.

## Troubleshooting

**Port already in use:**

```bash
ng serve --port 4300
```

**Dependencies not installing:**

```bash
rm -rf node_modules
npm cache clean --force
npm run install:all
```
