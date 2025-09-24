import { eq, and } from "drizzle-orm";
import { db, wishlists, wishlistItems, products } from "../db";
import { InferSelectModel } from "drizzle-orm";
import { wishlists as wishlistsTable, wishlistItems as wishlistItemsTable } from "@shared/schema";

type Wishlist = InferSelectModel<typeof wishlistsTable>;
type WishlistItem = InferSelectModel<typeof wishlistItemsTable>;

export interface CreateWishlistData {
  userId: string;
  name?: string;
  isPublic?: boolean;
}

export class WishlistService {
  // Get or create default wishlist for user
  async getOrCreateUserWishlist(userId: string): Promise<Wishlist> {
    try {
      // Try to find existing wishlist
      const existingWishlist = await db.select()
        .from(wishlists)
        .where(eq(wishlists.userId, userId))
        .limit(1);
      
      if (existingWishlist.length > 0) {
        return existingWishlist[0];
      }
      
      // Create new wishlist
      const [newWishlist] = await db.insert(wishlists)
        .values({
          userId,
          name: "My Wishlist",
          isPublic: false
        })
        .returning();
      
      return newWishlist;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get or create wishlist: ${error.message}`);
      }
      throw new Error("Failed to get or create wishlist due to an unexpected error.");
    }
  }

  // Get all wishlists for a user
  async getUserWishlists(userId: string): Promise<Wishlist[]> {
    try {
      const userWishlists = await db.select()
        .from(wishlists)
        .where(eq(wishlists.userId, userId))
        .orderBy(wishlists.createdAt);
      
      return userWishlists;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user wishlists: ${error.message}`);
      }
      throw new Error("Failed to get user wishlists due to an unexpected error.");
    }
  }

  // Get wishlist items with product details
  async getWishlistItems(userId: string, wishlistId?: string): Promise<any[]> {
    try {
      let targetWishlist: Wishlist;
      
      if (wishlistId) {
        // Verify the wishlist belongs to the user
        const wishlist = await db.select()
          .from(wishlists)
          .where(and(
            eq(wishlists.id, wishlistId),
            eq(wishlists.userId, userId)
          ))
          .limit(1);
        
        if (wishlist.length === 0) {
          throw new Error("Wishlist not found or you don't have permission to access it");
        }
        targetWishlist = wishlist[0];
      } else {
        // Get or create default wishlist
        targetWishlist = await this.getOrCreateUserWishlist(userId);
      }

      const items = await db.select({
        wishlistItem: wishlistItems,
        product: products
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.wishlistId, targetWishlist.id))
      .orderBy(wishlistItems.createdAt);
      
      return items.map(item => ({
        ...item.wishlistItem,
        product: item.product
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get wishlist items: ${error.message}`);
      }
      throw new Error("Failed to get wishlist items due to an unexpected error.");
    }
  }

  // Add product to wishlist
  async addProductToWishlist(userId: string, productId: string, wishlistId?: string): Promise<WishlistItem> {
    try {
      let targetWishlist: Wishlist;
      
      if (wishlistId) {
        // Verify the wishlist belongs to the user
        const wishlist = await db.select()
          .from(wishlists)
          .where(and(
            eq(wishlists.id, wishlistId),
            eq(wishlists.userId, userId)
          ))
          .limit(1);
        
        if (wishlist.length === 0) {
          throw new Error("Wishlist not found or you don't have permission to modify it");
        }
        targetWishlist = wishlist[0];
      } else {
        // Get or create default wishlist
        targetWishlist = await this.getOrCreateUserWishlist(userId);
      }

      // Check if product already exists in wishlist
      const existingItem = await db.select()
        .from(wishlistItems)
        .where(and(
          eq(wishlistItems.wishlistId, targetWishlist.id),
          eq(wishlistItems.productId, productId)
        ))
        .limit(1);
      
      if (existingItem.length > 0) {
        throw new Error("Product is already in wishlist");
      }

      // Verify product exists
      const product = await db.select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
      
      if (product.length === 0) {
        throw new Error("Product not found");
      }

      // Add item to wishlist
      const [newItem] = await db.insert(wishlistItems)
        .values({
          wishlistId: targetWishlist.id,
          productId
        })
        .returning();
      
      return newItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add product to wishlist: ${error.message}`);
      }
      throw new Error("Failed to add product to wishlist due to an unexpected error.");
    }
  }

  // Remove item from wishlist by item ID
  async removeWishlistItem(userId: string, itemId: string): Promise<void> {
    try {
      // Verify the item belongs to user's wishlist
      const item = await db.select({
        wishlistItem: wishlistItems,
        wishlist: wishlists
      })
      .from(wishlistItems)
      .leftJoin(wishlists, eq(wishlistItems.wishlistId, wishlists.id))
      .where(and(
        eq(wishlistItems.id, itemId),
        eq(wishlists.userId, userId)
      ))
      .limit(1);
      
      if (item.length === 0) {
        throw new Error("Wishlist item not found or you don't have permission to remove it");
      }

      await db.delete(wishlistItems)
        .where(eq(wishlistItems.id, itemId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove wishlist item: ${error.message}`);
      }
      throw new Error("Failed to remove wishlist item due to an unexpected error.");
    }
  }

  // Remove product from wishlist by product ID
  async removeProductFromWishlist(userId: string, productId: string, wishlistId?: string): Promise<void> {
    try {
      let targetWishlist: Wishlist;
      
      if (wishlistId) {
        // Verify the wishlist belongs to the user
        const wishlist = await db.select()
          .from(wishlists)
          .where(and(
            eq(wishlists.id, wishlistId),
            eq(wishlists.userId, userId)
          ))
          .limit(1);
        
        if (wishlist.length === 0) {
          throw new Error("Wishlist not found or you don't have permission to modify it");
        }
        targetWishlist = wishlist[0];
      } else {
        // Get default wishlist
        targetWishlist = await this.getOrCreateUserWishlist(userId);
      }

      const deletedCount = await db.delete(wishlistItems)
        .where(and(
          eq(wishlistItems.wishlistId, targetWishlist.id),
          eq(wishlistItems.productId, productId)
        ));

      if (deletedCount.rowCount === 0) {
        throw new Error("Product not found in wishlist");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove product from wishlist: ${error.message}`);
      }
      throw new Error("Failed to remove product from wishlist due to an unexpected error.");
    }
  }

  // Check if product is in user's wishlist
  async isProductInWishlist(userId: string, productId: string, wishlistId?: string): Promise<boolean> {
    try {
      let targetWishlist: Wishlist;
      
      if (wishlistId) {
        // Verify the wishlist belongs to the user
        const wishlist = await db.select()
          .from(wishlists)
          .where(and(
            eq(wishlists.id, wishlistId),
            eq(wishlists.userId, userId)
          ))
          .limit(1);
        
        if (wishlist.length === 0) {
          return false; // If wishlist doesn't exist or doesn't belong to user, product is not in it
        }
        targetWishlist = wishlist[0];
      } else {
        // Try to get default wishlist (don't create if it doesn't exist)
        const existingWishlist = await db.select()
          .from(wishlists)
          .where(eq(wishlists.userId, userId))
          .limit(1);
        
        if (existingWishlist.length === 0) {
          return false; // No wishlist exists, so product is not in it
        }
        targetWishlist = existingWishlist[0];
      }

      const existingItem = await db.select()
        .from(wishlistItems)
        .where(and(
          eq(wishlistItems.wishlistId, targetWishlist.id),
          eq(wishlistItems.productId, productId)
        ))
        .limit(1);
      
      return existingItem.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check product in wishlist: ${error.message}`);
      }
      throw new Error("Failed to check product in wishlist due to an unexpected error.");
    }
  }

  // Create a new wishlist
  async createWishlist(wishlistData: CreateWishlistData): Promise<Wishlist> {
    try {
      const [wishlist] = await db.insert(wishlists)
        .values(wishlistData)
        .returning();
      
      return wishlist;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create wishlist: ${error.message}`);
      }
      throw new Error("Failed to create wishlist due to an unexpected error.");
    }
  }

  // Delete a wishlist
  async deleteWishlist(userId: string, wishlistId: string): Promise<void> {
    try {
      // Verify the wishlist belongs to the user
      const existingWishlist = await db.select()
        .from(wishlists)
        .where(and(
          eq(wishlists.id, wishlistId),
          eq(wishlists.userId, userId)
        ))
        .limit(1);
      
      if (existingWishlist.length === 0) {
        throw new Error("Wishlist not found or you don't have permission to delete it");
      }

      // Delete all items in the wishlist first
      await db.delete(wishlistItems)
        .where(eq(wishlistItems.wishlistId, wishlistId));

      // Delete the wishlist
      await db.delete(wishlists)
        .where(and(
          eq(wishlists.id, wishlistId),
          eq(wishlists.userId, userId)
        ));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete wishlist: ${error.message}`);
      }
      throw new Error("Failed to delete wishlist due to an unexpected error.");
    }
  }
}