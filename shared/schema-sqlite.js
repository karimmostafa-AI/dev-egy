"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariantSchema = exports.insertProductVariantSchema = exports.updateProductOptionValueSchema = exports.insertProductOptionValueSchema = exports.updateProductOptionSchema = exports.insertProductOptionSchema = exports.insertCollectionProductSchema = exports.updateCollectionSchema = exports.insertCollectionSchema = exports.updateReviewSchema = exports.updateBlogPostSchema = exports.insertBlogPostSchema = exports.updateCouponSchema = exports.insertCouponSchema = exports.updateOrderSchema = exports.paymentStatusSchema = exports.orderStatusSchema = exports.updateProductSchema = exports.insertProductSchema = exports.weightUnitSchema = exports.updateBrandSchema = exports.insertBrandSchema = exports.updateCategorySchema = exports.insertCategorySchema = exports.blogPostCategories = exports.blogCategories = exports.blogPosts = exports.reviews = exports.wishlistItems = exports.wishlists = exports.collectionProducts = exports.collections = exports.cartItems = exports.carts = exports.coupons = exports.orderItems = exports.payments = exports.orders = exports.addresses = exports.passwordResetTokens = exports.productVariantOptionValues = exports.productVariants = exports.productOptionValues = exports.productOptions = exports.productImages = exports.products = exports.brands = exports.categories = exports.insertUserSchema = exports.users = void 0;
exports.verifyResetTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.insertWishlistItemSchema = exports.insertOrderItemSchema = exports.updateCartItemSchema = exports.insertCartItemSchema = exports.orderQuerySchema = exports.paginationSchema = exports.updatePasswordResetTokenSchema = exports.insertPasswordResetTokenSchema = exports.insertProductVariantOptionValueSchema = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
// Users table
exports.users = (0, sqlite_core_1.sqliteTable)("users", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    fullName: (0, sqlite_core_1.text)("full_name").notNull(),
    email: (0, sqlite_core_1.text)("email").notNull().unique(),
    passwordHash: (0, sqlite_core_1.text)("password_hash").notNull(),
    role: (0, sqlite_core_1.text)("role").default("customer"), // 'customer', 'admin', 'super_admin', 'manager'
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
var baseInsertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users);
exports.insertUserSchema = baseInsertUserSchema.omit({
    id: true,
    passwordHash: true,
    role: true, // Remove role from client input - security fix
    createdAt: true,
    updatedAt: true,
}).extend({
    password: zod_1.z.string().min(6), // Password will be handled separately for hashing
});
// Categories table
exports.categories = (0, sqlite_core_1.sqliteTable)("categories", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    parentId: (0, sqlite_core_1.text)("parent_id"),
    image: (0, sqlite_core_1.text)("image"), // Category image URL
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Brands table
exports.brands = (0, sqlite_core_1.sqliteTable)("brands", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    logo: (0, sqlite_core_1.text)("logo"),
    isFeatured: (0, sqlite_core_1.integer)("is_featured", { mode: "boolean" }).default(false),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Products table
exports.products = (0, sqlite_core_1.sqliteTable)("products", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    shortDescription: (0, sqlite_core_1.text)("short_description"),
    sku: (0, sqlite_core_1.text)("sku").notNull().unique(),
    price: (0, sqlite_core_1.real)("price").notNull(),
    comparePrice: (0, sqlite_core_1.real)("compare_price"),
    costPerItem: (0, sqlite_core_1.real)("cost_per_item"),
    categoryId: (0, sqlite_core_1.text)("category_id"),
    brandId: (0, sqlite_core_1.text)("brand_id"),
    isFeatured: (0, sqlite_core_1.integer)("is_featured", { mode: "boolean" }).default(false),
    isAvailable: (0, sqlite_core_1.integer)("is_available", { mode: "boolean" }).default(true),
    inventoryQuantity: (0, sqlite_core_1.integer)("inventory_quantity").default(0),
    allowOutOfStockPurchases: (0, sqlite_core_1.integer)("allow_out_of_stock_purchases", { mode: "boolean" }).default(false),
    weight: (0, sqlite_core_1.real)("weight"),
    weightUnit: (0, sqlite_core_1.text)("weight_unit"),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Product images table
exports.productImages = (0, sqlite_core_1.sqliteTable)("product_images", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    url: (0, sqlite_core_1.text)("url").notNull(),
    alt: (0, sqlite_core_1.text)("alt"),
    isPrimary: (0, sqlite_core_1.integer)("is_primary", { mode: "boolean" }).default(false),
    sortOrder: (0, sqlite_core_1.integer)("sort_order").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Product options table (Size, Color, etc.)
exports.productOptions = (0, sqlite_core_1.sqliteTable)("product_options", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    name: (0, sqlite_core_1.text)("name").notNull(), // e.g., "Size", "Color"
    displayName: (0, sqlite_core_1.text)("display_name").notNull(), // e.g., "Size", "Color"
    sortOrder: (0, sqlite_core_1.integer)("sort_order").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Product option values table (Small, Medium, Large for Size)
exports.productOptionValues = (0, sqlite_core_1.sqliteTable)("product_option_values", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    optionId: (0, sqlite_core_1.text)("option_id").notNull(),
    value: (0, sqlite_core_1.text)("value").notNull(), // e.g., "Small", "Red"
    displayValue: (0, sqlite_core_1.text)("display_value").notNull(), // e.g., "Small", "Red"
    sortOrder: (0, sqlite_core_1.integer)("sort_order").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_19 || (templateObject_19 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_20 || (templateObject_20 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Product variants table (specific combinations of options)
exports.productVariants = (0, sqlite_core_1.sqliteTable)("product_variants", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_21 || (templateObject_21 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    sku: (0, sqlite_core_1.text)("sku").notNull().unique(),
    price: (0, sqlite_core_1.real)("price"), // Override product price if set
    comparePrice: (0, sqlite_core_1.real)("compare_price"), // Override product compare price if set
    costPerItem: (0, sqlite_core_1.real)("cost_per_item"), // Override product cost if set
    inventoryQuantity: (0, sqlite_core_1.integer)("inventory_quantity").notNull().default(0),
    allowOutOfStockPurchases: (0, sqlite_core_1.integer)("allow_out_of_stock_purchases", { mode: "boolean" }).default(false),
    weight: (0, sqlite_core_1.real)("weight"), // Override product weight if set
    weightUnit: (0, sqlite_core_1.text)("weight_unit"), // Override product weight unit if set
    isAvailable: (0, sqlite_core_1.integer)("is_available", { mode: "boolean" }).default(true),
    sortOrder: (0, sqlite_core_1.integer)("sort_order").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_22 || (templateObject_22 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_23 || (templateObject_23 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Product variant option values table (links variants to their option values)
exports.productVariantOptionValues = (0, sqlite_core_1.sqliteTable)("product_variant_option_values", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_24 || (templateObject_24 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    variantId: (0, sqlite_core_1.text)("variant_id").notNull(),
    optionValueId: (0, sqlite_core_1.text)("option_value_id").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Password reset tokens table
exports.passwordResetTokens = (0, sqlite_core_1.sqliteTable)("password_reset_tokens", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_26 || (templateObject_26 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id").notNull(),
    tokenHash: (0, sqlite_core_1.text)("token_hash").notNull().unique(), // SHA-256 hash of the actual token
    expiresAt: (0, sqlite_core_1.integer)("expires_at", { mode: "timestamp" }).notNull(),
    usedAt: (0, sqlite_core_1.integer)("used_at", { mode: "timestamp" }),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_27 || (templateObject_27 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Addresses table
exports.addresses = (0, sqlite_core_1.sqliteTable)("addresses", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_28 || (templateObject_28 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id").notNull(),
    firstName: (0, sqlite_core_1.text)("first_name").notNull(),
    lastName: (0, sqlite_core_1.text)("last_name").notNull(),
    company: (0, sqlite_core_1.text)("company"),
    address1: (0, sqlite_core_1.text)("address1").notNull(),
    address2: (0, sqlite_core_1.text)("address2"),
    city: (0, sqlite_core_1.text)("city").notNull(),
    province: (0, sqlite_core_1.text)("province").notNull(),
    country: (0, sqlite_core_1.text)("country").notNull(),
    zip: (0, sqlite_core_1.text)("zip").notNull(),
    phone: (0, sqlite_core_1.text)("phone"),
    isDefault: (0, sqlite_core_1.integer)("is_default", { mode: "boolean" }).default(false),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_29 || (templateObject_29 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_30 || (templateObject_30 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Orders table
exports.orders = (0, sqlite_core_1.sqliteTable)("orders", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_31 || (templateObject_31 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id"),
    orderNumber: (0, sqlite_core_1.text)("order_number").notNull().unique(),
    status: (0, sqlite_core_1.text)("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
    subtotal: (0, sqlite_core_1.real)("subtotal").notNull(),
    shippingCost: (0, sqlite_core_1.real)("shipping_cost").notNull().default(0),
    tax: (0, sqlite_core_1.real)("tax").notNull().default(0),
    total: (0, sqlite_core_1.real)("total").notNull(),
    currency: (0, sqlite_core_1.text)("currency").notNull().default("USD"),
    firstName: (0, sqlite_core_1.text)("first_name").notNull(),
    lastName: (0, sqlite_core_1.text)("last_name").notNull(),
    email: (0, sqlite_core_1.text)("email").notNull(),
    phone: (0, sqlite_core_1.text)("phone"),
    billingAddressId: (0, sqlite_core_1.text)("billing_address_id"),
    shippingAddressId: (0, sqlite_core_1.text)("shipping_address_id"),
    notes: (0, sqlite_core_1.text)("notes"),
    paymentMethod: (0, sqlite_core_1.text)("payment_method"),
    paymentStatus: (0, sqlite_core_1.text)("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
    shippedAt: (0, sqlite_core_1.integer)("shipped_at", { mode: "timestamp" }),
    deliveredAt: (0, sqlite_core_1.integer)("delivered_at", { mode: "timestamp" }),
    cancelledAt: (0, sqlite_core_1.integer)("cancelled_at", { mode: "timestamp" }),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_32 || (templateObject_32 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_33 || (templateObject_33 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Payments table
exports.payments = (0, sqlite_core_1.sqliteTable)("payments", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_34 || (templateObject_34 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    orderId: (0, sqlite_core_1.text)("order_id").notNull(),
    paymentIntentId: (0, sqlite_core_1.text)("payment_intent_id").notNull(),
    amount: (0, sqlite_core_1.real)("amount").notNull(),
    currency: (0, sqlite_core_1.text)("currency").notNull(),
    status: (0, sqlite_core_1.text)("status").notNull(), // pending, succeeded, failed, refunded
    method: (0, sqlite_core_1.text)("method").notNull(), // card, bank_transfer, etc.
    gateway: (0, sqlite_core_1.text)("gateway").notNull(), // stripe, paypal, etc.
    gatewayReference: (0, sqlite_core_1.text)("gateway_reference"), // Reference ID from payment gateway
    notes: (0, sqlite_core_1.text)("notes"),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_35 || (templateObject_35 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_36 || (templateObject_36 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Order items table
exports.orderItems = (0, sqlite_core_1.sqliteTable)("order_items", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_37 || (templateObject_37 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    orderId: (0, sqlite_core_1.text)("order_id").notNull(),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    variantId: (0, sqlite_core_1.text)("variant_id"), // Optional variant reference
    name: (0, sqlite_core_1.text)("name").notNull(),
    sku: (0, sqlite_core_1.text)("sku").notNull(),
    price: (0, sqlite_core_1.real)("price").notNull(),
    quantity: (0, sqlite_core_1.integer)("quantity").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_38 || (templateObject_38 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Coupons table (forward declaration for carts table)
exports.coupons = (0, sqlite_core_1.sqliteTable)("coupons", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_39 || (templateObject_39 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    code: (0, sqlite_core_1.text)("code").notNull().unique(),
    type: (0, sqlite_core_1.text)("type").notNull(), // percentage, fixed_amount
    value: (0, sqlite_core_1.real)("value").notNull(),
    minimumAmount: (0, sqlite_core_1.real)("minimum_amount"),
    usageLimit: (0, sqlite_core_1.integer)("usage_limit"),
    usedCount: (0, sqlite_core_1.integer)("used_count").default(0),
    isActive: (0, sqlite_core_1.integer)("is_active", { mode: "boolean" }).default(true),
    startDate: (0, sqlite_core_1.integer)("start_date", { mode: "timestamp" }).notNull(),
    endDate: (0, sqlite_core_1.integer)("end_date", { mode: "timestamp" }),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_40 || (templateObject_40 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_41 || (templateObject_41 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Carts table
exports.carts = (0, sqlite_core_1.sqliteTable)("carts", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_42 || (templateObject_42 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id"),
    sessionId: (0, sqlite_core_1.text)("session_id"),
    appliedCouponId: (0, sqlite_core_1.text)("applied_coupon_id"),
    discountAmount: (0, sqlite_core_1.real)("discount_amount").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_43 || (templateObject_43 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_44 || (templateObject_44 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Cart items table
exports.cartItems = (0, sqlite_core_1.sqliteTable)("cart_items", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_45 || (templateObject_45 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    cartId: (0, sqlite_core_1.text)("cart_id").notNull(),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    variantId: (0, sqlite_core_1.text)("variant_id"), // Optional variant reference
    quantity: (0, sqlite_core_1.integer)("quantity").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_46 || (templateObject_46 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_47 || (templateObject_47 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Collections table
exports.collections = (0, sqlite_core_1.sqliteTable)("collections", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_48 || (templateObject_48 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    image: (0, sqlite_core_1.text)("image"),
    isPublished: (0, sqlite_core_1.integer)("is_published", { mode: "boolean" }).default(false),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_49 || (templateObject_49 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_50 || (templateObject_50 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Collection products table
exports.collectionProducts = (0, sqlite_core_1.sqliteTable)("collection_products", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_51 || (templateObject_51 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    collectionId: (0, sqlite_core_1.text)("collection_id").notNull(),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    sortOrder: (0, sqlite_core_1.integer)("sort_order").default(0),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_52 || (templateObject_52 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Wishlists table
exports.wishlists = (0, sqlite_core_1.sqliteTable)("wishlists", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_53 || (templateObject_53 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id").notNull(),
    name: (0, sqlite_core_1.text)("name").notNull().default("My Wishlist"),
    isPublic: (0, sqlite_core_1.integer)("is_public", { mode: "boolean" }).default(false),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_54 || (templateObject_54 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_55 || (templateObject_55 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Wishlist items table
exports.wishlistItems = (0, sqlite_core_1.sqliteTable)("wishlist_items", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_56 || (templateObject_56 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    wishlistId: (0, sqlite_core_1.text)("wishlist_id").notNull(),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    variantId: (0, sqlite_core_1.text)("variant_id"), // Optional variant reference
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_57 || (templateObject_57 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Reviews table
exports.reviews = (0, sqlite_core_1.sqliteTable)("reviews", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_58 || (templateObject_58 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    userId: (0, sqlite_core_1.text)("user_id").notNull(),
    productId: (0, sqlite_core_1.text)("product_id").notNull(),
    rating: (0, sqlite_core_1.integer)("rating").notNull(), // 1-5
    title: (0, sqlite_core_1.text)("title").notNull(),
    comment: (0, sqlite_core_1.text)("comment").notNull(),
    isVerifiedPurchase: (0, sqlite_core_1.integer)("is_verified_purchase", { mode: "boolean" }).default(false),
    isApproved: (0, sqlite_core_1.integer)("is_approved", { mode: "boolean" }).default(false),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_59 || (templateObject_59 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_60 || (templateObject_60 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Blog posts table
exports.blogPosts = (0, sqlite_core_1.sqliteTable)("blog_posts", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_61 || (templateObject_61 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    title: (0, sqlite_core_1.text)("title").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    content: (0, sqlite_core_1.text)("content").notNull(),
    excerpt: (0, sqlite_core_1.text)("excerpt"),
    featuredImage: (0, sqlite_core_1.text)("featured_image"),
    isPublished: (0, sqlite_core_1.integer)("is_published", { mode: "boolean" }).default(false),
    publishedAt: (0, sqlite_core_1.integer)("published_at", { mode: "timestamp" }),
    authorId: (0, sqlite_core_1.text)("author_id"),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_62 || (templateObject_62 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_63 || (templateObject_63 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Blog categories table
exports.blogCategories = (0, sqlite_core_1.sqliteTable)("blog_categories", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_64 || (templateObject_64 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_65 || (templateObject_65 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
    updatedAt: (0, sqlite_core_1.integer)("updated_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_66 || (templateObject_66 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// Blog post categories table
exports.blogPostCategories = (0, sqlite_core_1.sqliteTable)("blog_post_categories", {
    id: (0, sqlite_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_67 || (templateObject_67 = __makeTemplateObject(["(hex(randomblob(16)))"], ["(hex(randomblob(16)))"])))),
    postId: (0, sqlite_core_1.text)("post_id").notNull(),
    categoryId: (0, sqlite_core_1.text)("category_id").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at", { mode: "timestamp" }).default((0, drizzle_orm_1.sql)(templateObject_68 || (templateObject_68 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"])))),
});
// ===== COMPREHENSIVE ZOD VALIDATION SCHEMAS FOR ADMIN ENDPOINTS =====
// Category schemas
exports.insertCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.categories).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: zod_1.z.string().max(500).optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateCategorySchema = exports.insertCategorySchema.partial();
// Brand schemas
exports.insertBrandSchema = (0, drizzle_zod_1.createInsertSchema)(exports.brands).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: zod_1.z.string().max(1000).optional(),
    logo: zod_1.z.string().url().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.updateBrandSchema = exports.insertBrandSchema.partial();
// Product schemas
exports.weightUnitSchema = zod_1.z.enum(["g", "kg", "lb", "oz"]);
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(exports.products).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    name: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: zod_1.z.string().max(5000).optional(),
    shortDescription: zod_1.z.string().max(500).optional(),
    sku: zod_1.z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "SKU must contain only uppercase letters, numbers, hyphens, and underscores"),
    price: zod_1.z.coerce.number().nonnegative("Price must be a positive number"),
    comparePrice: zod_1.z.coerce.number().nonnegative("Compare price must be a positive number").optional(),
    costPerItem: zod_1.z.coerce.number().nonnegative("Cost must be a positive number").optional(),
    categoryId: zod_1.z.string().optional(),
    brandId: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    isAvailable: zod_1.z.boolean().optional(),
    inventoryQuantity: zod_1.z.coerce.number().int().min(0).optional(),
    allowOutOfStockPurchases: zod_1.z.boolean().optional(),
    weight: zod_1.z.coerce.number().nonnegative("Weight must be a positive number").optional(),
    weightUnit: exports.weightUnitSchema.optional(),
});
exports.updateProductSchema = exports.insertProductSchema.partial();
// Order schemas
exports.orderStatusSchema = zod_1.z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
exports.paymentStatusSchema = zod_1.z.enum(["pending", "paid", "failed", "refunded"]);
exports.updateOrderSchema = zod_1.z.object({
    status: exports.orderStatusSchema.optional(),
    paymentStatus: exports.paymentStatusSchema.optional(),
    notes: zod_1.z.string().max(1000).optional(),
    shippedAt: zod_1.z.number().optional(),
    deliveredAt: zod_1.z.number().optional(),
    cancelledAt: zod_1.z.number().optional(),
});
// Coupon schemas
exports.insertCouponSchema = (0, drizzle_zod_1.createInsertSchema)(exports.coupons).omit({
    id: true,
    usedCount: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    code: zod_1.z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores"),
    type: zod_1.z.enum(["percentage", "fixed_amount"]),
    value: zod_1.z.coerce.number().positive("Value must be a positive number"),
    minimumAmount: zod_1.z.coerce.number().nonnegative("Minimum amount must be a positive number").optional(),
    usageLimit: zod_1.z.number().int().min(1).optional(),
    isActive: zod_1.z.boolean().optional(),
    startDate: zod_1.z.number().int(),
    endDate: zod_1.z.number().int().optional(),
});
exports.updateCouponSchema = exports.insertCouponSchema.partial();
// Blog post schemas
exports.insertBlogPostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.blogPosts).omit({
    id: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    title: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    content: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().max(500).optional(),
    featuredImage: zod_1.z.string().url().optional(),
    isPublished: zod_1.z.boolean().optional(),
    authorId: zod_1.z.string().optional(),
});
exports.updateBlogPostSchema = exports.insertBlogPostSchema.partial();
// Review schemas
exports.updateReviewSchema = zod_1.z.object({
    isApproved: zod_1.z.boolean().optional(),
});
// Collection schemas
exports.insertCollectionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.collections).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: zod_1.z.string().max(1000).optional(),
    image: zod_1.z.string().url().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.updateCollectionSchema = exports.insertCollectionSchema.partial();
// Collection product schemas
exports.insertCollectionProductSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    sortOrder: zod_1.z.number().int().min(0).optional(),
});
// Product option schemas
exports.insertProductOptionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.productOptions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    productId: zod_1.z.string(),
    name: zod_1.z.string().min(1).max(50),
    displayName: zod_1.z.string().min(1).max(50),
    sortOrder: zod_1.z.number().int().min(0).optional(),
});
exports.updateProductOptionSchema = exports.insertProductOptionSchema.partial();
// Product option value schemas
exports.insertProductOptionValueSchema = (0, drizzle_zod_1.createInsertSchema)(exports.productOptionValues).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    optionId: zod_1.z.string(),
    value: zod_1.z.string().min(1).max(50),
    displayValue: zod_1.z.string().min(1).max(50),
    sortOrder: zod_1.z.number().int().min(0).optional(),
});
exports.updateProductOptionValueSchema = exports.insertProductOptionValueSchema.partial();
// Product variant schemas
exports.insertProductVariantSchema = (0, drizzle_zod_1.createInsertSchema)(exports.productVariants).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    productId: zod_1.z.string(),
    sku: zod_1.z.string().min(1).max(50).regex(/^[A-Z0-9-_]+$/, "SKU must contain only uppercase letters, numbers, hyphens, and underscores"),
    price: zod_1.z.coerce.number().nonnegative("Price must be a positive number").optional(),
    comparePrice: zod_1.z.coerce.number().nonnegative("Compare price must be a positive number").optional(),
    costPerItem: zod_1.z.coerce.number().nonnegative("Cost must be a positive number").optional(),
    inventoryQuantity: zod_1.z.coerce.number().int().min(0),
    allowOutOfStockPurchases: zod_1.z.boolean().optional(),
    weight: zod_1.z.coerce.number().nonnegative("Weight must be a positive number").optional(),
    weightUnit: exports.weightUnitSchema.optional(),
    isAvailable: zod_1.z.boolean().optional(),
    sortOrder: zod_1.z.number().int().min(0).optional(),
});
exports.updateProductVariantSchema = exports.insertProductVariantSchema.partial();
// Product variant option value schemas
exports.insertProductVariantOptionValueSchema = (0, drizzle_zod_1.createInsertSchema)(exports.productVariantOptionValues).omit({
    id: true,
    createdAt: true,
}).extend({
    variantId: zod_1.z.string(),
    optionValueId: zod_1.z.string(),
});
// Password reset token schemas
exports.insertPasswordResetTokenSchema = (0, drizzle_zod_1.createInsertSchema)(exports.passwordResetTokens).omit({
    id: true,
    usedAt: true,
    createdAt: true,
}).extend({
    userId: zod_1.z.string(),
    tokenHash: zod_1.z.string().min(1), // SHA-256 hash of the actual token
    expiresAt: zod_1.z.number().int(),
});
exports.updatePasswordResetTokenSchema = zod_1.z.object({
    usedAt: zod_1.z.number().int().optional(),
});
// Pagination and query schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().transform(function (val) { return parseInt(val) || 1; }).pipe(zod_1.z.number().int().min(1)).optional(),
    limit: zod_1.z.string().transform(function (val) { return parseInt(val) || 10; }).pipe(zod_1.z.number().int().min(1).max(100)).optional(),
});
exports.orderQuerySchema = exports.paginationSchema.extend({
    status: exports.orderStatusSchema.optional(),
});
// Cart item schemas
exports.insertCartItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.cartItems).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    cartId: zod_1.z.string(),
    productId: zod_1.z.string(),
    variantId: zod_1.z.string().optional(), // Optional variant reference
    quantity: zod_1.z.number().int().min(1),
});
exports.updateCartItemSchema = exports.insertCartItemSchema.partial();
// Order item schemas
exports.insertOrderItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.orderItems).omit({
    id: true,
    createdAt: true,
}).extend({
    orderId: zod_1.z.string(),
    productId: zod_1.z.string(),
    variantId: zod_1.z.string().optional(), // Optional variant reference
    name: zod_1.z.string().min(1).max(200),
    sku: zod_1.z.string().min(1).max(50),
    price: zod_1.z.coerce.number().nonnegative("Price must be a positive number"),
    quantity: zod_1.z.number().int().min(1),
});
// Wishlist item schemas
exports.insertWishlistItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.wishlistItems).omit({
    id: true,
    createdAt: true,
}).extend({
    wishlistId: zod_1.z.string(),
    productId: zod_1.z.string(),
    variantId: zod_1.z.string().optional(), // Optional variant reference
});
// Password reset API endpoint schemas
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Reset token is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.verifyResetTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Reset token is required"),
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53, templateObject_54, templateObject_55, templateObject_56, templateObject_57, templateObject_58, templateObject_59, templateObject_60, templateObject_61, templateObject_62, templateObject_63, templateObject_64, templateObject_65, templateObject_66, templateObject_67, templateObject_68;
