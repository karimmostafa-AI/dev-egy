import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, numeric, primaryKey, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Helper function to generate UUID for SQLite
const generateUUID = () => randomUUID();

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

const baseInsertUserSchema = createInsertSchema(users);
export const insertUserSchema = baseInsertUserSchema.omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6), // Password will be handled separately for hashing
});

export type InsertUser = z.infer<typeof insertUserSchema> & { password?: string };
export type User = typeof users.$inferSelect;

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Brands table
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Products table
export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  sku: text("sku").notNull().unique(),
  price: numeric("price").notNull(),
  comparePrice: numeric("compare_price"),
  costPerItem: numeric("cost_per_item"),
  categoryId: text("category_id").references(() => categories.id),
  brandId: text("brand_id").references(() => brands.id),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  inventoryQuantity: integer("inventory_quantity").default(0),
  allowOutOfStockPurchases: integer("allow_out_of_stock_purchases", { mode: "boolean" }).default(false),
  weight: numeric("weight"),
  weightUnit: text("weight_unit"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Product images table
export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  productId: text("product_id").references(() => products.id).notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Addresses table
export const addresses = sqliteTable("addresses", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  province: text("province").notNull(),
  country: text("country").notNull(),
  zip: text("zip").notNull(),
  phone: text("phone"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Orders table
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  subtotal: numeric("subtotal").notNull(),
  shippingCost: numeric("shipping_cost").notNull().default("0"),
  tax: numeric("tax").notNull().default("0"),
  total: numeric("total").notNull(),
  currency: text("currency").notNull().default("USD"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  billingAddressId: text("billing_address_id").references(() => addresses.id),
  shippingAddressId: text("shipping_address_id").references(() => addresses.id),
  notes: text("notes"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  shippedAt: integer("shipped_at", { mode: "timestamp" }),
  deliveredAt: integer("delivered_at", { mode: "timestamp" }),
  cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Order items table
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  orderId: text("order_id").references(() => orders.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Carts table
export const carts = sqliteTable("carts", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").references(() => users.id),
  sessionId: text("session_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Cart items table
export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  cartId: text("cart_id").references(() => carts.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Collections table
export const collections = sqliteTable("collections", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Collection products table
export const collectionProducts = sqliteTable("collection_products", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  collectionId: text("collection_id").references(() => collections.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Wishlists table
export const wishlists = sqliteTable("wishlists", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull().default("My Wishlist"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Wishlist items table
export const wishlistItems = sqliteTable("wishlist_items", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  wishlistId: text("wishlist_id").references(() => wishlists.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").references(() => users.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: integer("is_verified_purchase", { mode: "boolean" }).default(false),
  isApproved: integer("is_approved", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Coupons table
export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // percentage, fixed_amount
  value: numeric("value").notNull(),
  minimumAmount: numeric("minimum_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Blog posts table
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  authorId: text("author_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Blog categories table
export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Blog post categories table
export const blogPostCategories = sqliteTable("blog_post_categories", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  postId: text("post_id").references(() => blogPosts.id).notNull(),
  categoryId: text("category_id").references(() => blogCategories.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
