import { sql } from "drizzle-orm";
import { pgTable, text, integer, numeric, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("customer"), // 'customer', 'admin', 'super_admin', 'manager'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: uuid("parent_id"),
  image: text("image"), // Category image URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brands table
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  sku: text("sku").notNull().unique(),
  price: numeric("price").notNull(),
  comparePrice: numeric("compare_price"),
  costPerItem: numeric("cost_per_item"),
  categoryId: uuid("category_id").references(() => categories.id),
  brandId: uuid("brand_id").references(() => brands.id),
  isFeatured: boolean("is_featured").default(false),
  isAvailable: boolean("is_available").default(true),
  inventoryQuantity: integer("inventory_quantity").default(0),
  allowOutOfStockPurchases: boolean("allow_out_of_stock_purchases").default(false),
  weight: numeric("weight"),
  weightUnit: text("weight_unit"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product images table
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Addresses table
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
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
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
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
  billingAddressId: uuid("billing_address_id").references(() => addresses.id),
  shippingAddressId: uuid("shipping_address_id").references(() => addresses.id),
  notes: text("notes"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // pending, succeeded, failed, refunded
  method: text("method").notNull(), // card, bank_transfer, etc.
  gateway: text("gateway").notNull(), // stripe, paypal, etc.
  gatewayReference: text("gateway_reference"), // Reference ID from payment gateway
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Carts table
export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  sessionId: text("session_id"),
  appliedCouponId: uuid("applied_coupon_id").references(() => coupons.id),
  discountAmount: numeric("discount_amount").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").references(() => carts.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collections table
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collection products table
export const collectionProducts = pgTable("collection_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id").references(() => collections.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wishlists table
export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull().default("My Wishlist"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  wishlistId: uuid("wishlist_id").references(() => wishlists.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // percentage, fixed_amount
  value: numeric("value").notNull(),
  minimumAmount: numeric("minimum_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog categories table
export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog post categories table
export const blogPostCategories = pgTable("blog_post_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => blogPosts.id).notNull(),
  categoryId: uuid("category_id").references(() => blogCategories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
