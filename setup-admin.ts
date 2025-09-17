import { db, users } from "./server/db";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

const setupAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@devegypt.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    // Check if admin user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (existingUser.length > 0) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    
    // Create admin user
    const [adminUser] = await db.insert(users).values({
      fullName: "Admin User",
      email: adminEmail,
      passwordHash: hashedPassword
    }).returning();
    
    console.log("Admin user created successfully:");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log("(Remember to change the password after first login)");
  } catch (error) {
    console.error("Error setting up admin user:", error.message);
  }
};

setupAdminUser();