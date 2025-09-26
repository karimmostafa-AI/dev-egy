import { eq, and } from "drizzle-orm";
import { db, users, addresses, orders, orderItems, wishlists, wishlistItems, products } from "../db";
import { InsertUser, User } from "@shared/schema-sqlite";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class UserService {
  // Create a new user
  async createUser(userData: InsertUser): Promise<User> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
      
      // Create user with hashed password
      const [user] = await db.insert(users).values({
        ...userData,
        passwordHash: hashedPassword
      }).returning();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error(`Failed to create user: ${String(error)}`);
      }
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | undefined> {
    try {
      const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user by ID: ${error.message}`);
      }
      throw new Error("Failed to get user by ID due to an unexpected error.");
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return user[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user by email: ${error.message}`);
      }
      throw new Error("Failed to get user by email due to an unexpected error.");
    }
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const [user] = await db.update(users).set({
        ...userData,
        updatedAt: new Date()
      }).where(eq(users.id, id)).returning();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
      throw new Error("Failed to update user due to an unexpected error.");
    }
  }

  // Update user password
  async updateUserPassword(id: string, newPassword: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      const [user] = await db.update(users).set({
        passwordHash: hashedPassword,
        updatedAt: new Date()
      }).where(eq(users.id, id)).returning();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update user password: ${error.message}`);
      }
      throw new Error("Failed to update user password due to an unexpected error.");
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await db.delete(users).where(eq(users.id, id));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
      throw new Error("Failed to delete user due to an unexpected error.");
    }
  }

  // Get user addresses
  async getUserAddresses(userId: string) {
    try {
      const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, userId));
      return userAddresses;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user addresses: ${error.message}`);
      }
      throw new Error("Failed to get user addresses due to an unexpected error.");
    }
  }

  // Create address
  async createAddress(addressData: any) {
    try {
      const [address] = await db.insert(addresses).values(addressData).returning();
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create address: ${error.message}`);
      }
      throw new Error("Failed to create address due to an unexpected error.");
    }
  }

  // Get address by ID
  async getAddressById(id: string) {
    try {
      const address = await db.select().from(addresses).where(eq(addresses.id, id)).limit(1);
      return address[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get address by ID: ${error.message}`);
      }
      throw new Error("Failed to get address by ID due to an unexpected error.");
    }
  }

  // Update address
  async updateAddress(id: string, addressData: any) {
    try {
      const [address] = await db.update(addresses).set({
        ...addressData,
        updatedAt: new Date()
      }).where(eq(addresses.id, id)).returning();
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update address: ${error.message}`);
      }
      throw new Error("Failed to update address due to an unexpected error.");
    }
  }

  // Delete address
  async deleteAddress(id: string) {
    try {
      await db.delete(addresses).where(eq(addresses.id, id));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete address: ${error.message}`);
      }
      throw new Error("Failed to delete address due to an unexpected error.");
    }
  }

  // Get user orders
  async getUserOrders(userId: string) {
    try {
      const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
      return userOrders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user orders: ${error.message}`);
      }
      throw new Error("Failed to get user orders due to an unexpected error.");
    }
  }

  // Get user wishlist
  async getUserWishlist(userId: string) {
    try {
      // Get or create wishlist for user
      let wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1);
      
      if (wishlist.length === 0) {
        // Create a new wishlist
        const [newWishlist] = await db.insert(wishlists).values({
          userId,
          name: "My Wishlist"
        }).returning();
        wishlist = [newWishlist];
      }
      
      // Get wishlist items
      const items = await db.select({
        wishlistItem: wishlistItems,
        product: products
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.wishlistId, wishlist[0].id));
      
      return {
        wishlist: wishlist[0],
        items: items.map(item => ({
          ...item.wishlistItem,
          product: item.product
        }))
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user wishlist: ${error.message}`);
      }
      throw new Error("Failed to get user wishlist due to an unexpected error.");
    }
  }

  // Add item to wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      // Get or create wishlist for user
      let wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1);
      
      if (wishlist.length === 0) {
        // Create a new wishlist
        const [newWishlist] = await db.insert(wishlists).values({
          userId,
          name: "My Wishlist"
        }).returning();
        wishlist = [newWishlist];
      }
      
      // Check if item is already in wishlist
      const existingItem = await db.select().from(wishlistItems)
        .where(and(
          eq(wishlistItems.wishlistId, wishlist[0].id),
          eq(wishlistItems.productId, productId)
        )).limit(1);
      
      if (existingItem.length > 0) {
        return existingItem[0];
      }
      
      // Add item to wishlist
      const [wishlistItem] = await db.insert(wishlistItems).values({
        wishlistId: wishlist[0].id,
        productId
      }).returning();
      
      return wishlistItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add item to wishlist: ${error.message}`);
      }
      throw new Error("Failed to add item to wishlist due to an unexpected error.");
    }
  }

  // Get wishlist item by ID
  async getWishlistItemById(id: string) {
    try {
      const item = await db.select({
        wishlistItem: wishlistItems,
        wishlist: wishlists
      })
      .from(wishlistItems)
      .innerJoin(wishlists, eq(wishlistItems.wishlistId, wishlists.id))
      .where(eq(wishlistItems.id, id))
      .limit(1);
      
      if (item.length === 0) {
        return null;
      }
      
      return {
        ...item[0].wishlistItem,
        userId: item[0].wishlist.userId
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get wishlist item by ID: ${error.message}`);
      }
      throw new Error("Failed to get wishlist item by ID due to an unexpected error.");
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(id: string) {
    try {
      await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove item from wishlist: ${error.message}`);
      }
      throw new Error("Failed to remove item from wishlist due to an unexpected error.");
    }
  }
}