import { Router, Request, Response, NextFunction } from "express";
import { CartService } from "../services/cartService";
import { AuthService } from "../services/authService";
import { InferSelectModel } from "drizzle-orm";
import { carts } from "@shared/schema";

type Cart = InferSelectModel<typeof carts>;

// Extend the Request type to include our custom cart property
interface CartRequest extends Request {
  cart?: Cart;
}

const router = Router();
const cartService = new CartService();
const authService = new AuthService();

// Middleware to get or create cart
const getOrCreateCartMiddleware = async (req: CartRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;
    let sessionId = req.headers['x-session-id'] as string | undefined;
    
    // If user is authenticated, use userId
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }
    
    // If no user ID, we need a session ID
    if (!userId && !sessionId) {
      // Generate a temporary session ID
      sessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.setHeader('x-session-id', sessionId);
    }
    
    const cart = await cartService.getOrCreateCart(userId || undefined, sessionId || undefined);
    req.cart = cart;
    next();
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};

// Get cart items
router.get("/", getOrCreateCartMiddleware, async (req: CartRequest, res: Response) => {
  try {
    if (!req.cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    const cartItems = await cartService.getCartItems(req.cart.id);
    res.json({ cartItems });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Add item to cart
router.post("/items", getOrCreateCartMiddleware, async (req: CartRequest, res: Response) => {
  try {
    if (!req.cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const cartItem = await cartService.addItemToCart(
      req.cart.id, 
      productId, 
      quantity || 1
    );
    
    res.status(201).json({ cartItem });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Update cart item quantity
router.put("/items/:itemId", getOrCreateCartMiddleware, async (req: CartRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    const cartItem = await cartService.updateCartItemQuantity(itemId, quantity);
    res.json({ cartItem });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Remove item from cart
router.delete("/items/:itemId", getOrCreateCartMiddleware, async (req: CartRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    
    await cartService.removeItemFromCart(itemId);
    res.status(204).send();
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Clear cart
router.delete("/", getOrCreateCartMiddleware, async (req: CartRequest, res: Response) => {
  try {
    if (!req.cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    await cartService.clearCart(req.cart.id);
    res.status(204).send();
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;