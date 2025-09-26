"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payments = exports.blogPostCategories = exports.blogCategories = exports.blogPosts = exports.coupons = exports.collectionProducts = exports.collections = exports.reviews = exports.wishlistItems = exports.wishlists = exports.cartItems = exports.carts = exports.orderItems = exports.orders = exports.addresses = exports.passwordResetTokens = exports.productVariantOptionValues = exports.productVariants = exports.productOptionValues = exports.productOptions = exports.productImages = exports.products = exports.brands = exports.categories = exports.users = exports.db = void 0;
require("dotenv/config");
var better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
var better_sqlite3_2 = require("better-sqlite3");
var schema = require("../../shared/schema-sqlite");
// Create SQLite database connection
var sqlite = new better_sqlite3_2.default(process.env.DATABASE_URL.replace('file:', ''));
// Create drizzle instance
exports.db = (0, better_sqlite3_1.drizzle)(sqlite, { schema: schema });
// Export all schema tables for easy access
exports.users = schema.users, exports.categories = schema.categories, exports.brands = schema.brands, exports.products = schema.products, exports.productImages = schema.productImages, exports.productOptions = schema.productOptions, exports.productOptionValues = schema.productOptionValues, exports.productVariants = schema.productVariants, exports.productVariantOptionValues = schema.productVariantOptionValues, exports.passwordResetTokens = schema.passwordResetTokens, exports.addresses = schema.addresses, exports.orders = schema.orders, exports.orderItems = schema.orderItems, exports.carts = schema.carts, exports.cartItems = schema.cartItems, exports.wishlists = schema.wishlists, exports.wishlistItems = schema.wishlistItems, exports.reviews = schema.reviews, exports.collections = schema.collections, exports.collectionProducts = schema.collectionProducts, exports.coupons = schema.coupons, exports.blogPosts = schema.blogPosts, exports.blogCategories = schema.blogCategories, exports.blogPostCategories = schema.blogPostCategories, exports.payments = schema.payments;
