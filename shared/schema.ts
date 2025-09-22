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
  role: text("role").notNull().default("user"), // user, admin
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

const baseInsertUserSchema = createInsertSchema(users);
export const insertUserSchema = baseInsertUserSchema.omit({
  id: true,
  passwordHash: true,
  role: true, // Remove role from client input - security fix
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

// Payments table
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  orderId: text("order_id").references(() => orders.id).notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // pending, succeeded, failed, refunded
  method: text("method").notNull(), // card, bank_transfer, etc.
  gateway: text("gateway").notNull(), // stripe, paypal, etc.
  gatewayReference: text("gateway_reference"), // Reference ID from payment gateway
  notes: text("notes"),
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

// ===== COMPREHENSIVE ZOD VALIDATION SCHEMAS FOR ADMIN ENDPOINTS =====

// Category schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  parentId: z.string().uuid().optional(),
});

export const updateCategorySchema = insertCategorySchema.partial();

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Brand schemas
export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).optional(),
  logo: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
});

export const updateBrandSchema = insertBrandSchema.partial();

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type UpdateBrand = z.infer<typeof updateBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Product schemas
export const weightUnitSchema = z.enum(["g", "kg", "lb", "oz"]);

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(5000).optional(),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "SKU must contain only uppercase letters, numbers, hyphens, and underscores"),
  price: z.coerce.number().nonnegative("Price must be a positive number"),
  comparePrice: z.coerce.number().nonnegative("Compare price must be a positive number").optional(),
  costPerItem: z.coerce.number().nonnegative("Cost must be a positive number").optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  inventoryQuantity: z.coerce.number().int().min(0).optional(),
  allowOutOfStockPurchases: z.boolean().optional(),
  weight: z.coerce.number().nonnegative("Weight must be a positive number").optional(),
  weightUnit: weightUnitSchema.optional(),
});

export const updateProductSchema = insertProductSchema.partial();

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

// Order schemas
export const orderStatusSchema = z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
export const paymentStatusSchema = z.enum(["pending", "paid", "failed", "refunded"]);

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  notes: z.string().max(1000).optional(),
  shippedAt: z.number().optional(),
  deliveredAt: z.number().optional(),
  cancelledAt: z.number().optional(),
});

export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Coupon schemas
export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  code: z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores"),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.coerce.number().positive("Value must be a positive number"),
  minimumAmount: z.coerce.number().nonnegative("Minimum amount must be a positive number").optional(),
  usageLimit: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  startDate: z.number().int(),
  endDate: z.number().int().optional(),
});

export const updateCouponSchema = insertCouponSchema.partial();

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type UpdateCoupon = z.infer<typeof updateCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// Blog post schemas
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().url().optional(),
  isPublished: z.boolean().optional(),
  authorId: z.string().uuid().optional(),
});

export const updateBlogPostSchema = insertBlogPostSchema.partial();

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Review schemas
export const updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
});

export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Collection schemas
export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  isPublished: z.boolean().optional(),
});

export const updateCollectionSchema = insertCollectionSchema.partial();

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type UpdateCollection = z.infer<typeof updateCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

// Collection product schemas
export const insertCollectionProductSchema = z.object({
  productId: z.string().uuid(),
  sortOrder: z.number().int().min(0).optional(),
});

export type InsertCollectionProduct = z.infer<typeof insertCollectionProductSchema>;
export type CollectionProduct = typeof collectionProducts.$inferSelect;

// Pagination and query schemas
export const paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val) || 1).pipe(z.number().int().min(1)).optional(),
  limit: z.string().transform((val) => parseInt(val) || 10).pipe(z.number().int().min(1).max(100)).optional(),
});

export const orderQuerySchema = paginationSchema.extend({
  status: orderStatusSchema.optional(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
