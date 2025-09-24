import { Router, Request, Response } from "express";
import { WishlistService } from "../services/wishlistService";
import { AuthService } from "../services/authService";
import { z } from "zod";

const router = Router();
const wishlistService = new WishlistService();
const authService = new AuthService();

// Validation schemas
const addToWishlistSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  wishlistId: z.string().uuid("Invalid wishlist ID format").optional()
});

const createWishlistSchema = z.object({
  name: z.string().min(1, "Wishlist name is required").optional(),
  isPublic: z.boolean().optional()
});

// Authentication middleware
const authenticateUser = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    let errorMessage = "Authentication failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(401).json({ message: errorMessage });
  }
};

// GET /api/wishlist - Get user's wishlist(s) and items
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { wishlistId } = req.query;
    
    // Get wishlists metadata
    const wishlists = await wishlistService.getUserWishlists(userId);
    
    // Get items from the specified wishlist or default wishlist
    const items = await wishlistService.getWishlistItems(
      userId, 
      wishlistId as string
    );
    
    res.json({ 
      wishlists,
      items,
      currentWishlistId: wishlistId || (wishlists.length > 0 ? wishlists[0].id : null)
    });
  } catch (error) {
    let errorMessage = "Failed to get wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/wishlist/items - Get wishlist items only
router.get("/items", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { wishlistId } = req.query;
    
    const items = await wishlistService.getWishlistItems(
      userId, 
      wishlistId as string
    );
    
    res.json({ items });
  } catch (error) {
    let errorMessage = "Failed to get wishlist items";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// POST /api/wishlist/items - Add product to wishlist
router.post("/items", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    // Validate request body
    const validationResult = addToWishlistSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: validationResult.error.issues 
      });
    }
    
    const { productId, wishlistId } = validationResult.data;
    
    const wishlistItem = await wishlistService.addProductToWishlist(
      userId, 
      productId, 
      wishlistId
    );
    
    res.status(201).json({ item: wishlistItem });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already in wishlist")) {
        return res.status(409).json({ message: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
    }
    let errorMessage = "Failed to add product to wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// DELETE /api/wishlist/items/:id - Remove item from wishlist by item ID
router.delete("/items/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    
    await wishlistService.removeWishlistItem(userId, id);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to remove item from wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// DELETE /api/wishlist/items/product/:productId - Remove by product ID
router.delete("/items/product/:productId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;
    const { wishlistId } = req.query;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    await wishlistService.removeProductFromWishlist(
      userId, 
      productId, 
      wishlistId as string
    );
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to remove product from wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get("/check/:productId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;
    const { wishlistId } = req.query;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const isInWishlist = await wishlistService.isProductInWishlist(
      userId, 
      productId, 
      wishlistId as string
    );
    
    res.json({ isInWishlist });
  } catch (error) {
    let errorMessage = "Failed to check product in wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// POST /api/wishlist - Create a new wishlist
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    // Validate request body
    const validationResult = createWishlistSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid wishlist data", 
        errors: validationResult.error.issues 
      });
    }
    
    const wishlistData = {
      ...validationResult.data,
      userId
    };
    
    const wishlist = await wishlistService.createWishlist(wishlistData);
    
    res.status(201).json({ wishlist });
  } catch (error) {
    let errorMessage = "Failed to create wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/wishlist/all - Get all user wishlists
router.get("/all", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const wishlists = await wishlistService.getUserWishlists(userId);
    
    res.json({ wishlists });
  } catch (error) {
    let errorMessage = "Failed to get wishlists";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// DELETE /api/wishlist/:id - Delete a wishlist
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Wishlist ID is required" });
    }
    
    await wishlistService.deleteWishlist(userId, id);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to delete wishlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;