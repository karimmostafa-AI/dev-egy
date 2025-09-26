import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("customer"), // 'customer', 'admin', 'super_admin', 'manager'
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
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
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
  image: text("image"), // Category image URL
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Brands table
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Products table
export const products = sqliteTable("products", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(),
  comparePrice: real("compare_price"),
  costPerItem: real("cost_per_item"),
  categoryId: text("category_id"),
  brandId: text("brand_id"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  inventoryQuantity: integer("inventory_quantity").default(0),
  allowOutOfStockPurchases: integer("allow_out_of_stock_purchases", { mode: "boolean" }).default(false),
  weight: real("weight"),
  weightUnit: text("weight_unit"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Product images table
export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  productId: text("product_id").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  optionValueId: text("option_value_id"), // Links to specific color/option value, null for generic images
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Product options table (Size, Color, etc.)
export const productOptions = sqliteTable("product_options", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  productId: text("product_id").notNull(),
  name: text("name").notNull(), // e.g., "Size", "Color"
  displayName: text("display_name").notNull(), // e.g., "Size", "Color"
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Product option values table (Small, Medium, Large for Size)
export const productOptionValues = sqliteTable("product_option_values", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  optionId: text("option_id").notNull(),
  value: text("value").notNull(), // e.g., "Small", "Red"
  displayValue: text("display_value").notNull(), // e.g., "Small", "Red"
  hex: text("hex"), // For color options, stores the hex color value
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Product variants table (specific combinations of options)
export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  productId: text("product_id").notNull(),
  sku: text("sku").notNull().unique(),
  price: real("price"), // Override product price if set
  comparePrice: real("compare_price"), // Override product compare price if set
  costPerItem: real("cost_per_item"), // Override product cost if set
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  allowOutOfStockPurchases: integer("allow_out_of_stock_purchases", { mode: "boolean" }).default(false),
  weight: real("weight"), // Override product weight if set
  weightUnit: text("weight_unit"), // Override product weight unit if set
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Product variant option values table (links variants to their option values)
export const productVariantOptionValues = sqliteTable("product_variant_option_values", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  variantId: text("variant_id").notNull(),
  optionValueId: text("option_value_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Password reset tokens table
export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(), // SHA-256 hash of the actual token
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Addresses table
export const addresses = sqliteTable("addresses", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Orders table
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id"),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull().default(0),
  tax: real("tax").notNull().default(0),
  total: real("total").notNull(),
  currency: text("currency").notNull().default("USD"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  billingAddressId: text("billing_address_id"),
  shippingAddressId: text("shipping_address_id"),
  notes: text("notes"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  shippedAt: integer("shipped_at", { mode: "timestamp" }),
  deliveredAt: integer("delivered_at", { mode: "timestamp" }),
  cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  orderId: text("order_id").notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // pending, succeeded, failed, refunded
  method: text("method").notNull(), // card, bank_transfer, etc.
  gateway: text("gateway").notNull(), // stripe, paypal, etc.
  gatewayReference: text("gateway_reference"), // Reference ID from payment gateway
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Order items table
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  variantId: text("variant_id"), // Optional variant reference
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Coupons table (forward declaration for carts table)
export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // percentage, fixed_amount
  value: real("value").notNull(),
  minimumAmount: real("minimum_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Carts table
export const carts = sqliteTable("carts", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id"),
  sessionId: text("session_id"),
  appliedCouponId: text("applied_coupon_id"),
  discountAmount: real("discount_amount").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Cart items table
export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  cartId: text("cart_id").notNull(),
  productId: text("product_id").notNull(),
  variantId: text("variant_id"), // Optional variant reference
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Collections table
export const collections = sqliteTable("collections", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Collection products table
export const collectionProducts = sqliteTable("collection_products", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  collectionId: text("collection_id").notNull(),
  productId: text("product_id").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Wishlists table
export const wishlists = sqliteTable("wishlists", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull(),
  name: text("name").notNull().default("My Wishlist"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Wishlist items table
export const wishlistItems = sqliteTable("wishlist_items", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  wishlistId: text("wishlist_id").notNull(),
  productId: text("product_id").notNull(),
  variantId: text("variant_id"), // Optional variant reference
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: integer("is_verified_purchase", { mode: "boolean" }).default(false),
  isApproved: integer("is_approved", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Blog posts table
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  authorId: text("author_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Blog categories table
export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Blog post categories table
export const blogPostCategories = sqliteTable("blog_post_categories", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  postId: text("post_id").notNull(),
  categoryId: text("category_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
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
  parentId: z.string().optional(),
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
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
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
  authorId: z.string().optional(),
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
  productId: z.string(),
  sortOrder: z.number().int().min(0).optional(),
});

export type InsertCollectionProduct = z.infer<typeof insertCollectionProductSchema>;
export type CollectionProduct = typeof collectionProducts.$inferSelect;

// Product option schemas
export const insertProductOptionSchema = createInsertSchema(productOptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  productId: z.string(),
  name: z.string().min(1).max(50),
  displayName: z.string().min(1).max(50),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProductOptionSchema = insertProductOptionSchema.partial();

export type InsertProductOption = z.infer<typeof insertProductOptionSchema>;
export type UpdateProductOption = z.infer<typeof updateProductOptionSchema>;
export type ProductOption = typeof productOptions.$inferSelect;

// Product option value schemas
export const insertProductOptionValueSchema = createInsertSchema(productOptionValues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  optionId: z.string(),
  value: z.string().min(1).max(50),
  displayValue: z.string().min(1).max(50),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProductOptionValueSchema = insertProductOptionValueSchema.partial();

export type InsertProductOptionValue = z.infer<typeof insertProductOptionValueSchema>;
export type UpdateProductOptionValue = z.infer<typeof updateProductOptionValueSchema>;
export type ProductOptionValue = typeof productOptionValues.$inferSelect;

// Product variant schemas
export const insertProductVariantSchema = createInsertSchema(productVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  productId: z.string(),
  sku: z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "SKU must contain only uppercase letters, numbers, hyphens, and underscores"),
  price: z.coerce.number().nonnegative("Price must be a positive number").optional(),
  comparePrice: z.coerce.number().nonnegative("Compare price must be a positive number").optional(),
  costPerItem: z.coerce.number().nonnegative("Cost must be a positive number").optional(),
  inventoryQuantity: z.coerce.number().int().min(0),
  allowOutOfStockPurchases: z.boolean().optional(),
  weight: z.coerce.number().nonnegative("Weight must be a positive number").optional(),
  weightUnit: weightUnitSchema.optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProductVariantSchema = insertProductVariantSchema.partial();

export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type UpdateProductVariant = z.infer<typeof updateProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;

// Product variant option value schemas
export const insertProductVariantOptionValueSchema = createInsertSchema(productVariantOptionValues).omit({
  id: true,
  createdAt: true,
}).extend({
  variantId: z.string(),
  optionValueId: z.string(),
});

export type InsertProductVariantOptionValue = z.infer<typeof insertProductVariantOptionValueSchema>;
export type ProductVariantOptionValue = typeof productVariantOptionValues.$inferSelect;

// Password reset token schemas
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  usedAt: true,
  createdAt: true,
}).extend({
  userId: z.string(),
  tokenHash: z.string().min(1), // SHA-256 hash of the actual token
  expiresAt: z.number().int(),
});

export const updatePasswordResetTokenSchema = z.object({
  usedAt: z.number().int().optional(),
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type UpdatePasswordResetToken = z.infer<typeof updatePasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

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

// Cart item schemas
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  cartId: z.string(),
  productId: z.string(),
  variantId: z.string().optional(), // Optional variant reference
  quantity: z.number().int().min(1),
});

export const updateCartItemSchema = insertCartItemSchema.partial();

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Order item schemas
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
}).extend({
  orderId: z.string(),
  productId: z.string(),
  variantId: z.string().optional(), // Optional variant reference
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(50),
  price: z.coerce.number().nonnegative("Price must be a positive number"),
  quantity: z.number().int().min(1),
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Wishlist item schemas
export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
}).extend({
  wishlistId: z.string(),
  productId: z.string(),
  variantId: z.string().optional(), // Optional variant reference
});

export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;

// Password reset API endpoint schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenRequest = z.infer<typeof verifyResetTokenSchema>;