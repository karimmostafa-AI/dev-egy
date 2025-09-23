import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: string;
  comparePrice: string | null;
  costPerItem: string | null;
  categoryId: string | null;
  brandId: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  inventoryQuantity: number;
  allowOutOfStockPurchases: boolean;
  weight: string | null;
  weightUnit: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo: string | null;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
  };
  images?: Array<{
    id: string;
    productId: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: string;
  }>;
}

interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface ProductResponse {
  products: Product[];
  totalCount: number;
}

// API functions
const fetchProducts = async (filters: ProductFilters): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const res = await apiRequest("GET", `/api/products?${queryParams.toString()}`);
  return await res.json();
};

const searchProducts = async (query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const res = await apiRequest("GET", `/api/products/search?${queryParams.toString()}`);
  return await res.json();
};

// Hooks
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });
};

export const useSearchProducts = (query: string, filters: Omit<ProductFilters, 'search'> = {}) => {
  return useQuery({
    queryKey: ["search", query, filters],
    queryFn: () => searchProducts(query, filters),
    enabled: !!query, // Only run the query if there's a search query
  });
};