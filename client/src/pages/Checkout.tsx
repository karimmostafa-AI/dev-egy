import { useState } from "react";
import { useLocation } from "wouter";
import TopNavigationBar from "@/components/TopNavigationBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import PaymentMethodForm from "@/components/checkout/PaymentMethodForm";
import { useToast } from "@/hooks/use-toast";
import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import SEO from "@/components/SEO";

interface ShippingAddress {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

export default function CheckoutPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { cartItems, isLoading: cartLoading } = useCart();
  const { processOrder, isProcessing, error } = useCheckout();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleShippingAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    toast({
      title: "Shipping address saved",
      description: "Your shipping address has been saved successfully."
    });
  };

  const handlePaymentMethodSubmit = (payment: PaymentMethod) => {
    setPaymentMethod(payment);
    toast({
      title: "Payment method saved",
      description: "Your payment method has been saved successfully."
    });
  };

  const handleCompleteOrder = async () => {
    if (!shippingAddress) {
      toast({
        title: "Shipping Address Required",
        description: "Please fill out your shipping address.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please fill out your payment information.",
        variant: "destructive",
      });
      return;
    }

    try {
      const paymentData = {
        method: 'card' as const,
        cardNumber: paymentMethod.cardNumber,
        expiryDate: paymentMethod.expiryDate,
        cvc: paymentMethod.cvc,
        cardholderName: paymentMethod.cardholderName,
      };

      const result = await processOrder(shippingAddress, paymentData);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${result.order.orderNumber} has been created.`,
      });

      // Redirect to order success page
      setLocation(`/order-success?orderId=${result.order.id}`);
      
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // Check if cart is empty
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO 
          title="Checkout - DEV Egypt"
          description="Complete your purchase"
        />
        
        <div className="sticky top-0 z-40 bg-background border-b">
          <TopNavigationBar />
          <MainHeader />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => setLocation('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Continue Shopping
          </button>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Checkout - DEV Egypt"
        description="Complete your purchase of medical uniforms and scrubs"
        keywords="checkout, buy scrubs, medical uniforms, payment"
      />
      
      <div className="sticky top-0 z-40 bg-background border-b">
        <TopNavigationBar />
        <MainHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left side: Forms */}
          <div className="lg:col-span-2 space-y-8">
            <ShippingAddressForm onSubmit={handleShippingAddressSubmit} />
            <PaymentMethodForm onSubmit={handlePaymentMethodSubmit} />
            
            {/* Complete Order Button */}
            <div className="bg-white p-6 rounded-lg shadow">
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing || !shippingAddress || !paymentMethod}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Complete Order</span>
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error.message}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Right side: Order Summary */}
          <aside className="lg:col-span-1">
            <OrderSummary />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
