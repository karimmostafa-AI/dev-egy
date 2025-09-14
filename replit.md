# Uniform Advantage E-commerce Clone

## Overview

This is a comprehensive medical uniform and scrubs e-commerce platform built as a clone of Uniform Advantage. The application targets healthcare professionals with a focus on professional medical apparel, scrubs, and accessories. The project emphasizes a clean, professional design aesthetic appropriate for the medical industry, featuring a three-tier navigation system, product showcases, and promotional content areas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system following medical industry aesthetics
- **Component Library**: Radix UI primitives with shadcn/ui components for consistent, accessible UI elements

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for both frontend and backend consistency
- **API Pattern**: RESTful API structure with `/api` prefix routing
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: Vite for fast development builds and hot module replacement

### Component Design System
- **Navigation**: Three-tier navigation structure (top bar, main header, category menu)
- **Layout**: Responsive grid system using Tailwind spacing primitives
- **Color Scheme**: Professional navy blue (#002956) and white theme with medical industry focus
- **Typography**: Clean sans-serif fonts with consistent weight hierarchy
- **Interactive Elements**: Hover effects, countdown timers, and promotional banners

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: User management system with username/password authentication
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Connection**: Neon serverless PostgreSQL for cloud database hosting

### Build System
- **Bundler**: Vite for frontend build optimization and development server
- **Compilation**: esbuild for server-side TypeScript compilation
- **Assets**: Static asset handling with path resolution for images and resources
- **Environment**: Development and production environment configuration

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Embla Carousel**: Carousel/slider functionality for product showcases
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type checking and enhanced developer experience
- **ESLint/Prettier**: Code quality and formatting (implied by modern React setup)
- **PostCSS**: CSS processing with Tailwind integration

### Database and ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema definition
- **Neon Database**: Serverless PostgreSQL hosting platform
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Form and Validation
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Integration with validation libraries
- **Zod**: Runtime type validation and schema validation

### Utilities
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility for dynamic styling
- **class-variance-authority**: Type-safe component variant management

### Development Environment
- **Replit**: Cloud development environment with specialized plugins
- **Vite Plugins**: Runtime error overlay and development enhancements