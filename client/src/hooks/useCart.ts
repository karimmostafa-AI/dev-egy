import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: {
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
  };
}

interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

// API functions
const fetchCart = async (): Promise<{ cartItems: CartItem[] }> => {
  const res = await apiRequest("GET", "/api/cart");
  return await res.json();
};

const addItemToCart = async (data: { productId: string; quantity: number }): Promise<{ cartItem: CartItem }> => {
  const res = await apiRequest("POST", "/api/cart/items", data);
  return await res.json();
};

const updateCartItem = async (itemId: string, data: { quantity: number }): Promise<{ cartItem: CartItem }> => {
  const res = await apiRequest("PUT", `/api/cart/items/${itemId}`, data);
  return await res.json();
};

const removeItemFromCart = async (itemId: string): Promise<void> => {
  const res = await apiRequest("DELETE", `/api/cart/items/${itemId}`);
  if (!res.ok) {
    throw new Error("Failed to remove item from cart");
  }
};

const clearCart = async (): Promise<void> => {
  const res = await apiRequest("DELETE", "/api/cart");
  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }
};

// Hook
export const useCart = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const addItemMutation = useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => 
      updateCartItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cartItems: data?.cartItems || [],
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
};