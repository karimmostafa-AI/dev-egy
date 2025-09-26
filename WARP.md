# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DEV Egypt is a full-stack e-commerce platform for medical uniforms built with React/TypeScript frontend and Node.js/Express backend using SQLite database. The architecture follows a clear separation of concerns with shared TypeScript schemas and PostgreSQL-compatible schema definitions (though currently running on SQLite).

## Essential Development Commands

### Core Development
```powershell
# Start development server (runs both frontend and backend on port 5000)
npm run dev

# Build for production (bundles client with Vite, server with esbuild)
npm run build

# Start production server
npm start

# Type checking across entire project
npm run check
```

### Database Operations
```powershell
# Push schema changes to database (uses Drizzle migrations)
npm run db:push

# Seed database with sample data
npm run db:seed

# Initialize SQLite database (first-time setup)
npm run db:init-sqlite
```

### Development Utilities
```powershell
# Create admin user for testing
tsx create-admin-user.ts

# Generate admin authentication token
tsx generate-admin-token.ts

# Test API endpoints
tsx test-admin-apis.ts
```

### Testing
```powershell
# Run tests
npm test

# Run tests with UI
npm test:ui

# Run tests once
npm run test:run

# Generate test coverage
npm run test:coverage
```

### Single Test Execution
```powershell
# Run specific test file
npx vitest run path/to/test-file.test.ts

# Run tests matching pattern
npx vitest run --reporter=verbose --grep "auth"
```

## Architecture & Code Structure

### High-Level Architecture
- **Frontend**: React + TypeScript in `client/src` with component-based architecture
- **Backend**: Express server in `server/` with modular route handlers
- **Database**: SQLite with Drizzle ORM for schema management
- **Shared Code**: Common schemas and types in `shared/`
- **Build System**: Vite for frontend, esbuild for backend

### Key Architectural Patterns

**Frontend Architecture:**
- **Pages**: Route components in `client/src/pages/` (lazy-loaded for performance)
- **Components**: Reusable UI components in `client/src/components/` using shadcn/ui
- **Routing**: wouter for client-side routing with lazy loading
- **State Management**: @tanstack/react-query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design system (see design_guidelines.md)

**Backend Architecture:**
- **Modular Routes**: Each API domain has its own route file in `server/routes/`
- **Service Layer**: Business logic separated into service modules
- **Database Layer**: Drizzle ORM with schema definitions in `shared/schema.ts`
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Middleware**: Request logging, error handling, and static file serving

**Database Schema Architecture:**
- **User Management**: Users, addresses, authentication
- **Product Catalog**: Products, categories, brands, collections, product images
- **E-commerce**: Carts, cart items, orders, order items, payments
- **Content**: Blog posts, categories, reviews, coupons
- **Collections**: Wishlists, collections, and product relationships

### Import Aliases
- `@/` → `client/src` (frontend imports)
- `@shared` → `shared` (shared schemas/types)
- `@assets` → `attached_assets` (static assets)

### API Structure
All API routes follow RESTful conventions under `/api/`:
- `/api/auth` - Authentication (register, login, profile)
- `/api/users` - User management
- `/api/products` - Product CRUD with filtering, sorting, pagination
- `/api/categories` - Category management
- `/api/brands` - Brand management
- `/api/collections` - Collection management
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order management and tracking
- `/api/checkout` - Checkout process
- `/api/payments` - Payment processing
- `/api/blog` - Blog content management
- `/api/search` - Search functionality
- `/api/coupons` - Discount/coupon management
- `/api/admin` - Administrative endpoints

## Development Context

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, wouter, Framer Motion
- **Backend**: Node.js, Express, TypeScript, SQLite, Drizzle ORM, JWT, bcrypt
- **Testing**: Vitest, Testing Library
- **Build**: Vite (client), esbuild (server)
- **Deployment**: Configured for Replit hosting

### Database Management
- **ORM**: Drizzle with SQLite driver (better-sqlite3)
- **Migrations**: Managed through Drizzle Kit with config in `drizzle.config.ts`
- **Schema**: Centralized in `shared/schema.ts` with Zod validation
- **Development DB**: `dev-egypt.db` in root directory

### Design System
- **Component Library**: shadcn/ui components configured via `components.json`
- **Styling**: Tailwind CSS with custom color palette for medical industry
- **Design Guidelines**: Detailed specifications in `design_guidelines.md`
- **Responsive**: Mobile-first approach with consistent spacing system

### Environment Configuration
Required environment variables:
- `NODE_ENV` - development/production
- `PORT` - Server port (default 5000)  
- `JWT_SECRET` - JWT signing secret
- `DATABASE_URL` - SQLite database path

## Debugging & Development Tips

### Common Development Tasks
```powershell
# Check database tables and data
sqlite3 dev-egypt.db ".tables"
sqlite3 dev-egypt.db "SELECT * FROM users LIMIT 5;"

# Reset database (careful!)
rm dev-egypt.db
npm run db:push
npm run db:seed

# Check API endpoints
curl http://localhost:5000/api/health
```

### File Structure Understanding
- **Client Entry**: `client/src/main.tsx` → `App.tsx` (routing setup)
- **Server Entry**: `server/index.ts` → `routes.ts` (API registration)
- **Database**: `shared/schema.ts` (single source of truth for all tables)
- **Build Output**: `dist/` (production builds)

### Key Files to Understand
- `package.json` - All scripts and dependencies
- `vite.config.ts` - Build configuration and aliases
- `server/routes.ts` - Central API route registration
- `client/src/App.tsx` - Frontend routing and lazy loading setup
- `shared/schema.ts` - Complete database schema with relationships

### Authentication Flow
- Registration/login through `/api/auth` routes
- JWT tokens stored client-side for authenticated requests
- Role-based access control (customer, admin, super_admin, manager)
- Password hashing with bcrypt before database storage

### Development Workflow
1. Frontend changes hot-reload automatically via Vite
2. Backend changes require server restart (tsx watches for changes)
3. Database schema changes: modify `shared/schema.ts` → run `npm run db:push`
4. New components use shadcn/ui: `npx shadcn-ui@latest add button`
5. API routes follow pattern: create service → create route → register in `routes.ts`

This is a production-ready e-commerce platform with comprehensive admin functionality, authentication, payment processing integration, and mobile-responsive design optimized for the medical uniform industry.