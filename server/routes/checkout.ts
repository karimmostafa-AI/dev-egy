import { Router } from "express";
import { CheckoutService } from "../services/checkoutService";
import { AuthService } from "../services/authService";

const router = Router();
const checkoutService = new CheckoutService();
const authService = new AuthService();

// Process checkout (protected route)
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
    
    const checkoutData = {
      ...req.body,
      userId: decoded.userId
    };
    
    const result = await checkoutService.processCheckout(checkoutData);
    res.status(201).json(result);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get checkout session details
router.get("/session/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const session = await checkoutService.getCheckoutSession(id);
    
    if (!session) {
      return res.status(404).json({ message: "Checkout session not found" });
    }
    
    res.json({ session });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;