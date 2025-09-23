import { useState } from "react";
import { useLocation } from "wouter";
import TopNavigationBar from "@/components/TopNavigationBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import PaymentMethodForm from "@/components/checkout/PaymentMethodForm";
import { useToast } from "@/hooks/use-toast";

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
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
