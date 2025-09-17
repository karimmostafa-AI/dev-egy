import { Router } from "express";
import { BrandService } from "../services/brandService";

const router = Router();
const brandService = new BrandService();

// Get all brands
router.get("/", async (req, res) => {
  try {
    const brands = await brandService.getBrands();
    res.json({ brands });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get brand by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Brand ID is required" });
    }
    
    const brand = await brandService.getBrandById(id);
    
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    res.json({ brand });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get brand by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ message: "Brand slug is required" });
    }
    
    const brand = await brandService.getBrandBySlug(slug);
    
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    res.json({ brand });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;