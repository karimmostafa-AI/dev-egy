import { db, categories } from "./server/db";

const testCategories = async () => {
  try {
    console.log("Attempting to fetch categories...");
    const result = await db.select().from(categories);
    console.log("Categories fetched successfully:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    console.error("Error stack:", error.stack);
  }
};

testCategories();