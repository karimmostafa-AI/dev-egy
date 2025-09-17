import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import TopNavigationBar from "@/components/TopNavigationBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

export default function OrderSuccessPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-40 bg-background border-b">
        <TopNavigationBar />
        <MainHeader />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-lg text-center p-8">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold mt-6">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order is being processed.
            </p>
            {orderId && (
              <p className="text-lg font-medium">
                Order ID: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span>
              </p>
            )}
            <Button size="lg" onClick={() => setLocation("/")} className="mt-6">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
