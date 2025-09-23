import { db, users } from "./server/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  try {
    const adminEmail = "admin@devegypt.com";
    const adminPassword = "admin123456"; // Change this in production
    
    console.log("Creating admin user...");
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
    
    if (existingAdmin.length > 0) {
      // Update existing user with new password hash and admin role
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.update(users)
        .set({ 
          role: 'super_admin',
          passwordHash: hashedPassword,
          fullName: 'System Administrator'
        })
        .where(eq(users.email, adminEmail));
      console.log(`Updated existing user ${adminEmail} with new password and super_admin role`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await db.insert(users).values({
        fullName: "System Administrator",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'super_admin'
      });
      
      console.log(`Created new admin user: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log("⚠️  Please change this password immediately after first login!");
    }
    
    console.log("Admin user setup completed!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdminUser();