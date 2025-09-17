import { Router } from "express";
import { CouponService } from "../services/couponService";

const router = Router();
const couponService = new CouponService();

// Apply coupon to cart
router.post("/apply", async (req, res) => {
  try {
    const { code, cartId } = req.body;
    
    if (!code || !cartId) {
      return res.status(400).json({ message: "Coupon code and cart ID are required" });
    }
    
    const result = await couponService.applyCoupon(code, cartId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      if (error.message.includes("expired")) {
        return res.status(400).json({ message: "Coupon has expired" });
      }
      if (error.message.includes("minimum")) {
        return res.status(400).json({ message: "Cart total does not meet minimum amount requirement" });
      }
    }
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

export default router;