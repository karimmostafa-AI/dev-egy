# DEV Egypt E-commerce Platform

A full-stack e-commerce web application for DEV Egypt, a medical uniform retailer featuring Egyptian brands.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Product Catalog**: Browse and search medical uniforms and accessories
- **Shopping Cart**: Add, remove, and update items in your cart
- **User Authentication**: Secure login and registration system
- **Order Management**: Track and manage your orders
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and customers
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **SEO Optimized**: Proper meta tags and structured data for search engines
- **Analytics & Tracking**: Integrated with Google Analytics for user behavior tracking

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **wouter** for routing
- **@tanstack/react-query** for server state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database (managed via Drizzle ORM)
- **JWT** for authentication
- **bcrypt** for password hashing

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks
- **Vitest** for testing

## Getting Started

### Prerequisites
- Node.js v18+
- npm v8+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dev-egypt.git
   cd dev-egypt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-jwt-secret-key
   DATABASE_URL=file:./dev.db
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and libraries
│   │   ├── pages/          # Page components
│   │   └── data/           # Sample/mock data
│   └── public/             # Static assets
├── server/                 # Backend Express API
│   ├── db/                 # Database setup and migrations
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   └── utils/              # Server utility functions
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema definitions
├── attached_assets/        # Uploaded images and files
├── dist/                   # Built application (generated during build)
└── docs/                   # Documentation files
```

## API Documentation

The backend API is organized into several route modules:

- `/api/auth`: Authentication endpoints (register, login, user profile)
- `/api/users`: User management endpoints
- `/api/products`: Product management and retrieval endpoints
- `/api/categories`: Category management endpoints
- `/api/brands`: Brand management endpoints
- `/api/collections`: Collection management endpoints
- `/api/cart`: Shopping cart endpoints
- `/api/orders`: Order management endpoints
- `/api/checkout`: Checkout process endpoints
- `/api/blog`: Blog post endpoints
- `/api/search`: Search functionality endpoints
- `/api/coupons`: Coupon/discount endpoints
- `/api/admin`: Administrative endpoints

Detailed API documentation can be found in [API_DOCS.md](docs/API_DOCS.md).

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, contact the development team at support@devegypt.com.