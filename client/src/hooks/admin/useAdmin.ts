// Admin React Query hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "./api";

// Dashboard analytics
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "analytics"],
    queryFn: adminApi.fetchDashboardAnalytics,
  });
};

// Orders
export const useOrders = (params: { 
  status?: string; 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "orders", paramsKey],
    queryFn: () => adminApi.fetchOrders(params),
  });
};

// Refunds
export const useRefunds = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "refunds", paramsKey],
    queryFn: () => adminApi.fetchRefunds(params),
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.fetchCategories,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["admin", "categories", id],
    queryFn: () => adminApi.fetchCategory(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Products
export const useProducts = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "products", paramsKey],
    queryFn: () => adminApi.fetchProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["admin", "products", id],
    queryFn: () => adminApi.fetchProduct(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
};

// Customers
export const useCustomers = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "customers", paramsKey],
    queryFn: () => adminApi.fetchCustomers(params),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["admin", "customers", id],
    queryFn: () => adminApi.fetchCustomer(id),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });
};

// Coupons
export const useCoupons = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "coupons", paramsKey],
    queryFn: () => adminApi.fetchCoupons(params),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["admin", "coupons", id],
    queryFn: () => adminApi.fetchCoupon(id),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
};

// Blog Posts
export const useBlogPosts = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "blog-posts", paramsKey],
    queryFn: () => adminApi.fetchBlogPosts(params),
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
    },
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["admin", "blog-posts", id],
    queryFn: () => adminApi.fetchBlogPost(id),
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
    },
  });
};

// Reviews
export const useReviews = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "reviews", paramsKey],
    queryFn: () => adminApi.fetchReviews(params),
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: ["admin", "reviews", id],
    queryFn: () => adminApi.fetchReview(id),
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};

// Collections
export const useCollections = (params: { 
  page?: number; 
  limit?: number 
} = {}) => {
  // Create a stable string representation of params for the query key
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());
  
  return useQuery({
    queryKey: ["admin", "collections", paramsKey],
    queryFn: () => adminApi.fetchCollections(params),
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ["admin", "collections", id],
    queryFn: () => adminApi.fetchCollection(id),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminApi.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
};

// Upload image
export const useUploadImage = () => {
  return useMutation({
    mutationFn: adminApi.uploadImage,
  });
};

// Collection Products
export const useCollectionProducts = (collectionId: string) => {
  return useQuery({
    queryKey: ["admin", "collections", collectionId, "products"],
    queryFn: () => adminApi.fetchCollectionProducts(collectionId),
  });
};

export const useAddProductToCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, data }: { collectionId: string; data: any }) => 
      adminApi.addProductToCollection(collectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections", variables.collectionId, "products"] });
    },
  });
};

export const useRemoveProductFromCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, productId }: { collectionId: string; productId: string }) => 
      adminApi.removeProductFromCollection(collectionId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections", variables.collectionId, "products"] });
    },
  });
};