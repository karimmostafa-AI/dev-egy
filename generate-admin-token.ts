import { db, users } from "./server/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "dev-egypt-secret-key-for-development-only";

const generateAdminToken = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@devegypt.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    console.log(`Setting up admin user with email: ${adminEmail}`);
    
    // Check if admin user exists
    let userResult = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    let user;
    if (userResult.length === 0) {
      // Create admin user if not exists
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      [user] = await db.insert(users).values({
        fullName: "Admin User",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin"
      }).returning();
      
      console.log("Admin user created successfully");
    } else {
      user = userResult[0];
      
      // If user exists but password doesn't match, update password and role
      const isPasswordValid = await bcrypt.compare(adminPassword, user.passwordHash);
      
      if (!isPasswordValid || user.role !== "admin") {
        console.log("Updating admin user password and role...");
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        await db.update(users)
          .set({ 
            passwordHash: hashedPassword, 
            role: "admin" 
          })
          .where(eq(users.id, user.id));
        
        // Fetch updated user
        userResult = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
        user = userResult[0];
        console.log("Admin user updated successfully");
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    console.log("Admin Token Generated:");
    console.log(token);
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    console.log("Token verified successfully:");
    console.log(JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.error("Error generating token:", error.message);
  }
};

generateAdminToken();