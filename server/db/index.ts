import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../../shared/schema";

// Create PostgreSQL database connection using Neon
const sql = neon(process.env.DATABASE_URL!);

// Create drizzle instance
export const db = drizzle(sql, { schema });

export type DB = typeof db;

// Export all schema tables for easy access
export const {
  users,
  categories,
  brands,
  products,
  productImages,
  passwordResetTokens,
  addresses,
  orders,
  orderItems,
  carts,
  cartItems,
  wishlists,
  wishlistItems,
  reviews,
  collections,
  collectionProducts,
  coupons,
  blogPosts,
  blogCategories,
  blogPostCategories,
  payments
} = schema;