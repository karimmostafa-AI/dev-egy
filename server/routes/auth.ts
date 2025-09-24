import { Router } from "express";
import { UserService } from "../services/userService";
import { AuthService } from "../services/authService";
import { forgotPasswordSchema, resetPasswordSchema, verifyResetTokenSchema } from "@shared/schema";

const router = Router();
const userService = new UserService();
const authService = new AuthService();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    const result = await authService.register({ fullName, email, password });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return res.status(409).json({ message: "User with this email already exists" });
    }
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const result = await authService.login(email, password);
    
    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    res.json(result);
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Get current user profile (protected route)
router.get("/me", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    const user = await userService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Update user profile (protected route)
router.put("/me", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    const { fullName, email } = req.body;
    
    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }
    
    const userData: any = {};
    if (fullName) userData.fullName = fullName;
    if (email) userData.email = email;
    
    const updatedUser = await userService.updateUser(decoded.userId, userData);
    
    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Forgot password endpoint - Generate reset token and send email
router.post("/forgot-password", async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: validationResult.error.errors 
      });
    }
    
    const { email } = validationResult.data;
    
    // Process forgot password request
    const result = await authService.forgotPassword(email);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({ 
      success: true, 
      message: result.message 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    let errorMessage = "An unexpected error occurred while processing your request.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Reset password endpoint - Validate token and update password
router.post("/reset-password", async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validationResult = resetPasswordSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: validationResult.error.errors 
      });
    }
    
    const { token, password } = validationResult.data;
    
    // Update password using reset token
    const result = await authService.updatePasswordWithToken(token, password);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({ 
      success: true, 
      message: result.message 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    let errorMessage = "An unexpected error occurred while resetting your password.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Verify reset token endpoint - Check if token is valid and not expired
router.get("/verify-reset-token", async (req, res) => {
  try {
    // Get token from query parameters
    const { token } = req.query;
    
    // Validate request using Zod schema
    const validationResult = verifyResetTokenSchema.safeParse({ token });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid token parameter", 
        errors: validationResult.error.errors 
      });
    }
    
    const { token: validatedToken } = validationResult.data;
    
    // Validate the reset token
    const result = await authService.validateResetToken(validatedToken);
    
    if (!result.valid) {
      return res.status(400).json({ 
        valid: false, 
        message: result.message 
      });
    }
    
    res.json({ 
      valid: true, 
      message: result.message 
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    let errorMessage = "An unexpected error occurred while verifying the token.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ 
      valid: false, 
      message: errorMessage 
    });
  }
});

export default router;