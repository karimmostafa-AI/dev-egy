# Backend API Plan for DEV Egypt E-commerce Application

## Overview
This document outlines the comprehensive backend API plan for the DEV Egypt e-commerce application. We will implement a RESTful API using Node.js with Express and SQLite as the database, using Drizzle ORM for database operations.

## Database Design

### Entities

1. **Users**
   - id (UUID)
   - fullName (string)
   - email (string, unique)
   - passwordHash (string)
   - createdAt (datetime)
   - updatedAt (datetime)

2. **Categories**
   - id (UUID)
   - name (string)
   - slug (string, unique)
   - description (text)
   - parentId (UUID, nullable - for hierarchical categories)
   - createdAt (datetime)
   - updatedAt (datetime)

3. **Brands**
   - id (UUID)
   - name (string)
   - slug (string, unique)
   - description (text)
   - logo (string - URL to logo image)
   - isFeatured (boolean)
   - createdAt (datetime)
   - updatedAt (datetime)

4. **Products**
   - id (UUID)
   - name (string)
   - slug (string, unique)
   - description (text)
   - shortDescription (string)
   - sku (string, unique)
   - price (decimal)
   - comparePrice (decimal, nullable)
   - costPerItem (decimal, nullable)
   - categoryId (UUID)
   - brandId (UUID)
   - isFeatured (boolean)
   - isAvailable (boolean)
   - inventoryQuantity (integer)
   - allowOutOfStockPurchases (boolean)
   - weight (decimal, nullable)
   - weightUnit (string, nullable)
   - createdAt (datetime)
   - updatedAt (datetime)

5. **ProductImages**
   - id (UUID)
   - productId (UUID)
   - url (string)
   - alt (string)
   - isPrimary (boolean)
   - sortOrder (integer)
   - createdAt (datetime)

6. **ProductVariants**
   - id (UUID)
   - productId (UUID)
   - name (string)
   - sku (string, unique)
   - price (decimal)
   - comparePrice (decimal, nullable)
   - inventoryQuantity (integer)
   - isAvailable (boolean)
   - weight (decimal, nullable)
   - weightUnit (string, nullable)
   - createdAt (datetime)
   - updatedAt (datetime)

7. **ProductOptions**
   - id (UUID)
   - productId (UUID)
   - name (string) - e.g., "Size", "Color"
   - createdAt (datetime)
   - updatedAt (datetime)

8. **ProductOptionValues**
   - id (UUID)
   - optionId (UUID)
   - value (string) - e.g., "Small", "Red"
   - createdAt (datetime)

9. **VariantOptions**
   - id (UUID)
   - variantId (UUID)
   - optionValueId (UUID)
   - createdAt (datetime)

10. **Collections**
    - id (UUID)
    - name (string)
    - slug (string, unique)
    - description (text)
    - image (string - URL to collection image)
    - isPublished (boolean)
    - createdAt (datetime)
    - updatedAt (datetime)

11. **CollectionProducts**
    - id (UUID)
    - collectionId (UUID)
    - productId (UUID)
    - sortOrder (integer)
    - createdAt (datetime)

12. **Addresses**
    - id (UUID)
    - userId (UUID)
    - firstName (string)
    - lastName (string)
    - company (string, nullable)
    - address1 (string)
    - address2 (string, nullable)
    - city (string)
    - province (string)
    - country (string)
    - zip (string)
    - phone (string, nullable)
    - isDefault (boolean)
    - createdAt (datetime)
    - updatedAt (datetime)

13. **Orders**
    - id (UUID)
    - userId (UUID, nullable)
    - orderNumber (string, unique)
    - status (string) - pending, confirmed, processing, shipped, delivered, cancelled
    - subtotal (decimal)
    - shippingCost (decimal)
    - tax (decimal)
    - total (decimal)
    - currency (string)
    - firstName (string)
    - lastName (string)
    - email (string)
    - phone (string, nullable)
    - billingAddressId (UUID)
    - shippingAddressId (UUID)
    - notes (text, nullable)
    - paymentMethod (string)
    - paymentStatus (string) - pending, paid, failed, refunded
    - shippedAt (datetime, nullable)
    - deliveredAt (datetime, nullable)
    - cancelledAt (datetime, nullable)
    - createdAt (datetime)
    - updatedAt (datetime)

14. **OrderItems**
    - id (UUID)
    - orderId (UUID)
    - productId (UUID)
    - variantId (UUID, nullable)
    - name (string)
    - sku (string)
    - price (decimal)
    - quantity (integer)
    - createdAt (datetime)

15. **Carts**
    - id (UUID)
    - userId (UUID, nullable)
    - sessionId (string, nullable)
    - createdAt (datetime)
    - updatedAt (datetime)

16. **CartItems**
    - id (UUID)
    - cartId (UUID)
    - productId (UUID)
    - variantId (UUID, nullable)
    - quantity (integer)
    - createdAt (datetime)
    - updatedAt (datetime)

17. **Wishlists**
    - id (UUID)
    - userId (UUID)
    - name (string)
    - isPublic (boolean)
    - createdAt (datetime)
    - updatedAt (datetime)

18. **WishlistItems**
    - id (UUID)
    - wishlistId (UUID)
    - productId (UUID)
    - createdAt (datetime)

19. **Reviews**
    - id (UUID)
    - userId (UUID)
    - productId (UUID)
    - rating (integer)
    - title (string)
    - comment (text)
    - isVerifiedPurchase (boolean)
    - isApproved (boolean)
    - createdAt (datetime)
    - updatedAt (datetime)

20. **Coupons**
    - id (UUID)
    - code (string, unique)
    - type (string) - percentage, fixed_amount
    - value (decimal)
    - minimumAmount (decimal, nullable)
    - usageLimit (integer, nullable)
    - usedCount (integer, default: 0)
    - isActive (boolean)
    - startDate (datetime)
    - endDate (datetime, nullable)
    - createdAt (datetime)
    - updatedAt (datetime)

21. **BlogPosts**
    - id (UUID)
    - title (string)
    - slug (string, unique)
    - content (text)
    - excerpt (string)
    - featuredImage (string, nullable)
    - isPublished (boolean)
    - publishedAt (datetime, nullable)
    - authorId (UUID)
    - createdAt (datetime)
    - updatedAt (datetime)

22. **BlogCategories**
    - id (UUID)
    - name (string)
    - slug (string, unique)
    - description (text)
    - createdAt (datetime)
    - updatedAt (datetime)

23. **BlogPostCategories**
    - id (UUID)
    - postId (UUID)
    - categoryId (UUID)
    - createdAt (datetime)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/me/password` - Update user password
- `GET /api/users/me/addresses` - Get user addresses
- `POST /api/users/me/addresses` - Add new address
- `PUT /api/users/me/addresses/:id` - Update address
- `DELETE /api/users/me/addresses/:id` - Delete address
- `GET /api/users/me/orders` - Get user orders
- `GET /api/users/me/wishlist` - Get user wishlist
- `POST /api/users/me/wishlist` - Add item to wishlist
- `DELETE /api/users/me/wishlist/:id` - Remove item from wishlist

### Products
- `GET /api/products` - Get all products with filtering, sorting, and pagination
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add product review (authenticated)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand details
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get collection details

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/status` - Get order status

### Checkout
- `POST /api/checkout` - Process checkout
- `GET /api/checkout/session/:id` - Get checkout session details

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get blog post details
- `GET /api/blog/categories` - Get all blog categories
- `GET /api/blog/categories/:id` - Get blog category details

### Search
- `GET /api/search` - Search products, categories, brands, etc.

### Coupons
- `POST /api/coupons/apply` - Apply coupon to cart

## Implementation Plan

### Phase 1: Database Setup
1. Install SQLite and Drizzle ORM SQLite adapter
2. Update Drizzle configuration for SQLite
3. Create database schema files for all entities
4. Create migration files
5. Set up database connection

### Phase 2: Core API Implementation
1. Implement authentication endpoints
2. Implement user management endpoints
3. Implement product management endpoints
4. Implement category and brand endpoints
5. Implement cart endpoints
6. Implement order endpoints

### Phase 3: Advanced Features
1. Implement search functionality
2. Implement blog endpoints
3. Implement coupon system
4. Implement review system
5. Implement collection endpoints

### Phase 4: Testing and Optimization
1. Write unit tests for all endpoints
2. Implement input validation
3. Add error handling
4. Add logging
5. Optimize database queries
6. Add caching where appropriate

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JWT
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Security Considerations
- Implement rate limiting
- Use helmet for security headers
- Sanitize user inputs
- Implement proper authentication and authorization
- Use HTTPS in production
- Hash passwords with bcrypt
- Validate and sanitize all inputs
- Implement proper error handling without exposing sensitive information

## Performance Considerations
- Implement database indexing
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Optimize database queries
- Use compression for responses
- Implement connection pooling

This comprehensive API plan will provide all the necessary functionality for the DEV Egypt e-commerce application with a robust, scalable, and secure backend.