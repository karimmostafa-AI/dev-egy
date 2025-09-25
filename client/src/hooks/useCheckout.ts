import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

interface PaymentData {
  method: 'card';
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentData: PaymentData;
  notes?: string;
}

interface OrderResponse {
  order: {
    id: string;
    orderNumber: string;
    total: string;
    status: string;
  };
  payment: {
    clientSecret: string;
    paymentId: string;
  };
  message: string;
}

const processCheckout = async (data: CheckoutRequest): Promise<OrderResponse> => {
  const response = await apiRequest('POST', '/api/checkout', data);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Checkout failed');
  }
  
  return response.json();
};

export const useCheckout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  const checkoutMutation = useMutation({
    mutationFn: processCheckout,
    onSuccess: (data) => {
      // Clear cart after successful order creation
      clearCart();
    },
  });

  const processOrder = async (shippingAddress: ShippingAddress, paymentData: PaymentData, notes?: string) => {
    if (!user) {
      throw new Error('User must be logged in to checkout');
    }

    if (!cart) {
      throw new Error('Cart is empty');
    }

    return checkoutMutation.mutateAsync({
      shippingAddress,
      paymentData,
      notes,
    });
  };

  return {
    processOrder,
    isProcessing: checkoutMutation.isPending,
    error: checkoutMutation.error,
    isSuccess: checkoutMutation.isSuccess,
    data: checkoutMutation.data,
  };
};