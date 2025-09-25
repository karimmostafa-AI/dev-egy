import express, { Request, Response } from "express";
import { db, categories, products, orders, users, orderItems, coupons, blogPosts, reviews, collections, collectionProducts } from "../db";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  requireAdmin,
  successResponse,
  errorResponse,
  paginatedResponse,
  formatDecimal,
  getDateRange,
  validatePaginationParams,
  applyPagination,
  formatOrderStatus,
  sanitizeInput,
  validateRequiredFields,
  asyncHandler
} from "../utils/adminHelpers";

const router = express.Router();

// Dashboard analytics with improved data handling
router.get("/dashboard/analytics", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  // Fetch counts
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [customerCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  
  // Get order status breakdown
  const orderStatusData = await db.select({ 
    status: orders.status,
    count: sql<number>`count(*)`
  }).from(orders).groupBy(orders.status);
  
  // Calculate earnings with proper date handling for SQLite
  const todayRange = getDateRange('today');
  const weekRange = getDateRange('week');
  const monthRange = getDateRange('month');
  
  // Total earnings (all delivered orders)
  const [totalEarningsData] = await db.select({ 
    total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
  }).from(orders).where(eq(orders.status, "delivered"));
  
  // Today's earnings
  const [todayEarningsData] = await db.select({ 
    total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
  }).from(orders)
    .where(and(
      eq(orders.status, "delivered"),
      gte(orders.createdAt, todayRange.start),
      lte(orders.createdAt, todayRange.end)
    ));
  
  // Weekly earnings
  const [weeklyEarningsData] = await db.select({ 
    total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
  }).from(orders)
    .where(and(
      eq(orders.status, "delivered"),
      gte(orders.createdAt, weekRange.start),
      lte(orders.createdAt, weekRange.end)
    ));
  
  // Monthly earnings
  const [monthlyEarningsData] = await db.select({ 
    total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
  }).from(orders)
    .where(and(
      eq(orders.status, "delivered"),
      gte(orders.createdAt, monthRange.start),
      lte(orders.createdAt, monthRange.end)
    ));
  
  // Get top selling products with proper joins
  const topProducts = await db.select({
    productName: products.name,
    totalSales: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
    totalRevenue: sql<number>`COALESCE(SUM(CAST(${orderItems.quantity} AS DECIMAL) * CAST(${orderItems.price} AS DECIMAL)), 0)`
  })
  .from(orderItems)
  .innerJoin(products, eq(orderItems.productId, products.id))
  .groupBy(products.id, products.name)
  .orderBy(sql`SUM(CAST(${orderItems.quantity} AS DECIMAL) * CAST(${orderItems.price} AS DECIMAL)) DESC`)
  .limit(5);
  
  // Get recent orders with proper formatting
  const recentOrdersData = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    createdAt: orders.createdAt,
    firstName: orders.firstName,
    lastName: orders.lastName,
    total: orders.total,
    status: orders.status,
    paymentMethod: orders.paymentMethod
  })
  .from(orders)
  .orderBy(desc(orders.createdAt))
  .limit(5);
  
  // Get sales trends for the last 7 months (PostgreSQL compatible)
  const salesTrends = await db.select({
    month: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
    total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
  })
  .from(orders)
  .where(eq(orders.status, "delivered"))
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
  .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM') DESC`)
  .limit(7);
  
  // Format the response data
  const analytics = {
    stats: {
      totalProducts: Number(productCount?.count || 0),
      totalCustomers: Number(customerCount?.count || 0),
      totalOrders: Number(orderCount?.count || 0),
      totalEarnings: formatDecimal(totalEarningsData?.total || 0),
      todayEarnings: formatDecimal(todayEarningsData?.total || 0),
      weeklyEarnings: formatDecimal(weeklyEarningsData?.total || 0),
      monthlyEarnings: formatDecimal(monthlyEarningsData?.total || 0),
    },
    orderStatus: {
      pending: Number(orderStatusData.find(s => s.status === "pending")?.count || 0),
      confirmed: Number(orderStatusData.find(s => s.status === "confirmed")?.count || 0),
      processing: Number(orderStatusData.find(s => s.status === "processing")?.count || 0),
      delivered: Number(orderStatusData.find(s => s.status === "delivered")?.count || 0),
      cancelled: Number(orderStatusData.find(s => s.status === "cancelled")?.count || 0),
    },
    charts: {
      salesTrends: salesTrends.reverse().map(item => ({
        name: new Date(item.month + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: formatDecimal(item.total)
      })),
      orderStatusDistribution: Object.entries({
        pending: Number(orderStatusData.find(s => s.status === "pending")?.count || 0),
        confirmed: Number(orderStatusData.find(s => s.status === "confirmed")?.count || 0),
        processing: Number(orderStatusData.find(s => s.status === "processing")?.count || 0),
        delivered: Number(orderStatusData.find(s => s.status === "delivered")?.count || 0),
        cancelled: Number(orderStatusData.find(s => s.status === "cancelled")?.count || 0),
      }).map(([name, value]) => ({ name, value }))
    },
    topSellingProducts: topProducts.map(product => ({
      name: product.productName,
      image: null, // TODO: Implement product images join if needed
      sales: product.totalSales,
      revenue: formatDecimal(product.totalRevenue)
    })),
    recentOrders: recentOrdersData.map(order => ({
      id: order.orderNumber,
      date: order.createdAt ? (typeof order.createdAt === 'number' ? new Date(order.createdAt * 1000).toISOString() : new Date(order.createdAt).toISOString()) : new Date().toISOString(),
      customer: `${order.firstName} ${order.lastName}`,
      amount: formatDecimal(order.total),
      status: formatOrderStatus(order.status),
      paymentMethod: order.paymentMethod || 'N/A'
    }))
  };
  
  res.json(successResponse(analytics));
}));

// Orders management with improved pagination and filtering
router.get("/orders", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  const { status, search } = req.query;
  
  // Build query with filters
  const baseQuery = db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    createdAt: orders.createdAt,
    firstName: orders.firstName,
    lastName: orders.lastName,
    email: orders.email,
    phone: orders.phone,
    total: orders.total,
    status: orders.status,
    paymentMethod: orders.paymentMethod,
    billingAddressId: orders.billingAddressId,
    shippingAddressId: orders.shippingAddressId,
    notes: orders.notes
  }).from(orders);
  
  // Execute query with conditional filter
  const allOrders = status && status !== 'all' 
    ? await baseQuery.where(eq(orders.status, status as string)).orderBy(desc(orders.createdAt))
    : await baseQuery.orderBy(desc(orders.createdAt));
  
  // Apply pagination
  const paginatedOrders = applyPagination(allOrders, page, limit);
  
  // Format orders
  const formattedOrders = paginatedOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt ? (typeof order.createdAt === 'number' ? new Date(order.createdAt * 1000).toISOString() : new Date(order.createdAt).toISOString()) : new Date().toISOString(),
    customer: {
      name: `${order.firstName} ${order.lastName}`,
      email: order.email,
      phone: order.phone
    },
    shipping: {
      addressId: order.shippingAddressId || 'N/A' // TODO: Join with addresses table for full info
    },
    amount: formatDecimal(order.total),
    status: formatOrderStatus(order.status),
    paymentMethod: order.paymentMethod || 'N/A',
    notes: order.notes
  }));
  
  res.json(successResponse(paginatedResponse(formattedOrders, page, limit, allOrders.length)));
}));

// Update order status
// Get single order details
router.get("/orders/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [order] = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    createdAt: orders.createdAt,
    firstName: orders.firstName,
    lastName: orders.lastName,
    email: orders.email,
    phone: orders.phone,
    total: orders.total,
    status: orders.status,
    paymentMethod: orders.paymentMethod,
    billingAddressId: orders.billingAddressId,
    shippingAddressId: orders.shippingAddressId,
    notes: orders.notes
  }).from(orders).where(eq(orders.id, id));
  
  if (!order) {
    return res.status(404).json(errorResponse('Order not found'));
  }
  
  // Get order items
  const items = await db.select({
    id: orderItems.id,
    productId: orderItems.productId,
    productName: products.name,
    quantity: orderItems.quantity,
    price: orderItems.price
  })
  .from(orderItems)
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, id));
  
  const formattedOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt ? (typeof order.createdAt === 'number' ? new Date(order.createdAt * 1000).toISOString() : new Date(order.createdAt).toISOString()) : new Date().toISOString(),
    customer: {
      name: `${order.firstName} ${order.lastName}`,
      email: order.email,
      phone: order.phone
    },
    items: items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName || 'Unknown Product',
      quantity: item.quantity,
      price: formatDecimal(item.price)
    })),
    amount: formatDecimal(order.total),
    status: formatOrderStatus(order.status),
    paymentMethod: order.paymentMethod || 'N/A',
    notes: order.notes,
    billingAddressId: order.billingAddressId,
    shippingAddressId: order.shippingAddressId
  };
  
  res.json(successResponse(formattedOrder));
}));

router.patch("/orders/:id/status", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = sanitizeInput(req.body);
  
  if (!status) {
    return res.status(400).json(errorResponse('Status is required'));
  }
  
  const validStatuses = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json(errorResponse('Invalid status'));
  }
  
  const [updatedOrder] = await db.update(orders)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(eq(orders.id, id))
    .returning();
  
  if (!updatedOrder) {
    return res.status(404).json(errorResponse('Order not found'));
  }
  
  res.json(successResponse({
    id: updatedOrder.id,
    orderNumber: updatedOrder.orderNumber,
    status: formatOrderStatus(updatedOrder.status)
  }, 'Order status updated successfully'));
}));

// Categories management with improved error handling
router.get("/categories", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const allCategories = await db.select().from(categories).orderBy(categories.name);
  
  const formattedCategories = allCategories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    image: category.image,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }));
  
  res.json(successResponse(formattedCategories));
}));

router.get("/categories/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [category] = await db.select().from(categories).where(eq(categories.id, id));
  
  if (!category) {
    return res.status(404).json(errorResponse('Category not found'));
  }
  
  res.json(successResponse({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    image: category.image,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }));
}));

router.post("/categories", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['name']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [newCategory] = await db.insert(categories).values({
    name: data.name,
    description: data.description,
    parentId: data.parentId || null,
    slug,
    image: data.image,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse(newCategory, 'Category created successfully'));
}));

router.put("/categories/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const [updatedCategory] = await db.update(categories)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(categories.id, id))
    .returning();
  
  if (!updatedCategory) {
    return res.status(404).json(errorResponse('Category not found'));
  }
  
  res.json(successResponse(updatedCategory, 'Category updated successfully'));
}));

router.delete("/categories/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check if category has products
  const [productCount] = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.categoryId, id));
  
  if (productCount.count > 0) {
    return res.status(400).json(errorResponse('Cannot delete category with existing products'));
  }
  
  await db.delete(categories).where(eq(categories.id, id));
  
  res.json(successResponse(null, 'Category deleted successfully'));
}));

// Products management with improved data handling
router.get("/products", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  const { categoryId, search } = req.query;
  
  // Build query with joins
  const baseQuery = db.select({
    product: products,
    category: categories
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id));
  
  // Execute query with conditional filter
  const allProducts = categoryId 
    ? await baseQuery.where(eq(products.categoryId, categoryId as string)).orderBy(desc(products.createdAt))
    : await baseQuery.orderBy(desc(products.createdAt));
  
  // Format products
  const formattedProducts = allProducts.map(item => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    description: item.product.description,
    price: formatDecimal(item.product.price),
    comparePrice: item.product.comparePrice ? formatDecimal(item.product.comparePrice) : null,
    category: item.category ? {
      id: item.category.id,
      name: item.category.name
    } : null,
    inventoryQuantity: item.product.inventoryQuantity,
    sku: item.product.sku,
    isFeatured: item.product.isFeatured,
    createdAt: item.product.createdAt,
    updatedAt: item.product.updatedAt
  }));
  
  // Apply pagination
  const paginatedProducts = applyPagination(formattedProducts, page, limit);
  
  res.json(successResponse(paginatedResponse(paginatedProducts, page, limit, formattedProducts.length)));
}));

router.get("/products/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await db.select({
    product: products,
    category: categories
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.id, id));
  
  if (result.length === 0) {
    return res.status(404).json(errorResponse('Product not found'));
  }
  
  const item = result[0];
  const formattedProduct = {
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    description: item.product.description,
    price: formatDecimal(item.product.price),
    comparePrice: item.product.comparePrice ? formatDecimal(item.product.comparePrice) : null,
    category: item.category ? {
      id: item.category.id,
      name: item.category.name
    } : null,
    inventoryQuantity: item.product.inventoryQuantity,
    sku: item.product.sku,
    isFeatured: item.product.isFeatured,
    createdAt: item.product.createdAt,
    updatedAt: item.product.updatedAt
  };
  
  res.json(successResponse(formattedProduct));
}));

router.post("/products", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['name', 'price', 'categoryId']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [newProduct] = await db.insert(products).values({
    ...data,
    slug,
    price: data.price.toString(),
    comparePrice: data.comparePrice ? data.comparePrice.toString() : null,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse({
    ...newProduct,
    price: formatDecimal(newProduct.price),
    comparePrice: newProduct.comparePrice ? formatDecimal(newProduct.comparePrice) : null
  }, 'Product created successfully'));
}));

router.put("/products/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const updateData: any = { ...data, updatedAt: new Date() };
  
  if (data.price !== undefined) {
    updateData.price = data.price.toString();
  }
  if (data.comparePrice !== undefined) {
    updateData.comparePrice = data.comparePrice ? data.comparePrice.toString() : null;
  }
  
  const [updatedProduct] = await db.update(products)
    .set(updateData)
    .where(eq(products.id, id))
    .returning();
  
  if (!updatedProduct) {
    return res.status(404).json(errorResponse('Product not found'));
  }
  
  res.json(successResponse({
    ...updatedProduct,
    price: formatDecimal(updatedProduct.price),
    comparePrice: updatedProduct.comparePrice ? formatDecimal(updatedProduct.comparePrice) : null
  }, 'Product updated successfully'));
}));

router.delete("/products/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check if product is in any orders
  const [orderCount] = await db.select({ count: sql<number>`count(*)` })
    .from(orderItems)
    .where(eq(orderItems.productId, id));
  
  if (orderCount.count > 0) {
    return res.status(400).json(errorResponse('Cannot delete product that has been ordered'));
  }
  
  await db.delete(products).where(eq(products.id, id));
  
  res.json(successResponse(null, 'Product deleted successfully'));
}));

// Customer management
router.get("/customers", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  
  const allCustomers = await db.select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    role: users.role,
    createdAt: users.createdAt,
    orderCount: sql<number>`(SELECT COUNT(*) FROM orders WHERE orders.userId = ${users.id})`
  }).from(users).orderBy(desc(users.createdAt));
  
  const paginatedCustomers = applyPagination(allCustomers, page, limit);
  
  const formattedCustomers = paginatedCustomers.map(customer => ({
    id: customer.id,
    email: customer.email,
    name: customer.fullName,
    role: customer.role || 'customer',
    orderCount: customer.orderCount || 0,
    createdAt: customer.createdAt
  }));
  
  res.json(successResponse(paginatedResponse(formattedCustomers, page, limit, allCustomers.length)));
}));

router.get("/customers/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [customer] = await db.select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    role: users.role,
    createdAt: users.createdAt,
    orderCount: sql<number>`(SELECT COUNT(*) FROM orders WHERE orders.userId = ${users.id})`
  }).from(users).where(eq(users.id, id));
  
  if (!customer) {
    return res.status(404).json(errorResponse('Customer not found'));
  }
  
  res.json(successResponse({
    id: customer.id,
    email: customer.email,
    name: customer.fullName,
    role: customer.role || 'customer',
    orderCount: customer.orderCount || 0,
    createdAt: customer.createdAt
  }));
}));

router.put("/customers/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const [updatedCustomer] = await db.update(users)
    .set({
      fullName: data.fullName || data.name,
      email: data.email,
      role: data.role,
      updatedAt: new Date()
    })
    .where(eq(users.id, id))
    .returning();
  
  if (!updatedCustomer) {
    return res.status(404).json(errorResponse('Customer not found'));
  }
  
  res.json(successResponse(updatedCustomer, 'Customer updated successfully'));
}));

router.delete("/customers/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check if customer has orders
  const [orderCount] = await db.select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, id));
  
  if (orderCount.count > 0) {
    return res.status(400).json(errorResponse('Cannot delete customer with existing orders'));
  }
  
  await db.delete(users).where(eq(users.id, id));
  
  res.json(successResponse(null, 'Customer deleted successfully'));
}));

// Coupons management
router.get("/coupons", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  
  const formattedCoupons = allCoupons.map(coupon => ({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: formatDecimal(coupon.value),
    minimumAmount: coupon.minimumAmount ? formatDecimal(coupon.minimumAmount) : null,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    createdAt: coupon.createdAt
  }));
  
  const paginatedCoupons = applyPagination(formattedCoupons, page, limit);
  
  res.json(successResponse(paginatedResponse(paginatedCoupons, page, limit, formattedCoupons.length)));
}));

router.get("/coupons/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
  
  if (!coupon) {
    return res.status(404).json(errorResponse('Coupon not found'));
  }
  
  res.json(successResponse({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: formatDecimal(coupon.value),
    minimumAmount: coupon.minimumAmount ? formatDecimal(coupon.minimumAmount) : null,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    createdAt: coupon.createdAt
  }));
}));

router.post("/coupons", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['code', 'type', 'value']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  // Check if coupon code already exists
  const [existing] = await db.select().from(coupons).where(eq(coupons.code, data.code));
  if (existing) {
    return res.status(400).json(errorResponse('Coupon code already exists'));
  }
  
  const [newCoupon] = await db.insert(coupons).values({
    ...data,
    value: data.value.toString(),
    minimumAmount: data.minimumAmount ? data.minimumAmount.toString() : null,
    usedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse({
    ...newCoupon,
    value: formatDecimal(newCoupon.value),
    minimumAmount: newCoupon.minimumAmount ? formatDecimal(newCoupon.minimumAmount) : null
  }, 'Coupon created successfully'));
}));

router.put("/coupons/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const updateData: any = { ...data, updatedAt: new Date() };
  
  if (data.value !== undefined) {
    updateData.value = data.value.toString();
  }
  if (data.minimumAmount !== undefined) {
    updateData.minimumAmount = data.minimumAmount ? data.minimumAmount.toString() : null;
  }
  
  const [updatedCoupon] = await db.update(coupons)
    .set(updateData)
    .where(eq(coupons.id, id))
    .returning();
  
  if (!updatedCoupon) {
    return res.status(404).json(errorResponse('Coupon not found'));
  }
  
  res.json(successResponse({
    ...updatedCoupon,
    value: formatDecimal(updatedCoupon.value),
    minimumAmount: updatedCoupon.minimumAmount ? formatDecimal(updatedCoupon.minimumAmount) : null
  }, 'Coupon updated successfully'));
}));

router.delete("/coupons/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await db.delete(coupons).where(eq(coupons.id, id));
  
  res.json(successResponse(null, 'Coupon deleted successfully'));
}));

// Reviews management
router.get("/reviews", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  const { productId, isApproved } = req.query;
  
  const baseQuery = db.select({
    review: reviews,
    product: products,
    user: users
  })
  .from(reviews)
  .leftJoin(products, eq(reviews.productId, products.id))
  .leftJoin(users, eq(reviews.userId, users.id));
  
  // Build conditions array
  const conditions = [];
  if (productId) {
    conditions.push(eq(reviews.productId, productId as string));
  }
  if (isApproved !== undefined) {
    conditions.push(eq(reviews.isApproved, isApproved === 'true'));
  }
  
  // Execute query with conditional filters
  const allReviews = conditions.length > 0
    ? await baseQuery.where(and(...conditions)).orderBy(desc(reviews.createdAt))
    : await baseQuery.orderBy(desc(reviews.createdAt));
  
  const formattedReviews = allReviews.map(item => ({
    id: item.review.id,
    productId: item.review.productId,
    productName: item.product?.name || 'Unknown Product',
    userId: item.review.userId,
    userName: item.user?.fullName || 'Anonymous',
    rating: item.review.rating,
    title: item.review.title,
    comment: item.review.comment,
    isVerifiedPurchase: item.review.isVerifiedPurchase,
    isApproved: item.review.isApproved,
    createdAt: item.review.createdAt
  }));
  
  const paginatedReviews = applyPagination(formattedReviews, page, limit);
  
  res.json(successResponse(paginatedResponse(paginatedReviews, page, limit, formattedReviews.length)));
}));

router.patch("/reviews/:id/approve", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body;
  
  const [updatedReview] = await db.update(reviews)
    .set({
      isApproved: isApproved === true,
      updatedAt: new Date()
    })
    .where(eq(reviews.id, id))
    .returning();
  
  if (!updatedReview) {
    return res.status(404).json(errorResponse('Review not found'));
  }
  
  res.json(successResponse({
    id: updatedReview.id,
    isApproved: updatedReview.isApproved
  }, `Review ${isApproved ? 'approved' : 'rejected'} successfully`));
}));

// Blog Posts Management
router.get("/blog-posts", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  
  const allBlogPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  
  const formattedBlogPosts = allBlogPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    isPublished: post.isPublished,
    // isFeatured property doesn't exist in the schema
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }));
  
  const paginatedBlogPosts = applyPagination(formattedBlogPosts, page, limit);
  
  res.json(successResponse(paginatedResponse(paginatedBlogPosts, page, limit, formattedBlogPosts.length)));
}));

router.get("/blog-posts/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  
  if (!post) {
    return res.status(404).json(errorResponse('Blog post not found'));
  }
  
  res.json(successResponse({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    isPublished: post.isPublished,
    // isFeatured property doesn't exist in the schema
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }));
}));

router.post("/blog-posts", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['title', 'content']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [newPost] = await db.insert(blogPosts).values({
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt,
    featuredImage: data.featuredImage,
    isPublished: data.isPublished || false,
    // Remove isFeatured as it doesn't exist in schema
    authorId: data.authorId,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse(newPost, 'Blog post created successfully'));
}));

router.put("/blog-posts/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const [updatedPost] = await db.update(blogPosts)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(blogPosts.id, id))
    .returning();
  
  if (!updatedPost) {
    return res.status(404).json(errorResponse('Blog post not found'));
  }
  
  res.json(successResponse(updatedPost, 'Blog post updated successfully'));
}));

router.delete("/blog-posts/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  
  res.json(successResponse(null, 'Blog post deleted successfully'));
}));

// Collections Management
router.get("/collections", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validatePaginationParams(req);
  
  const allCollections = await db.select().from(collections).orderBy(desc(collections.createdAt));
  
  const formattedCollections = allCollections.map(collection => ({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    isPublished: collection.isPublished,
    // Remove isActive and isFeatured as they don't exist in schema
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt
  }));
  
  const paginatedCollections = applyPagination(formattedCollections, page, limit);
  
  res.json(successResponse(paginatedResponse(paginatedCollections, page, limit, formattedCollections.length)));
}));

router.get("/collections/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [collection] = await db.select().from(collections).where(eq(collections.id, id));
  
  if (!collection) {
    return res.status(404).json(errorResponse('Collection not found'));
  }
  
  res.json(successResponse({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    isPublished: collection.isPublished,
    // Remove isActive and isFeatured as they don't exist in schema
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt
  }));
}));

router.post("/collections", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['name']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [newCollection] = await db.insert(collections).values({
    name: data.name,
    slug,
    description: data.description,
    image: data.image,
    isPublished: data.isPublished !== undefined ? data.isPublished : false,
    // Remove isActive and isFeatured as they don't exist in schema
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse(newCollection, 'Collection created successfully'));
}));

router.put("/collections/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const [updatedCollection] = await db.update(collections)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(collections.id, id))
    .returning();
  
  if (!updatedCollection) {
    return res.status(404).json(errorResponse('Collection not found'));
  }
  
  res.json(successResponse(updatedCollection, 'Collection updated successfully'));
}));

router.delete("/collections/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Remove all products from collection first
  await db.delete(collectionProducts).where(eq(collectionProducts.collectionId, id));
  
  // Delete the collection
  await db.delete(collections).where(eq(collections.id, id));
  
  res.json(successResponse(null, 'Collection deleted successfully'));
}));

// Collection Products Management
router.get("/collections/:id/products", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const collectionProductsData = await db.select({
    product: products,
    collectionProduct: collectionProducts
  })
  .from(collectionProducts)
  .innerJoin(products, eq(collectionProducts.productId, products.id))
  .where(eq(collectionProducts.collectionId, id))
  .orderBy(collectionProducts.sortOrder);
  
  const formattedProducts = collectionProductsData.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: formatDecimal(item.product.price),
    sortOrder: item.collectionProduct.sortOrder
  }));
  
  res.json(successResponse(formattedProducts));
}));

router.post("/collections/:id/products", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = sanitizeInput(req.body);
  
  const validationError = validateRequiredFields(data, ['productId']);
  if (validationError) {
    return res.status(400).json(errorResponse(validationError));
  }
  
  // Check if product is already in collection
  const [existing] = await db.select()
    .from(collectionProducts)
    .where(and(
      eq(collectionProducts.collectionId, id),
      eq(collectionProducts.productId, data.productId)
    ));
  
  if (existing) {
    return res.status(400).json(errorResponse('Product already in collection'));
  }
  
  const [newCollectionProduct] = await db.insert(collectionProducts).values({
    collectionId: id,
    productId: data.productId,
    sortOrder: data.sortOrder || 0,
    createdAt: new Date()
  }).returning();
  
  res.status(201).json(successResponse(newCollectionProduct, 'Product added to collection successfully'));
}));

router.delete("/collections/:id/products/:productId", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { id, productId } = req.params;
  
  await db.delete(collectionProducts)
    .where(and(
      eq(collectionProducts.collectionId, id),
      eq(collectionProducts.productId, productId)
    ));
  
  res.json(successResponse(null, 'Product removed from collection successfully'));
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'attached_assets');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post("/upload", requireAdmin, upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json(errorResponse('No file uploaded'));
  }
  
  // Return the file URL relative to the public directory
  const fileUrl = `/attached_assets/${req.file.filename}`;
  
  res.json(successResponse({
    url: fileUrl,
    originalName: req.file.originalname,
    size: req.file.size
  }, 'File uploaded successfully'));
}));

export default router;
