import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { InsertUser } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "dev-egypt-secret-key";
const SALT_ROUNDS = 10;

export class AuthService {
  // Register a new user
  async register(userData: InsertUser): Promise<{ user: any; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
      
      if (existingUser.length > 0) {
        throw new Error("User with this email already exists");
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password!, SALT_ROUNDS);
      
      // Create user (excluding password from insert data and using passwordHash instead)
      const { password, ...userDataWithoutPassword } = userData;
      const [user] = await db.insert(users).values({
        ...userDataWithoutPassword,
        passwordHash: hashedPassword
      } as any).returning();
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error("Registration failed due to an unexpected error.");
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: any; token: string } | null> {
    try {
      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (userResult.length === 0) {
        return null; // User not found
      }
      
      const user = userResult[0];
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        return null; // Invalid password
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error("Login failed due to an unexpected error.");
    }
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Password verification failed: ${error.message}`);
      }
      throw new Error("Password verification failed due to an unexpected error.");
    }
  }
}