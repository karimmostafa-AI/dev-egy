import { Router } from "express";
import { BlogService } from "../services/blogService";

const router = Router();
const blogService = new BlogService();

// Get all blog categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await blogService.getAllCategories();
    res.json({ categories });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get blog category by ID
router.get("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await blogService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: "Blog category not found" });
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

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    const posts = await blogService.getAllPosts(pageNum, limitNum);
    res.json(posts);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await blogService.getPostById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    res.json({ post });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;