import { useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  User,
  Ticket,
  FileText,
  Star,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import admin components and hooks
import DashboardContent from "@/components/admin/DashboardContent";
import { useAdminAuth, withAdminAuth } from "@/contexts/AdminAuthContext";
import OrderManagement from "./OrderManagement";
import OrderDetails from "./OrderDetails";

// Placeholder components for routes that will be implemented later
const ProductManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Product Management</h2><p>Coming Soon</p></div>;
const CustomerManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Customer Management</h2><p>Coming Soon</p></div>;
const CategoryManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Category Management</h2><p>Coming Soon</p></div>;
const CouponManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Coupon Management</h2><p>Coming Soon</p></div>;
const BlogPostManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Blog Management</h2><p>Coming Soon</p></div>;
const ReviewManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Review Management</h2><p>Coming Soon</p></div>;
const CollectionManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Collection Management</h2><p>Coming Soon</p></div>;
const RefundManagement = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Refund Management</h2><p>Coming Soon</p></div>;
const MessagesPage = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Messages</h2><p>Coming Soon</p></div>;

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Users },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Blog Posts", href: "/blog-posts", icon: FileText },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Collections", href: "/collections", icon: Archive },
  { name: "Refunds", href: "/refunds", icon: MessageSquare },
  { name: "Messages", href: "/messages", icon: Settings },
];

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAdminAuth();

  
  // Get the current path for active link detection
  const currentPath = location.startsWith('/admin') ? location.substring(6) || '/' : '/';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed top-4 left-4 z-50 bg-white lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-4">
              <h1 className="text-xl font-bold text-primary">DEV Egypt Admin</h1>
            </div>
            <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.name}
                    to={`/admin${item.href}`}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-primary">DEV Egypt Admin</h1>
          </div>
          <nav className="flex flex-1 flex-col" aria-label="Main navigation">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={`/admin${item.href}`}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                            isActive
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 w-full">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="flex flex-1" onSubmit={(e) => e.preventDefault()}>
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-white pl-8 shadow-none border-gray-300 focus:border-primary transition-colors"
                  />
                </div>
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName || 'Admin User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email || 'admin@devegypt.com'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Switch>
              <Route path="/admin" component={DashboardContent} />
              <Route path="/admin/" component={DashboardContent} />
              <Route path="/admin/orders" component={OrderManagement} />
              <Route path="/admin/orders*" component={OrderManagement} />
              <Route path="/admin/products" component={ProductManagement} />
              <Route path="/admin/categories" component={CategoryManagement} />
              <Route path="/admin/customers" component={CustomerManagement} />
              <Route path="/admin/coupons" component={CouponManagement} />
              <Route path="/admin/blog-posts" component={BlogPostManagement} />
              <Route path="/admin/reviews" component={ReviewManagement} />
              <Route path="/admin/collections" component={CollectionManagement} />
              <Route path="/admin/refunds" component={RefundManagement} />
              <Route path="/admin/messages" component={MessagesPage} />
              <Route>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                  <p>Current path: {location}</p>
                  <p>No matching route found for this admin page.</p>
                </div>
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

// Export with authentication protection
export default withAdminAuth(AdminDashboard);