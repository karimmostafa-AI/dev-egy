import { Router } from "express";
import { ProductService } from "../services/productService";
import { ProductOptionsService } from "../services/productOptionsService";
import { AuthService } from "../services/authService";
import { 
  insertProductOptionSchema,
  updateProductOptionSchema,
  insertProductVariantSchema,
  updateProductVariantSchema
} from "@shared/schema-sqlite";

const router = Router();
const productService = new ProductService();
const productOptionsService = new ProductOptionsService();
const authService = new AuthService();

// Helper function to verify admin authentication
const verifyAdminAuth = (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token required");
  }
  
  const token = authHeader.substring(7);
  const decoded = authService.verifyToken(token);
  
  if (!decoded) {
    throw new Error("Invalid or expired token");
  }
  
  // For now, we'll skip role checking since the token doesn't contain role info
  // In a production system, you would fetch user details from the database
  // to verify admin privileges
  
  return decoded;
};

// Get all products with filtering, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy,
      page,
      limit
    } = req.query;
    
    const filterOptions = {
      category: category as string,
      brand: brand as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      search: search as string,
      sortBy: sortBy as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    };
    
    const result = await productService.getProducts(filterOptions);
    res.json(result);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Search products
router.get("/search", async (req, res) => {
  try {
    const {
      q: searchQuery,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit
    } = req.query;
    
    // Validate search query
    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const filterOptions = {
      search: searchQuery,
      category: category as string,
      brand: brand as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    };
    
    const result = await productService.getProducts(filterOptions);
    res.json(result);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ product });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get product by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ message: "Product slug is required" });
    }
    
    const product = await productService.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ product });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get product reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    const reviews = await productService.getProductReviews(id, pageNum, limitNum);
    res.json(reviews);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Add product review (protected route)
router.post("/:id/reviews", async (req, res) => {
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
    const reviewData = {
      ...req.body,
      userId: decoded.userId,
      productId: id
    };
    
    // Validate required fields
    if (!reviewData.rating || !reviewData.title || !reviewData.comment) {
      return res.status(400).json({ message: "Rating, title, and comment are required" });
    }
    
    const review = await productService.addProductReview(reviewData);
    res.status(201).json({ review });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// ===== PRODUCT OPTIONS ENDPOINTS =====

// Get all options for a product
router.get("/:id/options", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const options = await productOptionsService.getProductOptions(id);
    res.json({ options });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Create option for product (admin only)
router.post("/:id/options", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    // Validate request body
    const validationResult = insertProductOptionSchema.safeParse({
      productId: id,
      ...req.body
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationResult.error.issues 
      });
    }
    
    const option = await productOptionsService.createProductOption(id, req.body);
    res.status(201).json({ option });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const statusCode = errorMessage.includes("Admin access required") || errorMessage.includes("Authorization") ? 401 : 500;
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Update option (admin only)
router.put("/:id/options/:optionId", async (req, res) => {
  try {
    const { id, optionId } = req.params;
    
    if (!id || !optionId) {
      return res.status(400).json({ message: "Product ID and Option ID are required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    // Validate request body
    const validationResult = updateProductOptionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationResult.error.issues 
      });
    }
    
    const option = await productOptionsService.updateProductOption(id, optionId, validationResult.data);
    res.json({ option });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Delete option (admin only)
router.delete("/:id/options/:optionId", async (req, res) => {
  try {
    const { id, optionId } = req.params;
    
    if (!id || !optionId) {
      return res.status(400).json({ message: "Product ID and Option ID are required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    await productOptionsService.deleteProductOption(id, optionId);
    res.status(204).send();
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// ===== PRODUCT IMAGES ENDPOINTS =====

// Get all images for a product
router.get("/:id/images", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const images = await productService.getProductImages(id);
    res.json({ images });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// ===== PRODUCT COLOR MANAGEMENT ENDPOINTS =====

// Update product colors with images (admin only)
router.put("/:id/colors", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    // Validate request body
    const colorsData = req.body.colors; // Array of { name, hex, imageUrl }
    
    if (!Array.isArray(colorsData)) {
      return res.status(400).json({ message: "Colors array is required" });
    }
    
    // Validate each color
    for (const color of colorsData) {
      if (!color.name || !color.hex || !color.imageUrl) {
        return res.status(400).json({ 
          message: "Each color must have name, hex, and imageUrl" 
        });
      }
      
      // Validate URL format
      try {
        const url = new URL(color.imageUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return res.status(400).json({ 
            message: "Image URLs must use http or https protocol" 
          });
        }
      } catch (e) {
        return res.status(400).json({ 
          message: `Invalid image URL: ${color.imageUrl}` 
        });
      }
    }
    
    const result = await productOptionsService.updateProductColors(id, colorsData);
    res.json({ success: true, colors: result });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// ===== PRODUCT VARIANTS ENDPOINTS =====

// Get all variants for a product
router.get("/:id/variants", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const variants = await productOptionsService.getProductVariants(id);
    res.json({ variants });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Create variant (admin only)
router.post("/:id/variants", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    // Validate request body
    const validationResult = insertProductVariantSchema.safeParse({
      productId: id,
      ...req.body
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationResult.error.issues 
      });
    }
    
    // Validate optionValueIds are provided
    if (!req.body.optionValueIds || !Array.isArray(req.body.optionValueIds)) {
      return res.status(400).json({ message: "optionValueIds array is required" });
    }
    
    const variant = await productOptionsService.createProductVariant(id, req.body);
    res.status(201).json({ variant });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const statusCode = errorMessage.includes("Admin access required") || errorMessage.includes("Authorization") ? 401 : 500;
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Update variant (admin only)
router.put("/:id/variants/:variantId", async (req, res) => {
  try {
    const { id, variantId } = req.params;
    
    if (!id || !variantId) {
      return res.status(400).json({ message: "Product ID and Variant ID are required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    // Validate request body
    const validationResult = updateProductVariantSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationResult.error.issues 
      });
    }
    
    const variant = await productOptionsService.updateProductVariant(id, variantId, validationResult.data);
    res.json({ variant });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Delete variant (admin only)
router.delete("/:id/variants/:variantId", async (req, res) => {
  try {
    const { id, variantId } = req.params;
    
    if (!id || !variantId) {
      return res.status(400).json({ message: "Product ID and Variant ID are required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    await productOptionsService.deleteProductVariant(id, variantId);
    res.status(204).send();
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// ===== STOCK MANAGEMENT ENDPOINTS =====

// Update variant stock (admin only)
router.patch("/:id/variants/:variantId/stock", async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const { quantity } = req.body;
    
    if (!id || !variantId) {
      return res.status(400).json({ message: "Product ID and Variant ID are required" });
    }
    
    if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: "Valid quantity (>= 0) is required" });
    }
    
    // Verify admin authentication
    verifyAdminAuth(req);
    
    const variant = await productOptionsService.updateVariantStock(variantId, quantity);
    res.json({ variant });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    let statusCode = 500;
    if (errorMessage.includes("Admin access required") || errorMessage.includes("Authorization")) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Check variant availability
router.get("/:id/variants/:variantId/availability", async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const { quantity = "1" } = req.query;
    
    if (!id || !variantId) {
      return res.status(400).json({ message: "Product ID and Variant ID are required" });
    }
    
    const requestedQuantity = parseInt(quantity as string, 10);
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      return res.status(400).json({ message: "Valid quantity (> 0) is required" });
    }
    
    const availability = await productOptionsService.checkVariantAvailability(variantId, requestedQuantity);
    res.json(availability);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const statusCode = errorMessage.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ message: errorMessage });
  }
});

// Get product aggregate stock
router.get("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const stockInfo = await productOptionsService.getProductAggregateStock(id);
    res.json(stockInfo);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;