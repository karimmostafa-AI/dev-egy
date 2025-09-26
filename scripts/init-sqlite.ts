#!/usr/bin/env tsx

/**
 * SQLite Database Initialization Script
 * 
 * This script ensures that the SQLite database is properly initialized
 * and prevents any PostgreSQL configurations from interfering.
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as schema from "../shared/schema-sqlite";
import path from "path";
import fs from "fs";

async function initSqliteDatabase() {
  console.log("🔧 Initializing SQLite database...");
  
  const dbUrl = process.env.DATABASE_URL || 'file:./dev-egypt.db';
  const dbPath = dbUrl.replace('file:', '');
  
  console.log(`📁 Database path: ${dbPath}`);
  
  // Ensure the database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir) && dbDir !== '.') {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Created database directory: ${dbDir}`);
  }
  
  // Create SQLite database connection
  const sqlite = new Database(dbPath);
  
  // Enable foreign keys
  sqlite.pragma('foreign_keys = ON');
  
  // Create drizzle instance
  const db = drizzle(sqlite, { schema });
  
  try {
    // Check if migrations folder exists
    const migrationsPath = "./migrations";
    if (fs.existsSync(migrationsPath)) {
      console.log("📦 Running migrations...");
      await migrate(db, { migrationsFolder: migrationsPath });
      console.log("✅ Migrations completed successfully!");
    } else {
      console.log("⚠️  No migrations folder found, skipping migration step");
      console.log("💡 You can generate migrations using: npm run db:push");
    }
    
    console.log("✅ SQLite database initialization complete!");
    console.log("🎯 Your application is now configured to use SQLite instead of PostgreSQL");
    
  } catch (error) {
    console.error("❌ Error initializing SQLite database:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

// Run the initialization
initSqliteDatabase();