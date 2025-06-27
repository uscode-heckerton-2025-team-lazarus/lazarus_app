# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LazarusApp is a Phoenix (Elixir) web application with React frontend using Inertia.js for seamless SPA-like experience. The project combines:

- **Backend**: Phoenix 1.7.21 framework with Ecto for database operations
- **Frontend**: React 19.1.0 with Inertia.js 2.0 for client-server communication
- **Database**: PostgreSQL with Ecto migrations
- **Authentication**: Built-in user authentication system with bcrypt
- **Styling**: Tailwind CSS with custom components
- **Build Tools**: esbuild for JavaScript/JSX bundling, Tailwind for CSS processing

## Development Commands

### Setup and Dependencies
```bash
mix setup                    # Install deps, setup DB, build assets
mix deps.get                 # Install Elixir dependencies
```

### Running the Application
```bash
mix phx.server              # Start Phoenix server (http://localhost:4000)
iex -S mix phx.server       # Start server in interactive Elixir shell
```

### Database Operations
```bash
mix ecto.create             # Create database
mix ecto.migrate            # Run migrations  
mix ecto.reset              # Drop and recreate database with data
mix ecto.setup              # Create, migrate, and seed database
```

### Asset Management
```bash
mix assets.build            # Build CSS and JS assets
mix assets.deploy           # Build and minify assets for production
mix tailwind lazarus_app    # Build Tailwind CSS
mix esbuild lazarus_app     # Build JavaScript with esbuild
```

### Testing
```bash
mix test                    # Run all tests (includes DB setup)
mix test test/path/to/specific_test.exs  # Run specific test file
```

## Architecture

### Backend Structure
- `lib/lazarus_app/`: Core business logic and contexts
  - `accounts.ex`: User account management context
  - `accounts/`: User-related schemas and modules (User, UserToken, UserNotifier)
- `lib/lazarus_app_web/`: Web layer (controllers, views, templates)
  - `controllers/`: HTTP request handlers with authentication logic
  - `serializers/`: JSON serialization for Inertia.js data transfer
  - `user_auth.ex`: Authentication pipeline and helper functions

### Frontend Structure  
- `assets/js/`: React application
  - `app.jsx`: Main application entry point
  - `components/`: Reusable React components (alert, flash_message, layout)
  - `pages/`: Page components corresponding to Phoenix routes
  - `lib/utils.ts`: Utility functions (includes tailwind-merge for CSS)

### Authentication Flow
- Custom authentication system with session-based auth
- Pipeline architecture: `:authenticated`, `:unauthenticated`, `:auth_optional`
- Routes protected by `AuthPlug` with different user requirement levels
- User authentication state passed to React via Inertia.js

### Inertia.js Integration
- Server-side rendering with client-side navigation
- Data serialized via `UserSerializer` for consistent frontend state
- React components receive server data as props through Inertia

### Asset Pipeline
- esbuild handles JSX/TypeScript compilation with code splitting
- Tailwind processes CSS with custom configuration
- Assets built to `priv/static/assets/` for Phoenix static file serving