import { Router } from "express";
import { PaymentService } from "../services/paymentService";
import { AuthService } from "../services/authService";

const router = Router();
const paymentService = new PaymentService();
const authService = new AuthService();

// Process payment
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
    
    const { orderId, paymentData } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    
    const result = await paymentService.processPayment(orderId, paymentData);
    res.status(201).json(result);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get payment details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
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
    
    const payment = await paymentService.getPayment(id);
    
    // Get the order to check user permission
    const order = await paymentService.getOrderById(payment.orderId);
    
    // Check if user has permission to view this payment
    if (order.userId !== decoded.userId) {
      return res.status(403).json({ message: "You don't have permission to view this payment" });
    }
    
    res.json({ payment });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Stripe webhook handler
router.post("/webhook", async (req, res) => {
  try {
    // In a real implementation, you would verify the webhook signature
    // For now, we'll just process the events
    
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await paymentService.confirmPayment(paymentIntent.id, 'succeeded');
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        await paymentService.confirmPayment(failedPaymentIntent.id, 'failed');
        break;
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Webhook error:", errorMessage);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
  }
});

export default router;