import { Router } from "express";
import { CollectionService } from "../services/collectionService";

const router = Router();
const collectionService = new CollectionService();

// Get all collections
router.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    const collections = await collectionService.getAllCollections(pageNum, limitNum);
    res.json(collections);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get collection by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await collectionService.getCollectionById(id);
    
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    res.json({ collection });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get products in a collection
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    const products = await collectionService.getCollectionProducts(id, pageNum, limitNum);
    res.json(products);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;