import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  sku: string;
  price: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  billingAddressId: string | null;
  shippingAddressId: string | null;
  notes: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

interface UserOrdersResponse {
  orders: Order[];
}

// API functions
const fetchUserOrders = async (): Promise<UserOrdersResponse> => {
  const res = await apiRequest("GET", "/api/orders");
  return await res.json();
};

// Hook
export const useUserOrders = () => {
  return useQuery({
    queryKey: ["user", "orders"],
    queryFn: fetchUserOrders,
  });
};