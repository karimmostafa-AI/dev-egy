import { eq, and, isNull } from "drizzle-orm";
import { db, carts, cartItems, products, coupons, productVariants } from "../db";
import { InferSelectModel } from "drizzle-orm";
import { carts as cartsTable, cartItems as cartItemsTable } from "@shared/schema-sqlite";

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

  // Get cart items with product details and variants
  async getCartItems(cartId: string): Promise<any[]> {
    try {
      const items = await db.select({
        cartItem: cartItems,
        product: products,
        variant: productVariants
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cartId));
      
      return items.map(item => ({
        ...item.cartItem,
        product: item.product,
        variant: item.variant
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
  async addItemToCart(cartId: string, productId: string, quantity: number = 1, variantId?: string): Promise<CartItem> {
    try {
      // Check if item already exists in cart (same product and variant)
      const conditions = [
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId)
      ];
      
      if (variantId) {
        conditions.push(eq(cartItems.variantId, variantId));
      } else {
        // Use isNull for null comparisons instead of eq with null
        conditions.push(isNull(cartItems.variantId));
      }
      
      const existingItem = await db.select()
        .from(cartItems)
        .where(and(...conditions))
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
            variantId,
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
        cartTotal += item.product.price * item.cartItem.quantity;
      }
      
      // Check minimum amount requirement
      if (coupon.minimumAmount && cartTotal < coupon.minimumAmount) {
        throw new Error(`Cart total must be at least $${coupon.minimumAmount} to use this coupon`);
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
      
      // Update cart with applied coupon
      const [updatedCart] = await db.update(carts)
        .set({ 
          appliedCouponId: coupon.id,
          discountAmount: discount,
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
          discountAmount: 0,
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

  // Calculate checkout totals for cart
  async calculateCheckoutTotals(cartId: string, shippingAddress?: any): Promise<any> {
    try {
      // Get cart items with products and variants
      const cartItemsList = await db.select({
        cartItem: cartItems,
        product: products,
        variant: productVariants
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cartId));

      // Get cart with coupon
      const cartWithCoupon = await this.getCartWithCoupon(cartId);
      
      if (cartItemsList.length === 0) {
        return {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          tax: 0,
          total: 0,
          items: []
        };
      }

      // Calculate subtotal
      let subtotal = 0;
      const items = [];
      
      for (const item of cartItemsList) {
        // Use variant price if available, otherwise use product price
        const price = item.variant && item.variant.price 
          ? item.variant.price 
          : item.product.price;
        const lineTotal = price * item.cartItem.quantity;
        subtotal += lineTotal;
        
        items.push({
          productId: item.product.id,
          variantId: item.variant?.id,
          name: item.product.name,
          sku: item.variant?.sku || item.product.sku,
          price: price,
          quantity: item.cartItem.quantity,
          lineTotal: lineTotal
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (cartWithCoupon.coupon) {
        discountAmount = parseFloat(cartWithCoupon.cart.discountAmount || '0');
      }

      // Calculate shipping (free over $50, otherwise $7.99)
      const shippingCost = subtotal > 50 ? 0 : 7.99;

      // Calculate tax (8.75% - could be made dynamic based on shipping address)
      const taxableAmount = subtotal - discountAmount;
      const tax = taxableAmount * 0.0875;

      // Calculate total
      const total = subtotal - discountAmount + shippingCost + tax;

      return {
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        items,
        appliedCoupon: cartWithCoupon.coupon
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to calculate checkout totals: ${error.message}`);
      }
      throw new Error("Failed to calculate checkout totals due to an unexpected error.");
    }
  }

  // Reserve inventory for checkout with variant support
  async reserveInventory(cartId: string): Promise<boolean> {
    try {
      const cartItemsList = await db.select({
        cartItem: cartItems,
        product: products,
        variant: productVariants
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cartId));

      // Check if all items have sufficient inventory
      for (const item of cartItemsList) {
        let availableQuantity: number;
        let allowOutOfStock: boolean;
        let itemName: string;
        
        if (item.variant) {
          // Use variant inventory if variant exists
          availableQuantity = item.variant.inventoryQuantity || 0;
          allowOutOfStock = item.variant.allowOutOfStockPurchases || false;
          itemName = `${item.product.name} (${item.variant.sku})`;
        } else {
          // Use product inventory if no variant
          availableQuantity = item.product.inventoryQuantity || 0;
          allowOutOfStock = item.product.allowOutOfStockPurchases || false;
          itemName = item.product.name;
        }
        
        if (!allowOutOfStock && availableQuantity < item.cartItem.quantity) {
          throw new Error(`Insufficient inventory for ${itemName}. Available: ${availableQuantity}, Requested: ${item.cartItem.quantity}`);
        }
      }

      // Inventory check passed
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to reserve inventory: ${error.message}`);
      }
      throw new Error("Failed to reserve inventory due to an unexpected error.");
    }
  }

  // Update inventory after successful order (decrease quantities) with variant support
  async updateInventoryAfterOrder(cartId: string): Promise<void> {
    try {
      const cartItemsList = await db.select({
        cartItem: cartItems,
        product: products,
        variant: productVariants
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cartId));

      // Update inventory quantities
      for (const item of cartItemsList) {
        if (item.variant) {
          // Update variant inventory
          const newQuantity = (item.variant.inventoryQuantity || 0) - item.cartItem.quantity;
          await db.update(productVariants)
            .set({ 
              inventoryQuantity: Math.max(0, newQuantity),
              updatedAt: new Date()
            })
            .where(eq(productVariants.id, item.variant.id));
        } else {
          // Update product inventory
          const newQuantity = (item.product.inventoryQuantity || 0) - item.cartItem.quantity;
          await db.update(products)
            .set({ 
              inventoryQuantity: Math.max(0, newQuantity),
              updatedAt: new Date()
            })
            .where(eq(products.id, item.product.id));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update inventory: ${error.message}`);
      }
      throw new Error("Failed to update inventory due to an unexpected error.");
    }
  }
}