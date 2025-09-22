import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, users } from "../db";
import { eq } from "drizzle-orm";

// Admin role constants
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager'
} as const;

// Helper to format decimal values
export function formatDecimal(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return parseFloat(value.toString());
}

// Helper to format date for SQLite
export function formatDateForSQLite(date: Date): string {
  return date.toISOString();
}

// Helper to get date range for SQLite queries
export function getDateRange(period: 'today' | 'week' | 'month') {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    default:
      startDate = new Date();
  }

  return {
    start: startDate.toISOString(),
    end: now.toISOString()
  };
}

// Standardized API response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination response format
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Helper to create success response
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

// Helper to create error response
export function errorResponse(error: string, statusCode?: number): ApiResponse {
  return {
    success: false,
    error
  };
}

// Helper to create paginated response
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

// Improved admin authentication middleware
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // For development, check for admin bypass header
    if (process.env.NODE_ENV === 'development' && req.headers['x-admin-bypass'] === 'true') {
      console.log("Admin authentication bypassed for development");
      // Set a mock admin user for development
      (req as any).user = {
        id: 'admin-dev',
        email: 'admin@dev.com',
        role: ADMIN_ROLES.SUPER_ADMIN
      };
      return next();
    }

    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('No token provided'));
    }

    // Extract and verify token
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    // Fetch user from database
    const userResult = await db.select().from(users).where(eq(users.id, decoded.userId));
    
    if (userResult.length === 0) {
      return res.status(401).json(errorResponse('User not found'));
    }

    const user = userResult[0];

    // Check if user has admin role
    if (!user.role || !['admin', 'super_admin', 'manager'].includes(user.role)) {
      return res.status(403).json(errorResponse('Access denied. Admin privileges required'));
    }

    // Attach user to request
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(errorResponse('Invalid token'));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(errorResponse('Token expired'));
    }
    
    return res.status(500).json(errorResponse('Authentication error'));
  }
}

// Helper to validate request parameters
export function validatePaginationParams(req: Request): { page: number; limit: number } {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  
  return { page, limit };
}

// Helper to apply pagination to query results
export function applyPagination<T>(data: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
}

// Helper to format order status for consistency
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'confirmed': 'confirmed',
    'processing': 'processing',
    'pickup': 'pick-up',
    'on_the_way': 'on-the-way',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  
  return statusMap[status] || status;
}

// Helper to sanitize input data
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data.trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeInput(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(data[key]);
      }
    }
    return sanitized;
  }
  
  return data;
}

// Helper to validate required fields
export function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

// Helper to handle async route errors
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}