import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCart as ShoppingCartIcon, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  Truck,
  RotateCcw,
  Shield
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TopNavigationBar from "@/components/TopNavigationBar";
import MainHeader from "@/components/MainHeader";
import CategoryNavigation from "@/components/CategoryNavigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import OptimizedImage from "@/components/OptimizedImage";

export default function Cart() {
  const [location, setLocation] = useLocation();
  const { 
    cartItems, 
    cart, 
    appliedCoupon, 
    isLoading, 
    error, 
    updateItem, 
    removeItem,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    isRemovingCoupon,
    couponError 
  } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    updateItem({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product?.price || '0');
    return total + (price * item.quantity);
  }, 0);
  
  const discountAmount = parseFloat(cart?.discountAmount || '0');
  const shipping = subtotal > 50 ? 0 : 7.99; // Free shipping over $50
  const tax = (subtotal - discountAmount) * 0.0875; // 8.75% tax on discounted amount
  const total = subtotal - discountAmount + shipping + tax;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }
    
    applyCoupon(promoCode, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Coupon applied successfully!"
        });
        setPromoCode('');
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to apply coupon",
          variant: "destructive"
        });
      }
    });
  };

  // Handle coupon removal
  const handleRemoveCoupon = async () => {
    removeCoupon(undefined, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Coupon removed successfully!"
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to remove coupon",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Error loading cart: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Page Header */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <ShoppingCartIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="ml-2">
              {cartItems.reduce((total, item) => total + item.quantity, 0)} items
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingCartIcon className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some professional medical uniforms to get started
            </p>
            <Button size="lg" onClick={() => setLocation('/')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
              
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      {/* Images are not available in cart items */}
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{item.product?.name}</h3>
                          <p className="text-sm text-muted-foreground">Unknown Brand</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>Quantity: {item.quantity}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-semibold">
                            ${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                          </div>
                          {item.product?.comparePrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ${(parseFloat(item.product.comparePrice) * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-2">
                        Discount ({appliedCoupon.code})
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          disabled={isRemovingCoupon}
                          className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                          data-testid="button-remove-coupon"
                        >
                          ×
                        </Button>
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                {!appliedCoupon && (
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        disabled={isApplyingCoupon}
                        data-testid="input-promo-code"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !promoCode.trim()}
                        data-testid="button-apply-coupon"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-500 mt-2" data-testid="text-coupon-error">
                        {(couponError as Error).message}
                      </p>
                    )}
                  </div>
                )}

                {/* Checkout Button */}
                <Link href="/checkout" className={buttonVariants({ size: 'lg' }) + " w-full mt-6"}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout
                </Link>
              </Card>

              {/* Shipping Info */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      On orders over $50. Standard delivery in 3-5 business days.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
