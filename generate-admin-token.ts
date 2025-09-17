import { db, users } from "./server/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "dev-egypt-secret-key";

const generateAdminToken = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@devegypt.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    // Get the admin user from the database
    const userResult = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (userResult.length === 0) {
      console.log("Admin user not found");
      return;
    }
    
    const user = userResult[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(adminPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      console.log("Invalid password");
      return;
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