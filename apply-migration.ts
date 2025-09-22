import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function applyMigration() {
  try {
    console.log("Applying migration to add admin fields...");
    
    // Check if role column exists
    try {
      await db.run(sql`SELECT role FROM users LIMIT 1`);
      console.log("Role column already exists in users table");
    } catch (error) {
      // Add role column if it doesn't exist
      console.log("Adding role column to users table...");
      await db.run(sql`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'`);
      console.log("Role column added successfully");
    }
    
    // Check if image column exists in categories
    try {
      await db.run(sql`SELECT image FROM categories LIMIT 1`);
      console.log("Image column already exists in categories table");
    } catch (error) {
      // Add image column if it doesn't exist
      console.log("Adding image column to categories table...");
      await db.run(sql`ALTER TABLE categories ADD COLUMN image TEXT`);
      console.log("Image column added successfully");
    }
    
    // Create index for role field
    try {
      await db.run(sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
      console.log("Index created for role field");
    } catch (error) {
      console.log("Index might already exist");
    }
    
    // Set admin role for admin@devegypt.com if it exists
    await db.run(sql`UPDATE users SET role = 'admin' WHERE email = 'admin@devegypt.com'`);
    console.log("Updated admin user role if exists");
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

applyMigration();