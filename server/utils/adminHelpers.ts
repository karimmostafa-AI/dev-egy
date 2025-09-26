import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

const authService = new AuthService();

// Middleware to require admin authentication  
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get token ONLY from Authorization header (not cookies) for security
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({ 
        error: "Authentication required",
        details: "No token provided" 
      });
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        error: "Invalid token",
        details: "Token verification failed" 
      });
    }

    // Check if user is admin
    const isUserAdmin = await authService.isAdmin(decoded.userId);
    if (!isUserAdmin) {
      return res.status(403).json({ 
        error: "Access denied",
        details: "Admin privileges required" 
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: "Authentication check failed" 
    });
  }
};

// Helper function for standardized success responses
export const successResponse = (data: any, message?: string) => {
  return {
    success: true,
    data,
    message: message || "Operation successful"
  };
};

// Helper function for standardized error responses
export const errorResponse = (message: string, details?: string) => {
  return {
    success: false,
    error: message,
    details: details || undefined
  };
};

// Helper function for paginated responses
export const paginatedResponse = (data: any[], page: number, limit: number, total: number) => {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Helper function to format decimal values
export const formatDecimal = (value: number | string): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

// Helper function to get date ranges
export const getDateRange = (period: 'today' | 'week' | 'month') => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return {
    start: start.getTime(),
    end: end.getTime()
  };
};

// Helper function to validate pagination parameters
export const validatePaginationParams = (req: Request) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  return { page, limit };
};

// Helper function to apply pagination to data
export const applyPagination = <T>(data: T[], page: number, limit: number): T[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return data.slice(startIndex, endIndex);
};

// Helper function to format order status
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'processing': 'Processing',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

// Helper function to sanitize input
export const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim();
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return data;
};

// Helper function to validate required fields
export const validateRequiredFields = (data: any, requiredFields: string[]): string | null => {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      return `${field} is required`;
    }
  }
  return null;
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};