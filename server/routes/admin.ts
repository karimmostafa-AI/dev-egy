import express, { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { db, categories, products, orders, users, orderItems, coupons, blogPosts, reviews, collections, collectionProducts } from "../db";
import { eq, desc, and, sql } from "drizzle-orm";

const router = express.Router();
const authService = new AuthService();

// Middleware to bypass admin authentication (for development only)
const requireAdmin = (req: Request, res: Response, next: any) => {
  // Skip authentication for development
  console.log("Admin authentication bypassed for development");
  next();
};

// Dashboard analytics
router.get("/dashboard/analytics", requireAdmin, async (req, res) => {
  try {
    // Fetch real data from the database
    const totalProductsResult = await db.select({ count: sql<number>`count(*)` }).from(products);
    const totalOrdersResult = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const totalCustomersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    
    const totalProducts = totalProductsResult[0]?.count || 0;
    const totalOrders = totalOrdersResult[0]?.count || 0;
    const totalCustomers = totalCustomersResult[0]?.count || 0;
    
    // Get order status counts
    const orderStatusCounts = await db.select({ 
      status: orders.status,
      count: sql<number>`count(*)`
    }).from(orders).groupBy(orders.status);
    
    // Calculate earnings
    const earningsResult = await db.select({ 
      total: sql<number>`SUM(${orders.total})`
    }).from(orders).where(eq(orders.status, "delivered"));
    
    const totalEarnings = earningsResult[0]?.total || 0;
    
    // Today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEarningsResult = await db.select({ 
      total: sql<number>`SUM(${orders.total})`
    }).from(orders)
      .where(and(
        eq(orders.status, "delivered"),
        sql`date(${orders.createdAt}) = date('now')`
      ));
    
    const todayEarnings = todayEarningsResult[0]?.total || 0;
    
    // Calculate weekly earnings
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyEarningsResult = await db.select({ 
      total: sql<number>`SUM(${orders.total})`
    }).from(orders)
      .where(and(
        eq(orders.status, "delivered"),
        sql`${orders.createdAt} >= ${weekAgo.getTime()}`
      ));
    
    const weeklyEarnings = weeklyEarningsResult[0]?.total || 0;
    
    // Calculate monthly earnings
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthlyEarningsResult = await db.select({ 
      total: sql<number>`SUM(${orders.total})`
    }).from(orders)
      .where(and(
        eq(orders.status, "delivered"),
        sql`${orders.createdAt} >= ${monthAgo.getTime()}`
      ));
    
    const monthlyEarnings = monthlyEarningsResult[0]?.total || 0;
    
    // Get top selling products
    const topProductsResult = await db.select({
      productName: products.name,
      totalSales: sql<number>`SUM(${orderItems.quantity} * ${orderItems.price})`,
      totalQuantity: sql<number>`SUM(${orderItems.quantity})`
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .groupBy(products.id, products.name)
    .orderBy(sql`SUM(${orderItems.quantity} * ${orderItems.price}) DESC`)
    .limit(5);
    
    // Calculate percentage changes for KPIs
    // For simplicity, we'll use fixed values, but in a real app you would compare to previous periods
    const productsChange = 12; // Mock value
    const customersChange = 8; // Mock value
    const ordersChange = 15; // Mock value
    const earningsChange = 22; // Mock value
    const todayEarningsChange = 5; // Mock value
    
    // Get sales trends (last 7 months)
    const salesTrendsResult = await db.select({
      month: sql<string>`strftime('%Y-%m', ${orders.createdAt})`,
      total: sql<number>`SUM(${orders.total})`
    })
    .from(orders)
    .where(eq(orders.status, "delivered"))
    .groupBy(sql`strftime('%Y-%m', ${orders.createdAt})`)
    .orderBy(sql`strftime('%Y-%m', ${orders.createdAt}) DESC`)
    .limit(7);
    
    // Format sales trends for the chart
    const salesTrends = salesTrendsResult.map(item => ({
      name: new Date(item.month + "-01").toLocaleDateString('en-US', { month: 'short' }),
      total: parseFloat(item.total.toString())
    })).reverse(); // Reverse to show chronological order
    
    // Format the data for the frontend - properly type the analytics object
    const analytics: {
      totalProducts: number;
      totalCustomers: number;
      totalOrders: number;
      confirmedOrders: number;
      pendingOrders: number;
      processingOrders: number;
      pickupOrders: number;
      onTheWayOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
      totalEarnings: number;
      todayEarnings: number;
      weeklyEarnings: number;
      monthlyEarnings: number;
      productsChange: number;
      customersChange: number;
      ordersChange: number;
      earningsChange: number;
      todayEarningsChange: number;
      pendingWithdrawals: number;
      rejectedWithdrawals: number;
      salesTrends: Array<{ name: string; total: number }>;
      orderStatusDistribution: Array<{ name: string; value: number }>;
      topSellingProducts: Array<{ name: string; sales: number; revenue: string }>;
      recentOrders: Array<{ id: string; date: string; customer: string; amount: number; status: string }>;
    } = {
      totalProducts: totalProducts,
      totalCustomers: totalCustomers,
      totalOrders: totalOrders,
      confirmedOrders: orderStatusCounts.find(s => s.status === "confirmed")?.count || 0,
      pendingOrders: orderStatusCounts.find(s => s.status === "pending")?.count || 0,
      processingOrders: orderStatusCounts.find(s => s.status === "processing")?.count || 0,
      pickupOrders: 0,
      onTheWayOrders: 0,
      deliveredOrders: orderStatusCounts.find(s => s.status === "delivered")?.count || 0,
      cancelledOrders: orderStatusCounts.find(s => s.status === "cancelled")?.count || 0,
      totalEarnings: totalEarnings,
      todayEarnings: todayEarnings,
      weeklyEarnings: weeklyEarnings,
      monthlyEarnings: monthlyEarnings,
      productsChange: productsChange,
      customersChange: customersChange,
      ordersChange: ordersChange,
      earningsChange: earningsChange,
      todayEarningsChange: todayEarningsChange,
      pendingWithdrawals: 0,
      rejectedWithdrawals: 0,
      salesTrends: salesTrends,
      orderStatusDistribution: [
        { name: "Pending", value: orderStatusCounts.find(s => s.status === "pending")?.count || 0 },
        { name: "Confirmed", value: orderStatusCounts.find(s => s.status === "confirmed")?.count || 0 },
        { name: "Processing", value: orderStatusCounts.find(s => s.status === "processing")?.count || 0 },
        { name: "Delivered", value: orderStatusCounts.find(s => s.status === "delivered")?.count || 0 },
        { name: "Cancelled", value: orderStatusCounts.find(s => s.status === "cancelled")?.count || 0 },
      ],
      topSellingProducts: topProductsResult.map(product => ({
        name: product.productName,
        sales: product.totalQuantity,
        revenue: `${parseFloat(product.totalSales.toString()).toFixed(2)}`
      })),
      recentOrders: [] // Initialize as empty array
    };
    
    // Fetch recent orders
    const recentOrdersResult = await db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);
    
    analytics.recentOrders = recentOrdersResult.map(order => ({
      id: order.orderNumber,
      date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : '',
      customer: `${order.firstName} ${order.lastName}`,
      amount: parseFloat(order.total.toString()),
      status: order.status
    }));
    
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Orders management
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build and execute query based on filter
    let allOrders;
    if (status && status !== "all") {
      allOrders = await db.select().from(orders)
        .where(eq(orders.status, status as string))
        .orderBy(desc(orders.createdAt));
    } else {
      allOrders = await db.select().from(orders)
        .orderBy(desc(orders.createdAt));
    }
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedOrders = allOrders.slice(startIndex, startIndex + limitNum);
    
    // Format orders for the frontend
    const formattedOrders = paginatedOrders.map(order => ({
      id: order.orderNumber,
      date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : '',
      customer: `${order.firstName} ${order.lastName}`,
      brand: "N/A", // We don't have brand info in orders table
      amount: parseFloat(order.total.toString()),
      status: order.status,
      paymentMethod: order.paymentMethod || "N/A"
    }));
    
    res.json({
      orders: formattedOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allOrders.length,
        totalPages: Math.ceil(allOrders.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refunds management
router.get("/refunds", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // For now, we'll return an empty array since we don't have a refunds table
    // In a real implementation, you would fetch from a refunds table
    const refunds: any[] = [];
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedRefunds = refunds.slice(startIndex, startIndex + limitNum);
    
    res.json({
      refunds: paginatedRefunds,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: refunds.length,
        totalPages: Math.ceil(refunds.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching refunds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Categories management
router.get("/categories", requireAdmin, async (req, res) => {
  try {
    // Fetch categories from the database
    console.log("Fetching categories from database...");
    const allCategories = await db.select().from(categories);
    console.log("Categories fetched successfully:", allCategories);
    res.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/categories", requireAdmin, async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Save to the database
    const [newCategory] = await db.insert(categories).values({
      name,
      description,
      parentId: parentId || null,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // Update in the database
    const [updatedCategory] = await db.update(categories).set({
      name,
      description,
      updatedAt: new Date()
    }).where(eq(categories.id, id)).returning();
    
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    await db.delete(categories).where(eq(categories.id, id));
    
    res.json({ message: `Category ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Products management
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch products from the database with category information
    console.log("Fetching products from database...");
    const allProducts = await db.select({
      product: products,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));
    
    console.log("Products fetched successfully:", allProducts.length);
    
    // Format products for the frontend
    const formattedProducts = allProducts.map(item => ({
      ...item.product,
      category: item.category
    }));
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = formattedProducts.slice(startIndex, startIndex + limitNum);
    
    res.json({
      products: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: formattedProducts.length,
        totalPages: Math.ceil(formattedProducts.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate slug from name
    const slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Save to the database
    const [newProduct] = await db.insert(products).values({
      ...productData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    // Update in the database
    const [updatedProduct] = await db.update(products).set({
      ...productData,
      updatedAt: new Date()
    }).where(eq(products.id, id)).returning();
    
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    await db.delete(products).where(eq(products.id, id));
    
    res.json({ message: `Product ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Customer management
router.get("/customers", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch customers from the database
    const allCustomers = await db.select().from(users);
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCustomers = allCustomers.slice(startIndex, startIndex + limitNum);
    
    // Format customers for the frontend
    const formattedCustomers = paginatedCustomers.map(customer => ({
      id: customer.id,
      name: customer.fullName,
      email: customer.email,
      createdAt: customer.createdAt
    }));
    
    res.json({
      customers: formattedCustomers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allCustomers.length,
        totalPages: Math.ceil(allCustomers.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/customers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch customer from the database
    const customerResult = await db.select().from(users).where(eq(users.id, id));
    
    if (customerResult.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    const customer = customerResult[0];
    
    // Format customer for the frontend
    const formattedCustomer = {
      id: customer.id,
      name: customer.fullName,
      email: customer.email,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
    
    res.json(formattedCustomer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/customers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    // Update in the database
    const [updatedCustomer] = await db.update(users).set({
      fullName: name,
      email,
      updatedAt: new Date()
    }).where(eq(users.id, id)).returning();
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Format customer for the frontend
    const formattedCustomer = {
      id: updatedCustomer.id,
      name: updatedCustomer.fullName,
      email: updatedCustomer.email,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt
    };
    
    res.json(formattedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/customers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    const deletedCustomer = await db.delete(users).where(eq(users.id, id)).returning();
    
    if (deletedCustomer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json({ message: `Customer ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Coupon management
router.get("/coupons", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch coupons from the database
    const allCoupons = await db.select().from(coupons);
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCoupons = allCoupons.slice(startIndex, startIndex + limitNum);
    
    // Format coupons for the frontend
    const formattedCoupons = paginatedCoupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: parseFloat(coupon.value.toString()),
      minimumAmount: coupon.minimumAmount ? parseFloat(coupon.minimumAmount.toString()) : null,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      createdAt: coupon.createdAt
    }));
    
    res.json({
      coupons: formattedCoupons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allCoupons.length,
        totalPages: Math.ceil(allCoupons.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/coupons", requireAdmin, async (req, res) => {
  try {
    const couponData = req.body;
    
    // Save to the database
    const [newCoupon] = await db.insert(coupons).values({
      ...couponData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    // Format coupon for the frontend
    const formattedCoupon = {
      id: newCoupon.id,
      code: newCoupon.code,
      type: newCoupon.type,
      value: parseFloat(newCoupon.value.toString()),
      minimumAmount: newCoupon.minimumAmount ? parseFloat(newCoupon.minimumAmount.toString()) : null,
      usageLimit: newCoupon.usageLimit,
      usedCount: newCoupon.usedCount,
      isActive: newCoupon.isActive,
      startDate: newCoupon.startDate,
      endDate: newCoupon.endDate,
      createdAt: newCoupon.createdAt
    };
    
    res.status(201).json(formattedCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch coupon from the database
    const couponResult = await db.select().from(coupons).where(eq(coupons.id, id));
    
    if (couponResult.length === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    const coupon = couponResult[0];
    
    // Format coupon for the frontend
    const formattedCoupon = {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: parseFloat(coupon.value.toString()),
      minimumAmount: coupon.minimumAmount ? parseFloat(coupon.minimumAmount.toString()) : null,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      createdAt: coupon.createdAt
    };
    
    res.json(formattedCoupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const couponData = req.body;
    
    // Update in the database
    const [updatedCoupon] = await db.update(coupons).set({
      ...couponData,
      updatedAt: new Date()
    }).where(eq(coupons.id, id)).returning();
    
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    // Format coupon for the frontend
    const formattedCoupon = {
      id: updatedCoupon.id,
      code: updatedCoupon.code,
      type: updatedCoupon.type,
      value: parseFloat(updatedCoupon.value.toString()),
      minimumAmount: updatedCoupon.minimumAmount ? parseFloat(updatedCoupon.minimumAmount.toString()) : null,
      usageLimit: updatedCoupon.usageLimit,
      usedCount: updatedCoupon.usedCount,
      isActive: updatedCoupon.isActive,
      startDate: updatedCoupon.startDate,
      endDate: updatedCoupon.endDate,
      createdAt: updatedCoupon.createdAt
    };
    
    res.json(formattedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    const deletedCoupon = await db.delete(coupons).where(eq(coupons.id, id)).returning();
    
    if (deletedCoupon.length === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.json({ message: `Coupon ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Blog post management
router.get("/blog-posts", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch blog posts from the database
    const allBlogPosts = await db.select().from(blogPosts);
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedBlogPosts = allBlogPosts.slice(startIndex, startIndex + limitNum);
    
    // Format blog posts for the frontend
    const formattedBlogPosts = paginatedBlogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt
    }));
    
    res.json({
      blogPosts: formattedBlogPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allBlogPosts.length,
        totalPages: Math.ceil(allBlogPosts.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/blog-posts", requireAdmin, async (req, res) => {
  try {
    const postData = req.body;
    
    // Generate slug from title if not provided
    const slug = postData.slug || postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Save to the database
    const [newPost] = await db.insert(blogPosts).values({
      ...postData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    // Format post for the frontend
    const formattedPost = {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      content: newPost.content,
      excerpt: newPost.excerpt,
      featuredImage: newPost.featuredImage,
      isPublished: newPost.isPublished,
      publishedAt: newPost.publishedAt,
      authorId: newPost.authorId,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt
    };
    
    res.status(201).json(formattedPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/blog-posts/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch blog post from the database
    const postResult = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    
    if (postResult.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    const post = postResult[0];
    
    // Format post for the frontend
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
    
    res.json(formattedPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/blog-posts/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const postData = req.body;
    
    // Generate slug from title if not provided
    let slug = postData.slug;
    if (!slug && postData.title) {
      slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Update in the database
    const [updatedPost] = await db.update(blogPosts).set({
      ...postData,
      slug,
      updatedAt: new Date()
    }).where(eq(blogPosts.id, id)).returning();
    
    if (!updatedPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    // Format post for the frontend
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt,
      featuredImage: updatedPost.featuredImage,
      isPublished: updatedPost.isPublished,
      publishedAt: updatedPost.publishedAt,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt
    };
    
    res.json(formattedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/blog-posts/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    const deletedPost = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    
    if (deletedPost.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    res.json({ message: `Blog post ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Review management
router.get("/reviews", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch reviews from the database with product and user information
    const allReviews = await db.select({
      review: reviews,
      product: products,
      user: users
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .leftJoin(users, eq(reviews.userId, users.id));
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedReviews = allReviews.slice(startIndex, startIndex + limitNum);
    
    // Format reviews for the frontend
    const formattedReviews = paginatedReviews.map(item => ({
      id: item.review.id,
      productId: item.review.productId,
      productName: item.product?.name || "Unknown Product",
      userId: item.review.userId,
      userName: item.user?.fullName || "Unknown User",
      rating: item.review.rating,
      title: item.review.title,
      comment: item.review.comment,
      isVerifiedPurchase: item.review.isVerifiedPurchase,
      isApproved: item.review.isApproved,
      createdAt: item.review.createdAt
    }));
    
    res.json({
      reviews: formattedReviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allReviews.length,
        totalPages: Math.ceil(allReviews.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch review from the database with product and user information
    const reviewResult = await db.select({
      review: reviews,
      product: products,
      user: users
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.id, id));
    
    if (reviewResult.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    const item = reviewResult[0];
    
    // Format review for the frontend
    const formattedReview = {
      id: item.review.id,
      productId: item.review.productId,
      productName: item.product?.name || "Unknown Product",
      userId: item.review.userId,
      userName: item.user?.fullName || "Unknown User",
      rating: item.review.rating,
      title: item.review.title,
      comment: item.review.comment,
      isVerifiedPurchase: item.review.isVerifiedPurchase,
      isApproved: item.review.isApproved,
      createdAt: item.review.createdAt
    };
    
    res.json(formattedReview);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    // Update in the database
    const [updatedReview] = await db.update(reviews).set({
      isApproved,
      updatedAt: new Date()
    }).where(eq(reviews.id, id)).returning();
    
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Format review for the frontend
    const formattedReview = {
      id: updatedReview.id,
      productId: updatedReview.productId,
      userId: updatedReview.userId,
      rating: updatedReview.rating,
      title: updatedReview.title,
      comment: updatedReview.comment,
      isVerifiedPurchase: updatedReview.isVerifiedPurchase,
      isApproved: updatedReview.isApproved,
      createdAt: updatedReview.createdAt
    };
    
    res.json(formattedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from the database
    const deletedReview = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    
    if (deletedReview.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.json({ message: `Review ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Collection management
router.get("/collections", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Fetch collections from the database
    const allCollections = await db.select().from(collections);
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCollections = allCollections.slice(startIndex, startIndex + limitNum);
    
    // Format collections for the frontend
    const formattedCollections = paginatedCollections.map(collection => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      isPublished: collection.isPublished,
      createdAt: collection.createdAt
    }));
    
    res.json({
      collections: formattedCollections,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allCollections.length,
        totalPages: Math.ceil(allCollections.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/collections", requireAdmin, async (req, res) => {
  try {
    const collectionData = req.body;
    
    // Generate slug from name if not provided
    const slug = collectionData.slug || collectionData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Save to the database
    const [newCollection] = await db.insert(collections).values({
      ...collectionData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    // Format collection for the frontend
    const formattedCollection = {
      id: newCollection.id,
      name: newCollection.name,
      slug: newCollection.slug,
      description: newCollection.description,
      image: newCollection.image,
      isPublished: newCollection.isPublished,
      createdAt: newCollection.createdAt,
      updatedAt: newCollection.updatedAt
    };
    
    res.status(201).json(formattedCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/collections/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch collection from the database
    const collectionResult = await db.select().from(collections).where(eq(collections.id, id));
    
    if (collectionResult.length === 0) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    const collection = collectionResult[0];
    
    // Format collection for the frontend
    const formattedCollection = {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      isPublished: collection.isPublished,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt
    };
    
    res.json(formattedCollection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/collections/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const collectionData = req.body;
    
    // Generate slug from name if not provided
    let slug = collectionData.slug;
    if (!slug && collectionData.name) {
      slug = collectionData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Update in the database
    const [updatedCollection] = await db.update(collections).set({
      ...collectionData,
      slug,
      updatedAt: new Date()
    }).where(eq(collections.id, id)).returning();
    
    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    // Format collection for the frontend
    const formattedCollection = {
      id: updatedCollection.id,
      name: updatedCollection.name,
      slug: updatedCollection.slug,
      description: updatedCollection.description,
      image: updatedCollection.image,
      isPublished: updatedCollection.isPublished,
      createdAt: updatedCollection.createdAt,
      updatedAt: updatedCollection.updatedAt
    };
    
    res.json(formattedCollection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/collections/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete collection products first
    await db.delete(collectionProducts).where(eq(collectionProducts.collectionId, id));
    
    // Then delete the collection
    const deletedCollection = await db.delete(collections).where(eq(collections.id, id)).returning();
    
    if (deletedCollection.length === 0) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    res.json({ message: `Collection ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Collection products management
router.get("/collections/:id/products", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch collection products from the database with product information
    const collectionProductsResult = await db.select({
      collectionProduct: collectionProducts,
      product: products
    })
    .from(collectionProducts)
    .leftJoin(products, eq(collectionProducts.productId, products.id))
    .where(eq(collectionProducts.collectionId, id))
    .orderBy(collectionProducts.sortOrder);
    
    // Format collection products for the frontend
    const formattedCollectionProducts = collectionProductsResult.map(item => ({
      id: item.collectionProduct.id,
      collectionId: item.collectionProduct.collectionId,
      productId: item.collectionProduct.productId,
      productName: item.product?.name || "Unknown Product",
      sortOrder: item.collectionProduct.sortOrder,
      createdAt: item.collectionProduct.createdAt
    }));
    
    res.json(formattedCollectionProducts);
  } catch (error) {
    console.error("Error fetching collection products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/collections/:id/products", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, sortOrder = 0 } = req.body;
    
    // Add product to collection
    const [newCollectionProduct] = await db.insert(collectionProducts).values({
      collectionId: id,
      productId,
      sortOrder,
      createdAt: new Date()
    }).returning();
    
    res.status(201).json(newCollectionProduct);
  } catch (error) {
    console.error("Error adding product to collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/collections/:id/products/:productId", requireAdmin, async (req, res) => {
  try {
    const { id, productId } = req.params;
    
    // Remove product from collection
    const deletedCollectionProduct = await db.delete(collectionProducts)
      .where(and(
        eq(collectionProducts.collectionId, id),
        eq(collectionProducts.productId, productId)
      ))
      .returning();
    
    if (deletedCollectionProduct.length === 0) {
      return res.status(404).json({ message: "Product not found in collection" });
    }
    
    res.json({ message: `Product removed from collection successfully` });
  } catch (error) {
    console.error("Error removing product from collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;