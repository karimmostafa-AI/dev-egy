import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "../shared/schema";
import { sampleProducts } from "../client/src/data/products"; // Temporary for mock data
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import brandRoutes from "./routes/brands";
import collectionRoutes from "./routes/collections";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import checkoutRoutes from "./routes/checkout";
import paymentRoutes from "./routes/payment";
import blogRoutes from "./routes/blog";
import searchRoutes from "./routes/search";
import couponRoutes from "./routes/coupons";
import addressRoutes from "./routes/addresses";
import wishlistRoutes from "./routes/wishlists";
// Use improved admin routes as primary admin API
import adminRoutes from "./routes/adminImproved";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add middleware to parse JSON bodies
  app.use(express.json());

  // Register API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/collections", collectionRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/checkout", checkoutRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/blog", blogRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/addresses", addressRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/admin", adminRoutes);

  // Existing products endpoint with filtering, sorting, and pagination
  app.get("/api/products-old", (req, res) => {
    let products = [...sampleProducts];

    const { category, color, size, brand, sortBy, page = '1', limit = '9' } = req.query;

    // Category filtering (for mens/womens)
    if (category === 'womens') {
        products = products.filter(p => p.name.toLowerCase().includes('women') || p.name.toLowerCase().includes('ladies'));
    } else if (category === 'mens') {
        products = products.filter(p => p.name.toLowerCase().includes('men') || p.name.toLowerCase().includes('unisex'));
    }

    // Sorting
    switch (sortBy) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            products.sort((a, b) => b.id - a.id);
            break;
        // Add more sorting cases as needed
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
        products: paginatedProducts,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalPages,
            totalProducts,
        },
    });
  });

  // Registration route (deprecated - use /api/auth/register instead)
  app.post("/api/auth/register-old", async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      // Basic validation
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      console.log(`Registering user: ${fullName} (${email})`);
      // In a real implementation, you would hash the password here
      // and call storage.insertUser(...)

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login route (deprecated - use /api/auth/login instead)
  app.post("/api/auth/login-old", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      console.log(`Attempting login for: ${email}`);
      // In a real implementation, you would find the user by email
      // and compare the hashed password

      res.status(200).json({ message: "Login successful", token: "dummy-jwt-token" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order submission route
  app.post("/api/orders", async (req, res) => {
    try {
      const orderDetails = req.body;
      console.log("Received order:", JSON.stringify(orderDetails, null, 2));

      // In a real app, you would process payment and save the order to the database here

      const mockOrderId = `UA-${Date.now()}`;
      res.status(201).json({ message: "Order placed successfully!", orderId: mockOrderId });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
