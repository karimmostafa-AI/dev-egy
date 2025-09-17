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
import AuthPage from "@/pages/Auth";
import CheckoutPage from "@/pages/Checkout";
import OrderSuccessPage from "@/pages/OrderSuccess";
import Scrubs from "@/pages/Scrubs";
import LabCoats from "@/pages/LabCoats";
import Shoes from "@/pages/Shoes";
import Accessories from "@/pages/Accessories";
import AccountDashboard from "@/pages/AccountDashboard";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BrandPage from "@/pages/BrandPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mens-products" component={MensProducts} />
      <Route path="/womens-products" component={WomensProducts} />
      <Route path="/new-arrivals" component={NewArrivals} />
      <Route path="/scrubs" component={Scrubs} />
      <Route path="/lab-coats" component={LabCoats} />
      <Route path="/shoes" component={Shoes} />
      <Route path="/accessories" component={Accessories} />
      <Route path="/account" component={AccountDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/brands/:name" component={BrandPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/admin/*" component={AdminDashboard} />
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
