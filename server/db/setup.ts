import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as schema from "../../shared/schema";

async function setupDatabase() {
  console.log("Setting up database...");
  
  // Create PostgreSQL database connection using Neon
  const sql = neon(process.env.DATABASE_URL!);
  
  // Create drizzle instance
  const db = drizzle(sql, { schema });
  
  try {
    // Run migrations
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
  }
}

// Run the setup
setupDatabase();