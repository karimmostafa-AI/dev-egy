import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db, users, passwordResetTokens } from "../db";
import { eq, and, lt, isNull } from "drizzle-orm";
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
      
      const user = userResult[0];
      return {
        ...user,
        role: user.role || "customer" // Provide default role if null
      };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      const adminRoles = ['admin', 'super_admin', 'manager'];
      return user?.role ? adminRoles.includes(user.role) : false;
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

  // Generate a secure reset token and hash for storage
  generateResetToken(): { token: string; tokenHash: string } {
    try {
      // Generate a secure random token (32 bytes = 256 bits)
      const token = crypto.randomBytes(32).toString('hex');
      
      // Create SHA-256 hash of the token for secure storage
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      return { token, tokenHash };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Token generation failed: ${error.message}`);
      }
      throw new Error("Token generation failed due to an unexpected error.");
    }
  }

  // Create password reset token and store in database
  async createPasswordResetToken(email: string): Promise<{ success: boolean; token?: string; message: string }> {
    try {
      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (userResult.length === 0) {
        // Return success even if user not found for security (don't reveal user existence)
        return { 
          success: true, 
          message: "If an account with this email exists, a password reset link has been sent." 
        };
      }
      
      const user = userResult[0];
      
      // Generate reset token
      const { token, tokenHash } = this.generateResetToken();
      
      // Set expiration time (1 hour from now)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Clean up any existing tokens for this user (optional security measure)
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
      
      // Insert new reset token
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
      });
      
      return { 
        success: true, 
        token, 
        message: "Password reset token created successfully." 
      };
    } catch (error) {
      console.error("Error creating password reset token:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to create password reset token: ${error.message}`);
      }
      throw new Error("Failed to create password reset token due to an unexpected error.");
    }
  }

  // Mock email sending service (replace with real email service in production)
  async sendResetEmail(email: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Replace with actual email service (SendGrid, AWS SES, etc.)
      // For now, we'll just log the reset link
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
      
      console.log(`\n=== PASSWORD RESET EMAIL (MOCK) ===`);
      console.log(`To: ${email}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log(`Token: ${token}`);
      console.log(`=====================================\n`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { 
        success: true, 
        message: "Password reset email sent successfully." 
      };
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to send reset email: ${error.message}`);
      }
      throw new Error("Failed to send reset email due to an unexpected error.");
    }
  }

  // Validate reset token and check expiration
  async validateResetToken(token: string): Promise<{ valid: boolean; userId?: string; message: string }> {
    try {
      // Hash the provided token to compare with stored hash
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Find the token in database
      const tokenResult = await db.select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
      }).from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          // Token must not be used yet
          isNull(passwordResetTokens.usedAt)
        )
      ).limit(1);
      
      if (tokenResult.length === 0) {
        return { 
          valid: false, 
          message: "Invalid reset token." 
        };
      }
      
      const resetToken = tokenResult[0];
      
      // Check if token has expired
      if (new Date() > new Date(resetToken.expiresAt)) {
        return { 
          valid: false, 
          message: "Reset token has expired." 
        };
      }
      
      return { 
        valid: true, 
        userId: resetToken.userId, 
        message: "Reset token is valid." 
      };
    } catch (error) {
      console.error("Error validating reset token:", error);
      if (error instanceof Error) {
        throw new Error(`Token validation failed: ${error.message}`);
      }
      throw new Error("Token validation failed due to an unexpected error.");
    }
  }

  // Update password using reset token
  async updatePasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate the token first
      const tokenValidation = await this.validateResetToken(token);
      
      if (!tokenValidation.valid || !tokenValidation.userId) {
        return { 
          success: false, 
          message: tokenValidation.message 
        };
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      
      // Update user's password
      await db.update(users)
        .set({ passwordHash: hashedPassword, updatedAt: new Date() })
        .where(eq(users.id, tokenValidation.userId));
      
      // Mark the token as used
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await db.update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.tokenHash, tokenHash));
      
      return { 
        success: true, 
        message: "Password updated successfully." 
      };
    } catch (error) {
      console.error("Error updating password with token:", error);
      if (error instanceof Error) {
        throw new Error(`Password update failed: ${error.message}`);
      }
      throw new Error("Password update failed due to an unexpected error.");
    }
  }

  // Combined method for forgot password flow
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Create reset token
      const tokenResult = await this.createPasswordResetToken(email);
      
      if (!tokenResult.success || !tokenResult.token) {
        return tokenResult;
      }
      
      // Send reset email
      const emailResult = await this.sendResetEmail(email, tokenResult.token);
      
      if (!emailResult.success) {
        return emailResult;
      }
      
      return { 
        success: true, 
        message: "If an account with this email exists, a password reset link has been sent." 
      };
    } catch (error) {
      console.error("Error in forgot password flow:", error);
      if (error instanceof Error) {
        throw new Error(`Forgot password failed: ${error.message}`);
      }
      throw new Error("Forgot password failed due to an unexpected error.");
    }
  }
}