// Admin API service functions
import { apiRequest } from "@/lib/queryClient";

// Dashboard analytics
export const fetchDashboardAnalytics = async () => {
  const res = await apiRequest("GET", "/api/admin/dashboard/analytics");
  return await res.json();
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
  
  const res = await apiRequest("GET", `/api/admin/orders?${searchParams.toString()}`);
  return await res.json();
};

// Refunds
export const fetchRefunds = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/refunds?${searchParams.toString()}`);
  return await res.json();
};

// Categories
export const fetchCategories = async () => {
  const res = await apiRequest("GET", "/api/admin/categories");
  return await res.json();
};

export const fetchCategory = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/categories/${id}`);
  return await res.json();
};

export const createCategory = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/categories", data);
  return await res.json();
};

export const updateCategory = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/categories/${id}`, data);
  return await res.json();
};

export const deleteCategory = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/categories/${id}`);
  return await res.json();
};

// Products
export const fetchProducts = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/products?${searchParams.toString()}`);
  return await res.json();
};

export const fetchProduct = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/products/${id}`);
  return await res.json();
};

export const createProduct = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/products", data);
  return await res.json();
};

export const updateProduct = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/products/${id}`, data);
  return await res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/products/${id}`);
  return await res.json();
};

// Customers
export const fetchCustomers = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/customers?${searchParams.toString()}`);
  return await res.json();
};

export const fetchCustomer = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/customers/${id}`);
  return await res.json();
};

export const updateCustomer = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/customers/${id}`, data);
  return await res.json();
};

export const deleteCustomer = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/customers/${id}`);
  return await res.json();
};

// Coupons
export const fetchCoupons = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/coupons?${searchParams.toString()}`);
  return await res.json();
};

export const createCoupon = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/coupons", data);
  return await res.json();
};

export const fetchCoupon = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/coupons/${id}`);
  return await res.json();
};

export const updateCoupon = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/coupons/${id}`, data);
  return await res.json();
};

export const deleteCoupon = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/coupons/${id}`);
  return await res.json();
};

// Blog Posts
export const fetchBlogPosts = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/blog-posts?${searchParams.toString()}`);
  return await res.json();
};

export const createBlogPost = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/blog-posts", data);
  return await res.json();
};

export const fetchBlogPost = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/blog-posts/${id}`);
  return await res.json();
};

export const updateBlogPost = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/blog-posts/${id}`, data);
  return await res.json();
};

export const deleteBlogPost = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/blog-posts/${id}`);
  return await res.json();
};

// Reviews
export const fetchReviews = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/reviews?${searchParams.toString()}`);
  return await res.json();
};

export const fetchReview = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/reviews/${id}`);
  return await res.json();
};

export const updateReview = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/reviews/${id}`, data);
  return await res.json();
};

export const deleteReview = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/reviews/${id}`);
  return await res.json();
};

// Collections
export const fetchCollections = async (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const res = await apiRequest("GET", `/api/admin/collections?${searchParams.toString()}`);
  return await res.json();
};

export const createCollection = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/collections", data);
  return await res.json();
};

export const fetchCollection = async (id: string) => {
  const res = await apiRequest("GET", `/api/admin/collections/${id}`);
  return await res.json();
};

export const updateCollection = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/admin/collections/${id}`, data);
  return await res.json();
};

export const deleteCollection = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/admin/collections/${id}`);
  return await res.json();
};

// Upload image
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  
  return await res.json();
};

// Collection Products
export const fetchCollectionProducts = async (collectionId: string) => {
  const res = await apiRequest("GET", `/api/admin/collections/${collectionId}/products`);
  return await res.json();
};

export const addProductToCollection = async (collectionId: string, data: any) => {
  const res = await apiRequest("POST", `/api/admin/collections/${collectionId}/products`, data);
  return await res.json();
};

export const removeProductFromCollection = async (collectionId: string, productId: string) => {
  const res = await apiRequest("DELETE", `/api/admin/collections/${collectionId}/products/${productId}`);
  return await res.json();
};