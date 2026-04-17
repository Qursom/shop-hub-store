# ShopHub -

A comprehensive e-commerce screening assignment for Angular frontend engineers. This monorepo contains the backend API, frontend boilerplate, and detailed documentation. The frontend is built with Angular 21 using standalone components.

## Quick Start

### Prerequisites

- Node.js v20.x (API) and v22.x (Frontend)
- Git for version control
- Modern web browser

### Setup

1. Install dependencies

   ```bash
   npm run install:all
   ```

2. Start the API server

   ```bash
   npm run start:api
   ```

3. Start the frontend development server
   ```bash
   npm run start:frontend
   ```

The application opens automatically at `http://localhost:4200`

### Available Commands

```bash
# Development
npm run start:api         # Start API server (http://localhost:3000)
npm run start:frontend    # Start frontend dev server (http://localhost:4200)

# Building
npm run build:frontend    # Production build (output: frontend/dist/)

# Testing
npm test                  # Run unit tests (Vitest)

# Code Quality
npm run lint              # Check for linting issues
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code with Prettier
```

## Running the Application with Docker

> **Docker is optional.** If you have Docker installed, you can use it to run both services together without needing to configure Node.js or manage local dependencies. If you prefer to run things locally, follow the [Quick Start](#quick-start) section above — both approaches work fine.

The repository includes a `docker-compose.yml` at the root that starts both the API (port 3000) and the frontend (port 4200) together. Each service has its own `Dockerfile` inside its directory.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running

### Start both services

```bash
# Build and start the API and frontend together
npm run docker:up
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:4200 |
| API      | http://localhost:3000 |

### Other useful commands

```bash
# Stop all running containers
npm run docker:down

# Stop and restart (full rebuild)
npm run docker:down:up

# Remove containers and volumes
npm run docker:clean

# View logs
docker compose logs -f
```

### Why use Docker?

- No need to install Node.js or worry about version mismatches
- Both services start with a single command
- Source files are volume-mounted, so code changes reflect without rebuilding

## Repository Structure

```
shop-hub/
├── api/                  # Backend API (Node.js / AWS Lambda)
├── frontend/             # Angular 21 frontend application
├── wiki/                 # Assignment documentation and tasks
└── docker-compose.yml    # Starts API + frontend together
```

See [api/README.md](./api/README.md) and [frontend/README.md](./frontend/README.md) for each project's internal structure.

## Documentation

### For Candidates

Start here if you're completing the assignment:

- **[api/README.md](./api/README.md)** - API project setup and overview
- **[frontend/README.md](./frontend/README.md)** - Project setup and overview
- **[wiki/candidate-tasks.md](./wiki/candidate-tasks.md)** - Task descriptions and requirements
- **[frontend/ source code](./frontend/src)** - Boilerplate scaffolding with TODO stubs to implement

## Assignment Overview

### Objective

Build a complete e-commerce shopping application demonstrating:

- API integration and data flow
- Angular component architecture
- State management with RxJS
- Form handling and validation
- Error handling and user feedback
- Responsive UI design
- Unit testing practices
- Code quality and maintainability

### 10 Core Features

1. **Product Listing** - Fetch and display products
2. **Shopping Cart** - Add/remove/update items
3. **Cart Counter** - Display item count in header
4. **Price Calculations** - Subtotal, tax, total
5. **Checkout Flow** - Customer info form and order submission
6. **Idempotent Orders** - Prevent duplicate orders
7. **Error Handling** - Graceful failure management
8. **UI Improvements** - Polished, responsive interface
9. **Unit Testing** - Service and component tests
10. **Code Quality** - Clean code and best practices

## Technology Stack

See [frontend/README.md](./frontend/README.md) for the full frontend tech stack, and [api/README.md](./api/README.md) for the API setup.

## Key Features

### Architecture

- Standalone Angular components
- Service-based state management
- Clear separation of concerns
- Reusable component structure
- Proper TypeScript typing

### Development Experience

- Hot module reloading
- Fast compilation
- Development and production builds
- Automatic browser refresh

### Code Quality

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Example test files
- Well-documented code

### User Experience

- Responsive design
- Loading states
- Error messages
- Form validation
- Smooth transitions

## Getting Started

### For Candidates

1. Read the documentation
   - [api/README.md](./api/README.md)
   - [frontend/README.md](./frontend/README.md)
   - [wiki/candidate-tasks.md](./wiki/candidate-tasks.md)

2. Understand the structure
   - Examine existing services
   - Review component setup
   - Check routing configuration

3. Install and run
   - `npm run install:all`
   - `npm run start:api`
   - `npm run start:frontend`
   - Verify in browser

4. Implement features
   - Start with product listing
   - Build cart functionality
   - Complete checkout flow
   - Write tests

5. Submit
   - Clean up code
   - Format and lint
   - Commit with clear messages
   - Submit as instructed

## Troubleshooting

### Port Already in Use

```bash
# Default port is 4200, change if needed:
ng serve --port 4300
```

### Node Version Issues

```bash
# Check Node version
node --version

# API requires Node 20.x — use nvm to switch if needed
nvm use 20

# Frontend requires Node 22.x — use nvm to switch if needed
nvm use 22
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm run install:all
```

### Tests Failing

```bash
# Run tests
npm test

# Check test file syntax
npm run lint
```

## Resources

### Documentation

- [Angular Official Docs](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Guide](https://rxjs.dev/guide/overview)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

### Learning

- Angular Style Guide
- RxJS Reactive Patterns
- Component Best Practices
- Testing Guidelines


## License
This is only for learning pruposes.


**Ready to start?** Begin with [frontend/README.md](./frontend/README.md)\
**Last Updated**: March 2026
