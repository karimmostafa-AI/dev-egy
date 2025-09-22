// Improved Admin API service functions with better error handling
import { apiRequest } from "@/lib/queryClient";

// Generic API response type
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination response type
interface PaginatedResponse<T = any> {
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

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.error || result.message || 'An error occurred');
  }
  
  return result.data;
}

// Helper to add admin headers for development
function getAdminHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  
  // In development, add bypass header
  if (import.meta.env.DEV) {
    headers['x-admin-bypass'] = 'true';
  }
  
  return headers;
}

// Dashboard analytics
export const fetchDashboardAnalytics = async () => {
  const res = await apiRequest("GET", "/api/admin/dashboard/analytics", undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Orders
export const fetchOrders = async (params: { 
  status?: string; 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.append("status", params.status);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/orders?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

// Update order status
export const updateOrderStatus = async (id: string, status: string) => {
  const res = await apiRequest("PATCH", `/api/admin/orders/${id}/status`, { status }, getAdminHeaders());
  return handleApiResponse(res);
};

// Refunds
export const fetchRefunds = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/refunds?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

// Categories
export const fetchCategories = async () => {
  const res = await apiRequest("GET", "/api/admin/categories", undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const fetchCategory = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/categories/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const createCategory = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/categories", data, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateCategory = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/categories/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteCategory = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/categories/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Products
export const fetchProducts = async (params: { 
  page?: number; 
  limit?: number;
  categoryId?: string;
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.categoryId) searchParams.append("categoryId", params.categoryId);
  
  const res = await apiRequest("GET", `/api/admin/products?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchProduct = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/products/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const createProduct = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/products", data, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateProduct = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/products/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteProduct = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/products/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Customers
export const fetchCustomers = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/customers?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchCustomer = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/customers/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateCustomer = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/customers/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteCustomer = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/customers/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Coupons
export const fetchCoupons = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/coupons?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchCoupon = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/coupons/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const createCoupon = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/coupons", data, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateCoupon = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/coupons/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteCoupon = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/coupons/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Blog Posts
export const fetchBlogPosts = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/blog-posts?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchBlogPost = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/blog-posts/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const createBlogPost = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/blog-posts", data, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateBlogPost = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/blog-posts/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteBlogPost = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/blog-posts/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Reviews
export const fetchReviews = async (params: { 
  page?: number; 
  limit?: number;
  productId?: string;
  isApproved?: boolean;
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.productId) searchParams.append("productId", params.productId);
  if (params.isApproved !== undefined) searchParams.append("isApproved", params.isApproved.toString());
  
  const res = await apiRequest("GET", `/api/admin/reviews?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchReview = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/reviews/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const approveReview = async (id: string, isApproved: boolean) => {
  const res = await apiRequest("PATCH", `/api/admin/reviews/${id}/approve`, { isApproved }, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteReview = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/reviews/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Collections
export const fetchCollections = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/collections?${searchParams.toString()}`, undefined, getAdminHeaders());
  return handleApiResponse<ApiResponse<PaginatedResponse>>(res);
};

export const fetchCollection = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/collections/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const createCollection = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/collections", data, getAdminHeaders());
  return handleApiResponse(res);
};

export const updateCollection = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/collections/${id}`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const deleteCollection = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/collections/${id}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Collection Products
export const fetchCollectionProducts = async (collectionId: string) => {
  const res = await apiRequest("GET", `/api/admin/collections/${collectionId}/products`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

export const addProductToCollection = async (collectionId: string, data: any) => {
  const res = await apiRequest("POST", `/api/admin/collections/${collectionId}/products`, data, getAdminHeaders());
  return handleApiResponse(res);
};

export const removeProductFromCollection = async (collectionId: string, productId: string) => {
  const res = await apiRequest("DELETE", `/api/admin/collections/${collectionId}/products/${productId}`, undefined, getAdminHeaders());
  return handleApiResponse(res);
};

// Upload image
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
    headers: getAdminHeaders()
  });
  
  return handleApiResponse(res);
};