import { Router } from "express";
import { SearchService } from "../services/searchService";

const router = Router();
const searchService = new SearchService();

// Search products, categories, brands, etc.
router.get("/", async (req, res) => {
  try {
    const { q, type, page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const results = await searchService.search({
      query: q as string,
      type: type as string,
      page: pageNum,
      limit: limitNum
    });
    
    res.json(results);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;