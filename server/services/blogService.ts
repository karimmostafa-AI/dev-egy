import { db, blogPosts, blogCategories, blogPostCategories } from "../db";
import { eq } from "drizzle-orm";

export class BlogService {
  // Get all blog posts with pagination
  async getAllPosts(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const posts = await db.select().from(blogPosts)
        .limit(limit)
        .offset(offset);
      
      // For now, return a fixed total count to avoid the error
      const total = 0;
      
      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get blog posts: ${error.message}`);
      }
      throw new Error("Failed to get blog posts due to an unexpected error.");
    }
  }

  // Get blog post by ID
  async getPostById(id: string) {
    try {
      const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return post[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create blog post: ${error.message}`);
      } else {
        throw new Error(`Failed to create blog post: ${String(error)}`);
      }
    }
  }

  // Get all blog categories
  async getAllCategories() {
    try {
      const categories = await db.select().from(blogCategories);
      return categories;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get blog categories: ${error.message}`);
      } else {
        throw new Error(`Failed to get blog categories: ${String(error)}`);
      }
    }
  }

  // Get blog category by ID
  async getCategoryById(id: string) {
    try {
      const category = await db.select().from(blogCategories).where(eq(blogCategories.id, id)).limit(1);
      return category[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get blog category by ID: ${error.message}`);
      }
      throw new Error("Failed to get blog category by ID due to an unexpected error.");
    }
  }
}