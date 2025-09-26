// Admin React Query hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/adminApi";

// Dashboard analytics
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "analytics"],
    queryFn: adminApi.getDashboardAnalytics,
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
    queryFn: () => adminApi.getOrders(params),
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
    queryFn: () => Promise.resolve({ data: [], pagination: null }),
    enabled: false, // Disable until getRefunds is implemented
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApi.getCategories(),
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["admin", "categories", id],
    queryFn: () => adminApi.getCategory(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory.bind(adminApi),
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
    mutationFn: adminApi.deleteCategory.bind(adminApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => adminApi.getBrands(),
  });
};

export const useBrand = (id: string) => {
  return useQuery({
    queryKey: ["admin", "brands", id],
    queryFn: () => adminApi.getBrand(id),
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
    queryFn: () => adminApi.getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["admin", "products", id],
    queryFn: () => adminApi.getProduct(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createProduct.bind(adminApi),
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
    mutationFn: adminApi.deleteProduct.bind(adminApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
};

export const useUpdateProductColors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, colors }: { 
      id: string; 
      colors: Array<{ name: string; hex: string; imageUrl: string }> 
    }) => adminApi.updateProductColors(id, colors),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.id] });
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
    queryFn: () => adminApi.getCustomers(params),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["admin", "customers", id],
    queryFn: () => adminApi.getCustomer(id),
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
    mutationFn: adminApi.deleteCustomer.bind(adminApi),
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
    queryFn: () => adminApi.getCoupons(params),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCoupon.bind(adminApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["admin", "coupons", id],
    queryFn: () => adminApi.getCoupon(id),
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
    mutationFn: adminApi.deleteCoupon.bind(adminApi),
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
    mutationFn: adminApi.uploadImage.bind(adminApi),
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