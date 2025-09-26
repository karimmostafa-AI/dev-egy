import { eq, and } from "drizzle-orm";
import { db, addresses } from "../db";
import { InferSelectModel } from "drizzle-orm";
import { addresses as addressesTable } from "@shared/schema-sqlite";

type Address = InferSelectModel<typeof addressesTable>;

export interface CreateAddressData {
  userId: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string | null;
  isDefault?: boolean | null;
}

export interface UpdateAddressData {
  firstName?: string;
  lastName?: string;
  company?: string | null;
  address1?: string;
  address2?: string | null;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string | null;
  isDefault?: boolean | null;
}

export class AddressService {
  // Get all addresses for a user
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const userAddresses = await db.select()
        .from(addresses)
        .where(eq(addresses.userId, userId))
        .orderBy(addresses.isDefault, addresses.createdAt);
      
      return userAddresses;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user addresses: ${error.message}`);
      }
      throw new Error("Failed to get user addresses due to an unexpected error.");
    }
  }

  // Get address by ID (with user ownership check)
  async getAddressById(id: string, userId: string): Promise<Address | undefined> {
    try {
      const address = await db.select()
        .from(addresses)
        .where(and(
          eq(addresses.id, id),
          eq(addresses.userId, userId)
        ))
        .limit(1);
      
      return address[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get address by ID: ${error.message}`);
      }
      throw new Error("Failed to get address by ID due to an unexpected error.");
    }
  }

  // Create a new address
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      // If this is being set as default, unset other default addresses for this user
      if (addressData.isDefault) {
        await db.update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(and(
            eq(addresses.userId, addressData.userId),
            eq(addresses.isDefault, true)
          ));
      }
      
      const [address] = await db.insert(addresses)
        .values(addressData)
        .returning();
      
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create address: ${error.message}`);
      }
      throw new Error("Failed to create address due to an unexpected error.");
    }
  }

  // Update an existing address
  async updateAddress(id: string, userId: string, addressData: UpdateAddressData): Promise<Address> {
    try {
      // Verify the address belongs to the user
      const existingAddress = await this.getAddressById(id, userId);
      if (!existingAddress) {
        throw new Error("Address not found or you don't have permission to update it");
      }

      // If this is being set as default, unset other default addresses for this user
      if (addressData.isDefault) {
        await db.update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(and(
            eq(addresses.userId, userId),
            eq(addresses.isDefault, true)
          ));
      }

      const [updatedAddress] = await db.update(addresses)
        .set({
          ...addressData,
          updatedAt: new Date()
        })
        .where(and(
          eq(addresses.id, id),
          eq(addresses.userId, userId)
        ))
        .returning();
      
      return updatedAddress;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update address: ${error.message}`);
      }
      throw new Error("Failed to update address due to an unexpected error.");
    }
  }

  // Delete an address
  async deleteAddress(id: string, userId: string): Promise<void> {
    try {
      // Verify the address belongs to the user
      const existingAddress = await this.getAddressById(id, userId);
      if (!existingAddress) {
        throw new Error("Address not found or you don't have permission to delete it");
      }

      await db.delete(addresses)
        .where(and(
          eq(addresses.id, id),
          eq(addresses.userId, userId)
        ));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete address: ${error.message}`);
      }
      throw new Error("Failed to delete address due to an unexpected error.");
    }
  }

  // Set an address as default
  async setDefaultAddress(id: string, userId: string): Promise<Address> {
    try {
      // Verify the address belongs to the user
      const existingAddress = await this.getAddressById(id, userId);
      if (!existingAddress) {
        throw new Error("Address not found or you don't have permission to modify it");
      }

      // Unset other default addresses for this user
      await db.update(addresses)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(and(
          eq(addresses.userId, userId),
          eq(addresses.isDefault, true)
        ));

      // Set this address as default
      const [updatedAddress] = await db.update(addresses)
        .set({ 
          isDefault: true,
          updatedAt: new Date()
        })
        .where(and(
          eq(addresses.id, id),
          eq(addresses.userId, userId)
        ))
        .returning();
      
      return updatedAddress;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to set default address: ${error.message}`);
      }
      throw new Error("Failed to set default address due to an unexpected error.");
    }
  }

  // Get user's default address
  async getDefaultAddress(userId: string): Promise<Address | undefined> {
    try {
      const defaultAddress = await db.select()
        .from(addresses)
        .where(and(
          eq(addresses.userId, userId),
          eq(addresses.isDefault, true)
        ))
        .limit(1);
      
      return defaultAddress[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get default address: ${error.message}`);
      }
      throw new Error("Failed to get default address due to an unexpected error.");
    }
  }
}