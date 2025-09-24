import { eq, and } from "drizzle-orm";
import { db, carts, cartItems, products, coupons } from "../db";
import { InferSelectModel } from "drizzle-orm";
import { carts as cartsTable, cartItems as cartItemsTable } from "@shared/schema";

type Cart = InferSelectModel<typeof cartsTable>;
type CartItem = InferSelectModel<typeof cartItemsTable>;

export class CartService {
  // Get or create cart for user or session
  async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
    try {
      // Try to find existing cart
      let cartConditions = [];
      if (userId) {
        cartConditions.push(eq(carts.userId, userId));
      } else if (sessionId) {
        cartConditions.push(eq(carts.sessionId, sessionId));
      } else {
        throw new Error("Either userId or sessionId is required");
      }
      
      const existingCart = await db.select().from(carts).where(and(...cartConditions)).limit(1);
      
      if (existingCart.length > 0) {
        return existingCart[0];
      }
      
      // Create new cart
      const [newCart] = await db.insert(carts).values({ userId, sessionId }).returning();
      return newCart;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get or create cart: ${error.message}`);
      }
      throw new Error("Failed to get or create cart due to an unexpected error.");
    }
  }

  // Get cart items with product details
  async getCartItems(cartId: string): Promise<any[]> {
    try {
      const items = await db.select({
        cartItem: cartItems,
        product: products
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));
      
      return items.map(item => ({
        ...item.cartItem,
        product: item.product
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get cart items: ${error.message}`);
      } else {
        throw new Error(`Failed to get cart items: ${String(error)}`);
      }
    }
  }

  // Add item to cart
  async addItemToCart(cartId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const existingItem = await db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, productId)
        ))
        .limit(1);
      
      if (existingItem.length > 0) {
        // Update quantity
        const [updatedItem] = await db.update(cartItems)
          .set({ 
            quantity: existingItem[0].quantity + quantity,
            updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000)
          })
          .where(eq(cartItems.id, existingItem[0].id))
          .returning();
        return updatedItem;
      } else {
        // Add new item
        const [newItem] = await db.insert(cartItems)
          .values({ 
            cartId, 
            productId, 
            quantity 
          })
          .returning();
        return newItem;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add item to cart: ${error.message}`);
      } else {
        throw new Error(`Failed to add item to cart: ${String(error)}`);
      }
    }
  }

  // Update cart item quantity
  async updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    try {
      const [updatedItem] = await db.update(cartItems)
        .set({ 
          quantity,
          updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000)
        })
        .where(eq(cartItems.id, itemId))
        .returning();
      return updatedItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update cart item quantity: ${error.message}`);
      }
      throw new Error("Failed to update cart item quantity due to an unexpected error.");
    }
  }

  // Remove item from cart
  async removeItemFromCart(itemId: string): Promise<void> {
    try {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove item from cart: ${error.message}`);
      }
      throw new Error("Failed to remove item from cart due to an unexpected error.");
    }
  }

  // Clear cart
  async clearCart(cartId: string): Promise<void> {
    try {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to clear cart: ${error.message}`);
      }
      throw new Error("Failed to clear cart due to an unexpected error.");
    }
  }

  // Apply coupon to cart
  async applyCouponToCart(cartId: string, couponCode: string): Promise<any> {
    try {
      // Find the coupon
      const couponResult = await db.select().from(coupons)
        .where(and(
          eq(coupons.code, couponCode),
          eq(coupons.isActive, true)
        )).limit(1);
      
      if (couponResult.length === 0) {
        throw new Error("Coupon not found or inactive");
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
        cartTotal += parseFloat(item.product.price as string) * item.cartItem.quantity;
      }
      
      // Check minimum amount requirement
      if (coupon.minimumAmount && cartTotal < parseFloat(coupon.minimumAmount as string)) {
        throw new Error(`Cart total must be at least $${coupon.minimumAmount} to use this coupon`);
      }
      
      // Calculate discount
      let discount = 0;
      if (coupon.type === "percentage") {
        discount = cartTotal * (parseFloat(coupon.value as string) / 100);
      } else if (coupon.type === "fixed_amount") {
        discount = parseFloat(coupon.value as string);
      }
      
      // Ensure discount doesn't exceed cart total
      discount = Math.min(discount, cartTotal);
      
      // Update cart with applied coupon
      const [updatedCart] = await db.update(carts)
        .set({ 
          appliedCouponId: coupon.id,
          discountAmount: discount.toString(),
          updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000)
        })
        .where(eq(carts.id, cartId))
        .returning();
      
      return {
        cart: updatedCart,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount: discount.toString()
        },
        cartTotal: cartTotal.toString(),
        discountAmount: discount.toString(),
        newTotal: (cartTotal - discount).toString()
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to apply coupon: ${error.message}`);
      }
      throw new Error("Failed to apply coupon due to an unexpected error.");
    }
  }

  // Remove coupon from cart
  async removeCouponFromCart(cartId: string): Promise<Cart> {
    try {
      const [updatedCart] = await db.update(carts)
        .set({ 
          appliedCouponId: null,
          discountAmount: "0",
          updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000)
        })
        .where(eq(carts.id, cartId))
        .returning();
      
      return updatedCart;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove coupon from cart: ${error.message}`);
      }
      throw new Error("Failed to remove coupon from cart due to an unexpected error.");
    }
  }

  // Get cart with coupon details
  async getCartWithCoupon(cartId: string): Promise<any> {
    try {
      const cartResult = await db.select({
        cart: carts,
        coupon: coupons
      })
      .from(carts)
      .leftJoin(coupons, eq(carts.appliedCouponId, coupons.id))
      .where(eq(carts.id, cartId))
      .limit(1);
      
      if (cartResult.length === 0) {
        throw new Error("Cart not found");
      }
      
      return cartResult[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get cart with coupon: ${error.message}`);
      }
      throw new Error("Failed to get cart with coupon due to an unexpected error.");
    }
  }
}