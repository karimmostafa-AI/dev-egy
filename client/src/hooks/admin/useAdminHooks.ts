// Comprehensive React Query hooks for admin functionality
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/adminApi';

// Query Keys for consistent caching
export const adminQueryKeys = {
  dashboard: ['admin', 'dashboard'],
  orders: (filters?: any) => ['admin', 'orders', filters],
  order: (id: string) => ['admin', 'orders', id],
  products: (filters?: any) => ['admin', 'products', filters],
  product: (id: string) => ['admin', 'products', id],
  categories: (filters?: any) => ['admin', 'categories', filters],
  category: (id: string) => ['admin', 'categories', id],
  customers: (filters?: any) => ['admin', 'customers', filters],
  customer: (id: string) => ['admin', 'customers', id],
  coupons: (filters?: any) => ['admin', 'coupons', filters],
  coupon: (id: string) => ['admin', 'coupons', id],
  reviews: (filters?: any) => ['admin', 'reviews', filters],
  blogPosts: (filters?: any) => ['admin', 'blog-posts', filters],
  blogPost: (id: string) => ['admin', 'blog-posts', id],
  collections: (filters?: any) => ['admin', 'collections', filters],
  collection: (id: string) => ['admin', 'collections', id],
  collectionProducts: (id: string) => ['admin', 'collections', id, 'products'],
} as const;

// Dashboard Analytics Hook
export function useDashboardAnalytics() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard,
    queryFn: () => adminApi.getDashboardAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refresh every 10 minutes
  });
}

// Orders Hooks
export function useOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: adminQueryKeys.orders(params),
    queryFn: () => adminApi.getOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: adminQueryKeys.order(orderId),
    queryFn: () => adminApi.getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      adminApi.updateOrderStatus(orderId, status),
    onSuccess: (data, { orderId }) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() });
      // Update the specific order cache
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.order(orderId) });
      // Update dashboard analytics
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

// Products Hooks
export function useProducts(params: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: adminQueryKeys.products(params),
    queryFn: () => adminApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: adminQueryKeys.product(productId),
    queryFn: () => adminApi.getProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: any) => adminApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: any }) =>
      adminApi.updateProduct(productId, data),
    onSuccess: (data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(productId) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => adminApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

// Categories Hooks
export function useCategories(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.categories(params),
    queryFn: () => adminApi.getCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes (categories change less frequently)
  });
}

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: adminQueryKeys.category(categoryId),
    queryFn: () => adminApi.getCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: any) => adminApi.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: any }) =>
      adminApi.updateCategory(categoryId, data),
    onSuccess: (data, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.category(categoryId) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
    },
  });
}

// Customers Hooks
export function useCustomers(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.customers(params),
    queryFn: () => adminApi.getCustomers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: adminQueryKeys.customer(customerId),
    queryFn: () => adminApi.getCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      adminApi.updateCustomer(customerId, data),
    onSuccess: (data, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customer(customerId) });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => adminApi.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

// Coupons Hooks
export function useCoupons(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.coupons(params),
    queryFn: () => adminApi.getCoupons(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCoupon(couponId: string) {
  return useQuery({
    queryKey: adminQueryKeys.coupon(couponId),
    queryFn: () => adminApi.getCoupon(couponId),
    enabled: !!couponId,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData: any) => adminApi.createCoupon(couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons() });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ couponId, data }: { couponId: string; data: any }) =>
      adminApi.updateCoupon(couponId, data),
    onSuccess: (data, { couponId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupon(couponId) });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponId: string) => adminApi.deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons() });
    },
  });
}

// Reviews Hooks
export function useReviews(params: {
  page?: number;
  limit?: number;
  productId?: string;
  isApproved?: boolean;
} = {}) {
  return useQuery({
    queryKey: adminQueryKeys.reviews(params),
    queryFn: () => adminApi.getReviews(params),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) =>
      adminApi.approveReview(reviewId, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.reviews() });
    },
  });
}

// File Upload Hook
export function useFileUpload() {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      adminApi.uploadFile(file, onProgress),
  });
}

// Bulk Operations Hooks
export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: string[]) => adminApi.bulkDeleteProducts(productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

export function useBulkUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productIds, isAvailable }: { productIds: string[]; isAvailable: boolean }) =>
      adminApi.bulkUpdateProductStatus(productIds, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() });
    },
  });
}

// Export Data Hook
export function useExportData() {
  return useMutation({
    mutationFn: ({ type, format }: { type: 'products' | 'orders' | 'customers'; format?: 'csv' | 'xlsx' }) =>
      adminApi.exportData(type, format),
  });
}

// Blog Posts Hooks
export function useBlogPosts(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.blogPosts(params),
    queryFn: () => adminApi.fetchBlogPosts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBlogPost(blogPostId: string) {
  return useQuery({
    queryKey: adminQueryKeys.blogPost(blogPostId),
    queryFn: () => adminApi.fetchBlogPost(blogPostId),
    enabled: !!blogPostId,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogPostData: any) => adminApi.createBlogPost(blogPostData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.blogPosts() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogPostId, data }: { blogPostId: string; data: any }) =>
      adminApi.updateBlogPost(blogPostId, data),
    onSuccess: (data, { blogPostId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.blogPosts() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.blogPost(blogPostId) });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogPostId: string) => adminApi.deleteBlogPost(blogPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.blogPosts() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

// Collections Hooks
export function useCollections(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.collections(params),
    queryFn: () => adminApi.fetchCollections(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCollection(collectionId: string) {
  return useQuery({
    queryKey: adminQueryKeys.collection(collectionId),
    queryFn: () => adminApi.fetchCollection(collectionId),
    enabled: !!collectionId,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionData: any) => adminApi.createCollection(collectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collections() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, data }: { collectionId: string; data: any }) =>
      adminApi.updateCollection(collectionId, data),
    onSuccess: (data, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collections() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collection(collectionId) });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => adminApi.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collections() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard });
    },
  });
}

// Collection Products Hooks
export function useCollectionProducts(collectionId: string) {
  return useQuery({
    queryKey: adminQueryKeys.collectionProducts(collectionId),
    queryFn: () => adminApi.fetchCollectionProducts(collectionId),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useAddProductToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, productData }: { collectionId: string; productData: any }) =>
      adminApi.addProductToCollection(collectionId, productData),
    onSuccess: (data, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collectionProducts(collectionId) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collections() });
    },
  });
}

export function useRemoveProductFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, productId }: { collectionId: string; productId: string }) =>
      adminApi.removeProductFromCollection(collectionId, productId),
    onSuccess: (data, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collectionProducts(collectionId) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.collections() });
    },
  });
}

// Combined hook for common admin operations
export function useAdminOperations() {
  return {
    // Dashboard
    dashboard: useDashboardAnalytics(),
    
    // Orders
    updateOrderStatus: useUpdateOrderStatus(),
    
    // Products
    createProduct: useCreateProduct(),
    updateProduct: useUpdateProduct(),
    deleteProduct: useDeleteProduct(),
    bulkDeleteProducts: useBulkDeleteProducts(),
    bulkUpdateProductStatus: useBulkUpdateProductStatus(),
    
    // Categories
    createCategory: useCreateCategory(),
    updateCategory: useUpdateCategory(),
    deleteCategory: useDeleteCategory(),
    
    // Customers
    updateCustomer: useUpdateCustomer(),
    deleteCustomer: useDeleteCustomer(),
    
    // Coupons
    createCoupon: useCreateCoupon(),
    updateCoupon: useUpdateCoupon(),
    deleteCoupon: useDeleteCoupon(),
    
    // Reviews
    approveReview: useApproveReview(),
    
    // Blog Posts
    createBlogPost: useCreateBlogPost(),
    updateBlogPost: useUpdateBlogPost(),
    deleteBlogPost: useDeleteBlogPost(),
    
    // Collections
    createCollection: useCreateCollection(),
    updateCollection: useUpdateCollection(),
    deleteCollection: useDeleteCollection(),
    addProductToCollection: useAddProductToCollection(),
    removeProductFromCollection: useRemoveProductFromCollection(),
    
    // File Upload
    uploadFile: useFileUpload(),
    
    // Export
    exportData: useExportData(),
  };
}

export default useAdminOperations;