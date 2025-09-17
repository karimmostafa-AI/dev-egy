import { Router } from "express";
import { OrderService } from "../services/orderService";
import { AuthService } from "../services/authService";

const router = Router();
const orderService = new OrderService();
const authService = new AuthService();

// Create new order (protected route)
router.post("/", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    const orderData = {
      ...req.body,
      userId: decoded.userId
    };
    
    const order = await orderService.createOrder(orderData);
    res.status(201).json({ order });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get order by ID (protected route)
router.get("/:id", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if user has permission to view this order
    if (order.userId !== decoded.userId) {
      return res.status(403).json({ message: "You don't have permission to view this order" });
    }
    
    res.json({ order });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get order status (public endpoint)
router.get("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const status = await orderService.getOrderStatus(id);
    
    if (!status) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ status });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;