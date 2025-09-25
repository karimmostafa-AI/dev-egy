import { Router } from "express";
import { OrderService } from "../services/orderService";
import { CartService } from "../services/cartService";
import { PaymentService } from "../services/paymentService";
import { AuthService } from "../services/authService";

const router = Router();
const orderService = new OrderService();
const cartService = new CartService();
const paymentService = new PaymentService();
const authService = new AuthService();

// Process checkout (protected route)
router.post("/", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    const { shippingAddress, paymentData, notes } = req.body;
    
    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    
    if (!paymentData) {
      return res.status(400).json({ message: "Payment data is required" });
    }
    
    // Get user's cart
    const cart = await cartService.getOrCreateCart(decoded.userId);
    
    // Check cart has items
    const cartItems = await cartService.getCartItems(cart.id);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    // Create order data
    const orderData = {
      userId: decoded.userId,
      cartId: cart.id,
      email: decoded.email,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        firstName: shippingAddress.fullName.split(' ')[0] || '',
        lastName: shippingAddress.fullName.split(' ').slice(1).join(' ') || '',
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        province: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        isDefault: shippingAddress.isDefault || false
      },
      notes: notes || ''
    };
    
    // Create order from cart (this includes inventory reservation)
    const { order, checkoutTotals } = await orderService.createOrderFromCart(orderData);
    
    // Process payment
    const paymentResult = await paymentService.processPayment(order.id, paymentData);
    
    // Complete the order (update inventory)
    await orderService.completeOrder(order.id, cart.id);
    
    // Clear the cart
    await cartService.clearCart(cart.id);
    
    res.status(201).json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status
      },
      payment: paymentResult,
      message: "Order created successfully"
    });
    
  } catch (error) {
    console.error("Checkout error:", error);
    
    let errorMessage = "An unexpected error occurred during checkout.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Handle specific error types
    if (errorMessage.includes("Insufficient inventory")) {
      return res.status(409).json({ message: errorMessage });
    }
    
    res.status(500).json({ message: errorMessage });
  }
});

// Get checkout totals (for preview before processing)
router.get("/totals", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    // Get user's cart
    const cart = await cartService.getOrCreateCart(decoded.userId);
    
    // Calculate totals
    const totals = await cartService.calculateCheckoutTotals(cart.id);
    
    res.json(totals);
    
  } catch (error) {
    console.error("Checkout totals error:", error);
    
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ message: errorMessage });
  }
});

export default router;