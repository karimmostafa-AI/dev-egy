import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { InsertUser } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  // In development, provide a fallback but warn
  if (process.env.NODE_ENV === "development") {
    console.warn("WARNING: Using default JWT_SECRET in development. Set JWT_SECRET environment variable for production.");
    return "dev-egypt-secret-key-for-development-only";
  }
  throw new Error("JWT_SECRET environment variable is required for security");
})();
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
      // Always set role to 'user' for security - admins must be promoted separately
      const { password, ...userDataWithoutPassword } = userData;
      const [user] = await db.insert(users).values({
        ...userDataWithoutPassword,
        passwordHash: hashedPassword,
        role: "user" // Force role to user for security
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

  // Get user by ID with role
  async getUserById(userId: string): Promise<{ id: string; email: string; fullName: string; role: string } | null> {
    try {
      const userResult = await db.select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role
      }).from(users).where(eq(users.id, userId)).limit(1);
      
      if (userResult.length === 0) {
        return null;
      }
      
      return userResult[0];
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user?.role === "admin" || false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
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