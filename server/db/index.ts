import 'dotenv/config';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../shared/schema-sqlite";

// Create SQLite database connection
const sqlite = new Database(process.env.DATABASE_URL!.replace('file:', ''));

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

export type DB = typeof db;

// Export all schema tables for easy access
export const {
  users,
  categories,
  brands,
  products,
  productImages,
  productOptions,
  productOptionValues,
  productVariants,
  productVariantOptionValues,
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