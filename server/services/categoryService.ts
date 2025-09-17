import { eq } from "drizzle-orm";
import { db, categories } from "../db";
// Remove this import if Category type doesn't exist in @shared/schema
// import { Category } from "@shared/schema";

// Define Category type locally or import from correct location
// You might need to infer it from your database schema
type Category = typeof categories.$inferSelect;

export class CategoryService {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const result = await db.select().from(categories);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get categories: ${errorMessage}`);
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category | undefined> {
    try {
      const category = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
      return category[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get category by ID: ${errorMessage}`);
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const category = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      return category[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get category by slug: ${errorMessage}`);
    }
  }

  // Create a new category
  async createCategory(categoryData: any): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(categoryData).returning();
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create category: ${errorMessage}`);
    }
  }

  // Update category
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    try {
      const [category] = await db.update(categories).set(categoryData).where(eq(categories.id, id)).returning();
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to update category: ${errorMessage}`);
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      await db.delete(categories).where(eq(categories.id, id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete category: ${errorMessage}`);
    }
  }
}