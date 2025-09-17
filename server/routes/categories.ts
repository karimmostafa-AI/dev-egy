import { Router } from "express";
import { CategoryService } from "../services/categoryService";

const router = Router();
const categoryService = new CategoryService();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ categories });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ category });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get category by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ message: "Category slug is required" });
    }
    
    const category = await categoryService.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ category });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;