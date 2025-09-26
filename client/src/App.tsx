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
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

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
const ProductManagement = lazy(() => import("@/pages/ProductManagement"));
const Search = lazy(() => import("@/pages/Search"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const Brands = lazy(() => import("@/pages/Brands"));
const Collections = lazy(() => import("@/pages/Collections"));
const CollectionDetail = lazy(() => import("@/pages/CollectionDetail"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const OrderTracking = lazy(() => import("@/pages/OrderTracking"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return <LoadingSpinner data-testid="protected-route-loading" />;
  }

  if (!user) {
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', location);
    setLocation('/auth');
    return null;
  }

  return <div data-testid="protected-route-authenticated"><Component /></div>;
}

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
          <Route path="/search" component={Search} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/checkout">
            <ProtectedRoute component={CheckoutPage} />
          </Route>
          <Route path="/order-success" component={OrderSuccessPage} />
          <Route path="/scrubs" component={Scrubs} />
          <Route path="/lab-coats" component={LabCoats} />
          <Route path="/shoes" component={Shoes} />
          <Route path="/accessories" component={Accessories} />
          <Route path="/account">
            <ProtectedRoute component={AccountDashboard} />
          </Route>
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/brand/:slug" component={BrandPage} />
          <Route path="/brands" component={Brands} />
          <Route path="/wishlist">
            <ProtectedRoute component={Wishlist} />
          </Route>
          <Route path="/orders/:id">
            <ProtectedRoute component={OrderDetails} />
          </Route>
          <Route path="/collections" component={Collections} />
          <Route path="/collections/:slug" component={CollectionDetail} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/order-tracking" component={OrderTracking} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/debug" component={() => {
            const token = localStorage.getItem('admin_token');
            const user = localStorage.getItem('admin_user');
            let parsedUser = null;
            try {
              parsedUser = user ? JSON.parse(user) : null;
            } catch (e) {
              parsedUser = 'INVALID JSON';
            }
            return (
              <div style={{padding: '20px', backgroundColor: 'yellow'}}>
                <h1>DEBUG: Admin Route Working</h1>
                <p>Current path: {window.location.pathname}</p>
                <p>Admin token exists: {token ? 'YES' : 'NO'}</p>
                <p>Admin token value: {token ? token.substring(0, 20) + '...' : 'null'}</p>
                <p>Admin user exists: {user ? 'YES' : 'NO'}</p>
                <p>Admin user role: {parsedUser?.role || 'NO ROLE'}</p>
                <p>isAuthenticated would be: {!!(parsedUser && token) ? 'TRUE' : 'FALSE'}</p>
                <pre>{JSON.stringify(parsedUser, null, 2)}</pre>
              </div>
            );
          }} />
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
      <AuthProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
