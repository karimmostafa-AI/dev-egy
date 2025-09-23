import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

export default function OrderSummary() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { cartItems } = useCart();

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product?.price || '0');
    return acc + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 50 ? 0 : 7.99; // Free shipping over $50
  const taxes = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + shipping + taxes;

  const handlePlaceOrder = async () => {
    try {
      // Collect shipping and payment information
      // For now, we'll use mock data
      const checkoutData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.product?.price || '0')
        })),
        subtotal,
        shipping,
        taxes,
        total,
        currency: "USD",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        billingAddressId: "mock-billing-address",
        shippingAddressId: "mock-shipping-address",
        paymentMethod: "card",
        paymentStatus: "pending"
      };

      // Send checkout data to the server
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast({
        title: "Order Placed!",
        description: `Your order #${data.order.orderNumber} has been confirmed.`,
      });

      // Redirect to a success page
      setLocation(`/order-success?orderId=${data.order.orderNumber}`);

    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="sticky top-36">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product?.name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">
                ${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Shipping</p>
            <p>
              {shipping === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `${shipping.toFixed(2)}`
              )}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Taxes</p>
            <p>${taxes.toFixed(2)}</p>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePlaceOrder} 
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          disabled={cartItems.length === 0}
        >
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
