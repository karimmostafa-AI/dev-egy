import { eq, and } from "drizzle-orm";
import { db, carts, cartItems, products } from "../db";
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
      throw new Error(`Failed to update cart item quantity: ${error.message}`);
    }
  }

  // Remove item from cart
  async removeItemFromCart(itemId: string): Promise<void> {
    try {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
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
}