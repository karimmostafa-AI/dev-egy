import { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useTracking } from "@/hooks/useTracking";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const MensProducts = lazy(() => import("@/pages/MensProducts"));
const WomensProducts = lazy(() => import("@/pages/WomensProducts"));
const NewArrivals = lazy(() => import("@/pages/NewArrivals"));
const Cart = lazy(() => import("@/pages/Cart"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const FAQs = lazy(() => import("@/pages/FAQs"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const CheckoutPage = lazy(() => import("@/pages/Checkout"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccess"));
const Scrubs = lazy(() => import("@/pages/Scrubs"));
const LabCoats = lazy(() => import("@/pages/LabCoats"));
const Shoes = lazy(() => import("@/pages/Shoes"));
const Accessories = lazy(() => import("@/pages/Accessories"));
const AccountDashboard = lazy(() => import("@/pages/AccountDashboard"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const BrandPage = lazy(() => import("@/pages/BrandPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  // Initialize tracking
  useTracking();
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/mens" component={MensProducts} />
          <Route path="/womens" component={WomensProducts} />
          <Route path="/new-arrivals" component={NewArrivals} />
          <Route path="/cart" component={Cart} />
          <Route path="/contact" component={ContactUs} />
          <Route path="/faq" component={FAQs} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-success" component={OrderSuccessPage} />
          <Route path="/scrubs" component={Scrubs} />
          <Route path="/lab-coats" component={LabCoats} />
          <Route path="/shoes" component={Shoes} />
          <Route path="/accessories" component={Accessories} />
          <Route path="/account" component={AccountDashboard} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/brand/:slug" component={BrandPage} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/:rest*" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
