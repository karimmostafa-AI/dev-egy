import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const cartItems = [
  {
    id: 1,
    name: "Women's Stretch V-Neck Top",
    price: 2499, // in cents
    quantity: 2,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Men's Unisex Jogger Pant",
    price: 3299,
    quantity: 1,
    image: "/placeholder.svg",
  },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shipping = 500; // $5.00
const taxes = Math.round(subtotal * 0.07); // 7% tax
const total = subtotal + shipping + taxes;

export default function OrderSummary() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, total }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast({
        title: "Order Placed!",
        description: `Your order #${data.orderId} has been confirmed.`,
      });

      // Redirect to a success page (which we would create next)
      setLocation(`/order-success?orderId=${data.orderId}`);

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
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>${(subtotal / 100).toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Shipping</p>
            <p>${(shipping / 100).toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Taxes</p>
            <p>${(taxes / 100).toFixed(2)}</p>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>${(total / 100).toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlaceOrder} className="w-full bg-red-600 hover:bg-red-700 text-white">Place Order</Button>
      </CardFooter>
    </Card>
  );
}
