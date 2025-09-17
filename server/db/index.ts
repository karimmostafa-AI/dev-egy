import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../shared/schema";

// Create SQLite database connection
const sqlite = new Database("dev-egypt.db");

// Enable foreign key constraints
sqlite.exec("PRAGMA foreign_keys = ON;");

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

export type DB = typeof db;

// Helper function to close the database connection
export function closeDatabase() {
  sqlite.close();
}

// Export all schema tables for easy access
export const {
  users,
  categories,
  brands,
  products,
  productImages,
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
  blogPostCategories
} = schema;