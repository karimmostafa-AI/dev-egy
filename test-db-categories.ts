import { db, categories } from "./server/db";

const testCategoriesDirect = async () => {
  try {
    console.log("Testing direct database query for categories...");
    const result = await db.select().from(categories);
    console.log("Success! Categories:", result);
  } catch (error) {
    console.error("Error in direct database query:", error.message);
    console.error("Error stack:", error.stack);
  }
};

testCategoriesDirect();