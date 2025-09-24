import { Router, Request, Response } from "express";
import { AddressService } from "../services/addressService";
import { AuthService } from "../services/authService";
import { createInsertSchema } from "drizzle-zod";
import { addresses } from "@shared/schema";
import { z } from "zod";

const router = Router();
const addressService = new AddressService();
const authService = new AuthService();

// Create Zod schemas for validation
const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  userId: true, // Will be set from auth token
  createdAt: true,
  updatedAt: true
});

const updateAddressSchema = insertAddressSchema.partial();

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

// GET /api/addresses - List user addresses
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addresses = await addressService.getUserAddresses(userId);
    
    res.json({ addresses });
  } catch (error) {
    let errorMessage = "Failed to get addresses";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// POST /api/addresses - Create new address
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    // Validate request body
    const validationResult = insertAddressSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid address data", 
        errors: validationResult.error.issues 
      });
    }
    
    const addressData = {
      ...validationResult.data,
      userId
    };
    
    const address = await addressService.createAddress(addressData);
    
    res.status(201).json({ address });
  } catch (error) {
    let errorMessage = "Failed to create address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/addresses/:id - Get specific address
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    
    const address = await addressService.getAddressById(id, userId);
    
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.json({ address });
  } catch (error) {
    let errorMessage = "Failed to get address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// PUT /api/addresses/:id - Update address
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    
    // Validate request body
    const validationResult = updateAddressSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid address data", 
        errors: validationResult.error.issues 
      });
    }
    
    const address = await addressService.updateAddress(id, userId, validationResult.data);
    
    res.json({ address });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to update address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// PATCH /api/addresses/:id - Partial update address (same as PUT)
router.patch("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    
    // Validate request body
    const validationResult = updateAddressSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid address data", 
        errors: validationResult.error.issues 
      });
    }
    
    const address = await addressService.updateAddress(id, userId, validationResult.data);
    
    res.json({ address });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to update address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// DELETE /api/addresses/:id - Delete address
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    
    await addressService.deleteAddress(id, userId);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to delete address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// POST /api/addresses/:id/set-default - Set address as default
router.post("/:id/set-default", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    
    const address = await addressService.setDefaultAddress(id, userId);
    
    res.json({ address });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    let errorMessage = "Failed to set default address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/addresses/default - Get default address
router.get("/default", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const address = await addressService.getDefaultAddress(userId);
    
    if (!address) {
      return res.status(404).json({ message: "No default address found" });
    }
    
    res.json({ address });
  } catch (error) {
    let errorMessage = "Failed to get default address";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;