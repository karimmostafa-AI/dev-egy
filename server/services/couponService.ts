import { db, coupons, carts, cartItems, products } from "../db";
import { eq, and, gte, lte, isNull } from "drizzle-orm";

export class CouponService {
  // Apply coupon to cart
  async applyCoupon(code: string, cartId: string) {
    try {
      // Find the coupon
      const couponResult = await db.select().from(coupons)
        .where(and(
          eq(coupons.code, code),
          eq(coupons.isActive, true)
        )).limit(1);
      
      if (couponResult.length === 0) {
        throw new Error("Coupon not found");
      }
      
      const coupon = couponResult[0];
      
      // Check if coupon is expired
      const now = new Date();
      if (coupon.endDate && new Date(coupon.endDate) < now) {
        throw new Error("Coupon has expired");
      }
      
      // Check if coupon is not yet active
      if (new Date(coupon.startDate) > now) {
        throw new Error("Coupon is not yet active");
      }
      
      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit exceeded");
      }
      
      // Get cart total
      const cartItemsList = await db.select({
        cartItem: cartItems,
        product: products
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));
      
      let cartTotal = 0;
      for (const item of cartItemsList) {
        cartTotal += item.product.price * item.cartItem.quantity;
      }
      
      // Check minimum amount requirement
      if (coupon.minimumAmount && cartTotal < coupon.minimumAmount) {
        throw new Error("Cart total does not meet minimum amount requirement");
      }
      
      // Calculate discount
      let discount = 0;
      if (coupon.type === "percentage") {
        discount = cartTotal * (coupon.value / 100);
      } else if (coupon.type === "fixed_amount") {
        discount = coupon.value;
      }
      
      // Ensure discount doesn't exceed cart total
      discount = Math.min(discount, cartTotal);
      
      // Update coupon usage count
      await db.update(coupons)
        .set({ usedCount: (coupon.usedCount || 0) + 1 })
        .where(eq(coupons.id, coupon.id));
      
      return {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount: discount.toString()
        },
        newTotal: (cartTotal - discount).toString()
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to apply coupon: ${error.message}`);
      }
      throw new Error("Failed to apply coupon due to an unexpected error.");
    }
  }
}