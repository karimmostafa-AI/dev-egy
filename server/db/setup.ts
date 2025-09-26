import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as schema from "../../shared/schema-sqlite";

async function setupDatabase() {
  console.log("Setting up database...");
  
  // Create SQLite database connection
  const sqlite = new Database(process.env.DATABASE_URL!.replace('file:', ''));
  
  // Create drizzle instance
  const db = drizzle(sqlite, { schema });
  
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