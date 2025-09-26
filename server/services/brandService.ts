import { eq } from "drizzle-orm";
import { db, brands } from "../db";
import { InferSelectModel } from "drizzle-orm";
import { brands as brandsTable } from "@shared/schema-sqlite";

type Brand = InferSelectModel<typeof brandsTable>;

export class BrandService {
  // Get all brands
  async getBrands(): Promise<Brand[]> {
    try {
      const result = await db.select().from(brands);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get brands: ${error.message}`);
      }
      throw new Error("Failed to get brands due to an unexpected error.");
    }
  }

  // Get brand by ID
  async getBrandById(id: string): Promise<Brand | undefined> {
    try {
      const brand = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
      return brand[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get brand by ID: ${error.message}`);
      } else {
        throw new Error(`Failed to get brand by ID: ${String(error)}`);
      }
    }
  }

  // Get brand by slug
  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    try {
      const brand = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
      return brand[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get brand by slug: ${error.message}`);
      } else {
        throw new Error(`Failed to get brand by slug: ${String(error)}`);
      }
    }
  }

  // Create a new brand
  async createBrand(brandData: any): Promise<Brand> {
    try {
      const [brand] = await db.insert(brands).values(brandData).returning();
      return brand;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create brand: ${error.message}`);
      } else {
        throw new Error(`Failed to create brand: ${String(error)}`);
      }
    }
  }

  // Update brand
  async updateBrand(id: string, brandData: Partial<Brand>): Promise<Brand> {
    try {
      const [brand] = await db.update(brands).set(brandData).where(eq(brands.id, id)).returning();
      return brand;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update brand: ${error.message}`);
      } else {
        throw new Error(`Failed to update brand: ${String(error)}`);
      }
    }
  }

  // Delete brand
  async deleteBrand(id: string): Promise<void> {
    try {
      await db.delete(brands).where(eq(brands.id, id));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete brand: ${error.message}`);
      }
      throw new Error("Failed to delete brand due to an unexpected error.");
    }
  }
}