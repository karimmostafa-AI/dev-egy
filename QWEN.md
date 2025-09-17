# Project Context for DEV Egypt

## Project Overview

This is a full-stack e-commerce web application for DEV Egypt, a medical uniform retailer featuring Egyptian brands. The project uses a modern tech stack with a clear separation between client and server.

**Main Technologies:**
*   **Frontend:** React (with TypeScript), Vite, Tailwind CSS, shadcn/ui components, wouter for routing
*   **Backend:** Node.js with Express (TypeScript)
*   **Database:** PostgreSQL (managed via Drizzle ORM)
*   **Build Tools:** Vite for frontend bundling, esbuild for server bundling
*   **Deployment:** Configured for Replit hosting

**Architecture:**
*   **Client:** Located in `client/src`, follows a component-based structure with pages and reusable UI components. Uses `@/` alias for internal imports.
*   **Server:** Located in `server`, an Express application handling API routes and serving the built frontend.
*   **Shared:** Located in `shared`, contains code used by both client and server, like database schemas.
*   **Assets:** Static assets are in `attached_assets`.

## Building and Running

*   **Development:**
    *   `npm run dev`: Starts the development server using `tsx` for the server and Vite's dev server for the client.
*   **Building:**
    *   `npm run build`: Bundles both the client (using Vite) and the server (using esbuild) into the `dist` directory.
*   **Production:**
    *   `npm start`: Runs the production build from the `dist` directory.
*   **Database:**
    *   `npm run db:push`: Uses Drizzle Kit to push schema changes to the database.

## Development Conventions

*   **Frontend Structure:**
    *   Uses a component-based architecture with `pages` and `components` directories.
    *   Routing is handled by `wouter`.
    *   Styling is done with Tailwind CSS, following the design guidelines in `design_guidelines.md`.
    *   State management uses `@tanstack/react-query` for server state.
*   **Backend Structure:**
    *   Express application with middleware for logging.
    *   Serves both API endpoints and the static frontend build.
*   **Shared Code:**
    *   Database schemas are defined in `shared/schema.ts` using Drizzle ORM.
*   **Design:**
    *   Follows specific design guidelines for a professional medical uniform e-commerce aesthetic (see `design_guidelines.md`).
    *   Uses shadcn/ui components configured via `components.json`.
*   **Aliases:**
    *   `@/` points to `client/src`
    *   `@shared` points to `shared`
    *   `@assets` points to `attached_assets`

## Key Files and Directories

*   `package.json`: Defines dependencies, scripts, and project metadata.
*   `vite.config.ts`: Configuration for the Vite build tool and development server.
*   `tailwind.config.ts`: Configuration for Tailwind CSS.
*   `drizzle.config.ts`: Configuration for Drizzle ORM.
*   `server/index.ts`: Entry point for the Express server.
*   `client/src/App.tsx`: Main application component with routing.
*   `shared/schema.ts`: Database schema definitions.
*   `design_guidelines.md`: Detailed design specifications.