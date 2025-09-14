import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import MensProducts from "@/pages/MensProducts";
import WomensProducts from "@/pages/WomensProducts";
import NewArrivals from "@/pages/NewArrivals";
import Cart from "@/pages/Cart";
import ContactUs from "@/pages/ContactUs";
import FAQs from "@/pages/FAQs";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mens-products" component={MensProducts} />
      <Route path="/womens-products" component={WomensProducts} />
      <Route path="/new-arrivals" component={NewArrivals} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/product/:id" component={ProductDetail} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
