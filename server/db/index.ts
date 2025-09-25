import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../shared/schema";

// Create PostgreSQL database connection
const sql = postgres(process.env.DATABASE_URL!);

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