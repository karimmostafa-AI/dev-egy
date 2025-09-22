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
  X,
  Search,
  Bell,
  User,
  PieChart,
  Ticket,
  FileText,
  Star,
  Archive,
  Warehouse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// Import recharts components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
// Import admin hooks
import {
  useDashboardAnalytics,
  useOrders,
  useProducts,
  useCategories,
  useRefunds,
  useCustomers,
  useCoupons,
  useBlogPosts,
  useReviews,
  useCollections
} from "@/hooks/admin/useAdmin";
// Import admin pages
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import AllCategories from "./AllCategories";
import AddSubCategory from "./AddSubCategory";
import EditSubCategory from "./EditSubCategory";
import { handleApiError, handleSuccess } from "@/lib/errorHandler";
import InventoryManagement from "./InventoryManagement";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Users },
  { name: "Sub-Categories", href: "/subcategories", icon: BarChart3 },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Blog Posts", href: "/blog-posts", icon: FileText },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Collections", href: "/collections", icon: Archive },
  { name: "Refunds", href: "/refunds", icon: MessageSquare },
  { name: "Messages", href: "/messages", icon: Settings },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Get the current path for active link detection
  const currentPath = location.startsWith('/admin') ? location.substring(6) || '/' : '/';

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
                <button 
                  className="flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                  Logout
                </button>
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
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">admin@devegypt.com</p>
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
                    <DropdownMenuItem>
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
              <Route path="/admin/orders" component={OrderManagement} />
              <Route path="/admin/products" component={ProductManagement} />
              <Route path="/admin/products/add" component={AddProduct} />
              <Route path="/admin/products/edit/:id" component={EditProduct} />
              <Route path="/admin/categories" component={AllCategories} />
              <Route path="/admin/categories/add" component={AddCategory} />
              <Route path="/admin/categories/edit/:id" component={EditCategory} />
              <Route path="/admin/subcategories" component={SubCategoryManagement} />
              <Route path="/admin/subcategories/add" component={AddSubCategory} />
              <Route path="/admin/subcategories/edit/:id" component={EditSubCategory} />
              <Route path="/admin/customers" component={CustomerManagement} />
              <Route path="/admin/coupons" component={CouponManagement} />
              <Route path="/admin/blog-posts" component={BlogPostManagement} />
              <Route path="/admin/reviews" component={ReviewManagement} />
              <Route path="/collections" component={CollectionManagement} />
              <Route path="/refunds" component={RefundManagement} />
              <Route path="/messages" component={MessagesPage} />
              <Route path="/inventory" component={InventoryManagement} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

// Define interfaces for data structures
interface OrderStatusDistributionItem {
  name: string;
  value: number;
}

interface BrandData {
  name: string;
  sales: string;
  change: string;
}

interface WishlistProduct {
  name: string;
  wishlist: string;
  category: string;
}

interface SellingProduct {
  name: string;
  sales: string;
  revenue: string;
}

interface Order {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  paymentMethod: string;
  brand: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  isAvailable: boolean;
  category?: {
    name: string;
  };
  images?: Array<{
    url: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  parentId?: string;
}

interface Refund {
  id: string;
  date: string;
  customer: string;
  brand: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minimumAmount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  isPublished: boolean;
  publishedAt: string;
}

interface Review {
  id: string;
  productName: string;
  userName: string;
  rating: number;
  title: string;
  isApproved: boolean;
  createdAt: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  productsCount: number;
  image: string;
}

function DashboardContent() {
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Fetch dashboard analytics data
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useDashboardAnalytics();
  
  // Recent Orders
  const { data: ordersData } = useOrders({ limit: 5 });
  
  // Fetch all products for inventory summary
  const { data: productsData } = useProducts({ limit: 1000 });
  const products = productsData?.products || [];
  
  if (analyticsLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }
  
  if (analyticsError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading dashboard data: {analyticsError.message}</div>;
  }
  
  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
  };
  
  // KPI Data
  const kpiData = [
    { 
      name: "Total Products", 
      value: analyticsData?.totalProducts?.toLocaleString() || "0", 
      change: analyticsData?.productsChange ? `${analyticsData.productsChange >= 0 ? '+' : ''}${analyticsData.productsChange.toFixed(0)}% from last month` : "+12% from last month" 
    },
    { 
      name: "Total Customers", 
      value: analyticsData?.totalCustomers?.toLocaleString() || "0", 
      change: analyticsData?.customersChange ? `${analyticsData.customersChange >= 0 ? '+' : ''}${analyticsData.customersChange.toFixed(0)}% from last month` : "+8% from last month" 
    },
    { 
      name: "Total Orders", 
      value: analyticsData?.totalOrders?.toLocaleString() || "0", 
      change: analyticsData?.ordersChange ? `${analyticsData.ordersChange >= 0 ? '+' : ''}${analyticsData.ordersChange.toFixed(0)}% from last month` : "+15% from last month" 
    },
  ];

  // Order Status Data
  const orderStatusData = [
    { name: "Confirmed Orders", value: analyticsData?.confirmedOrders?.toLocaleString() || "0", status: "confirmed" },
    { name: "Pending Orders", value: analyticsData?.pendingOrders?.toLocaleString() || "0", status: "pending" },
    { name: "Processing Orders", value: analyticsData?.processingOrders?.toLocaleString() || "0", status: "processing" },
    { name: "Pick Up Orders", value: analyticsData?.pickupOrders?.toLocaleString() || "0", status: "pickup" },
    { name: "On The Way Orders", value: analyticsData?.onTheWayOrders?.toLocaleString() || "0", status: "ontheway" },
    { name: "Delivered Orders", value: analyticsData?.deliveredOrders?.toLocaleString() || "0", status: "delivered" },
    { name: "Cancelled Orders", value: analyticsData?.cancelledOrders?.toLocaleString() || "0", status: "cancelled" },
  ];

  // Earnings and Withdrawals Data
  const earningsData = [
    { 
      name: "Total Earnings", 
      value: `${(analyticsData?.totalEarnings || 0).toLocaleString()}`, 
      change: analyticsData?.earningsChange ? `${analyticsData.earningsChange >= 0 ? '+' : ''}${analyticsData.earningsChange.toFixed(0)}% from last month` : "+22% from last month" 
    },
    { 
      name: "Today's Earnings", 
      value: `${(analyticsData?.todayEarnings || 0).toLocaleString()}`, 
      change: analyticsData?.todayEarningsChange ? `${analyticsData.todayEarningsChange >= 0 ? '+' : ''}${analyticsData.todayEarningsChange.toFixed(0)}% from yesterday` : "+5% from yesterday" 
    },
  ];

  const withdrawalData = [
    { name: "Pending Withdrawals", value: `${(analyticsData?.pendingWithdrawals || 0).toLocaleString()}`, change: "3 requests" },
    { name: "Rejected Withdrawals", value: `${(analyticsData?.rejectedWithdrawals || 0).toLocaleString()}`, change: "1 request" },
  ];

  // Charts Data
  const salesTrends = analyticsData?.salesTrends || [];
  const orderStatusDistribution = analyticsData?.orderStatusDistribution || [];

  // Recent Orders
  const recentOrders = ordersData?.orders || [];

  // Top Brands (from real data or mock if not available)
  const topBrands = analyticsData?.topBrands || [
    { name: "MediWear", sales: "$24,500", change: "+12%" },
    { name: "NursePro", sales: "$18,900", change: "+8%" },
    { name: "ScrubsInc", sales: "$15,200", change: "+5%" },
    { name: "HealthFirst", sales: "$12,800", change: "+7%" },
    { name: "CarePlus", sales: "$9,600", change: "+3%" },
  ];

  // Wishlist Products (from real data or mock if not available)
  const wishlistProducts = analyticsData?.wishlistProducts || [
    { name: "Premium Scrub Set", wishlist: "1,245", category: "Scrubs" },
    { name: "ComfortFit Lab Coat", wishlist: "890", category: "Lab Coats" },
    { name: "Slip-Resistant Shoes", wishlist: "720", category: "Footwear" },
    { name: "Ergonomic Stethoscope", wishlist: "650", category: "Accessories" },
    { name: "Compression Socks", wishlist: "580", category: "Accessories" },
  ];

  // Top Selling Products (from real data or mock if not available)
  const topSellingProducts = analyticsData?.topSellingProducts || [
    { name: "Classic Fit Scrubs", sales: "1,450", revenue: "$29,000" },
    { name: "Professional Lab Coat", sales: "980", revenue: "$19,600" },
    { name: "Nursing Clogs", sales: "760", revenue: "$15,200" },
    { name: "ID Badge Holder", sales: "1,200", revenue: "$2,400" },
    { name: "Medical Compression Socks", sales: "650", revenue: "$6,500" },
  ];

  // Visit Analysis (from real data or mock if not available)
  const visitData = analyticsData?.visitData || [
    { time: "00:00", visits: 120 },
    { time: "04:00", visits: 80 },
    { time: "08:00", visits: 320 },
    { time: "12:00", visits: 450 },
    { time: "16:00", visits: 380 },
    { time: "20:00", visits: 290 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-700">
            Welcome to your admin dashboard. Here you can manage your store and view analytics.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* KPI Cards - Grid of 3 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Order Status Breakdown - Grid of 7 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-7">
        {orderStatusData.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <Badge 
                className={cn(
                  "mt-1",
                  item.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                  item.status === "confirmed" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                  item.status === "processing" ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" :
                  item.status === "pickup" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                  item.status === "ontheway" ? "bg-orange-100 text-orange-800 hover:bg-orange-100" :
                  item.status === "delivered" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                  "bg-red-100 text-red-800 hover:bg-red-100"
                )}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Earnings and Withdrawals - Grid of 4 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {earningsData.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
        {withdrawalData.map((item, index) => (
          <Card key={index + 2} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>
              Monthly sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesTrends}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>
              Distribution of order statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusDistribution.map((entry: OrderStatusDistributionItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders Table */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Last 5 orders in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order: Order, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>${order.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        order.status === "confirmed" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                        order.status === "processing" ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" :
                        "bg-green-100 text-green-800 hover:bg-green-100"
                      )}
                    >
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Top Selling Brands and Wishlist Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Selling Brands */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Selling Brands</CardTitle>
            <CardDescription>
              Best performing brands by sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBrands.map((brand: BrandData, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.sales}</TableCell>
                    <TableCell>
                      <span className="text-green-600">{brand.change}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Most Wishlisted Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Most Wishlisted Products</CardTitle>
            <CardDescription>
              Products most added to wishlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Wishlist</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlistProducts.map((product: WishlistProduct, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.wishlist}</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Most Selling Products and Visit Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most Selling Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Most Selling Products</CardTitle>
            <CardDescription>
              Top performing products by sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.map((product: SellingProduct, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Visit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visitData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                    name="Visits" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>
              Quick overview of product inventory levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{products.filter((p: any) => p.inventoryQuantity > 10).length}</div>
                <div className="text-sm text-green-700">Well Stocked</div>
                <div className="text-xs text-muted-foreground">More than 10 units</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{products.filter((p: any) => p.inventoryQuantity > 0 && p.inventoryQuantity <= 10).length}</div>
                <div className="text-sm text-yellow-700">Low Stock</div>
                <div className="text-xs text-muted-foreground">1-10 units remaining</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{products.filter((p: any) => p.inventoryQuantity === 0 || !p.isAvailable).length}</div>
                <div className="text-sm text-red-700">Out of Stock</div>
                <div className="text-xs text-muted-foreground">Sold out or inactive</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{products.reduce((total: number, p: any) => total + (p.inventoryQuantity || 0), 0)}</div>
                <div className="text-sm text-blue-700">Total Units</div>
                <div className="text-xs text-muted-foreground">Across all products</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrderManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch orders based on active tab
  const { data: ordersData, isLoading, error } = useOrders({ 
    status: activeTab === "all" ? undefined : activeTab,
    page,
    limit
  });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading orders: {error.message}</div>;
  }
  
  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all orders in your store.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="pickup">Pick Up</TabsTrigger>
          <TabsTrigger value="ontheway">On the Way</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all" ? "All Orders" : 
                 activeTab === "pending" ? "Pending Orders" :
                 activeTab === "confirmed" ? "Confirmed Orders" :
                 activeTab === "processing" ? "Processing Orders" :
                 activeTab === "pickup" ? "Pick Up Orders" :
                 activeTab === "ontheway" ? "On the Way Orders" :
                 activeTab === "delivered" ? "Delivered Orders" :
                 "Cancelled Orders"}
              </CardTitle>
              <CardDescription>
                Manage all orders in your store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order: Order, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.brand}</TableCell>
                        <TableCell>${order.amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              order.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                              order.status === "processing" ? "bg-indigo-100 text-indigo-800" :
                              order.status === "pickup" ? "bg-purple-100 text-purple-800" :
                              order.status === "ontheway" ? "bg-orange-100 text-orange-800" :
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            )}
                          >
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch products
  const { data: productsData, isLoading, error } = useProducts({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading products: {error.message}</div>;
  }
  
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all products in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your product inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search products..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/admin/products/add">
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product: Product, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="w-16 h-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">#{product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "N/A"}</TableCell>
                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>{product.inventoryQuantity}</TableCell>
                    <TableCell>
                      <Badge className={product.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {product.isAvailable ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/products/edit/${product.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch categories
  const { data: categoriesData, isLoading, error } = useCategories();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading categories...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading categories: {error.message}</div>;
  }
  
  const categories = categoriesData || [];
  
  // Filter categories based on search term
  const filteredCategories = categories.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all categories in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your product categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search categories..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/admin/categories/add">
                <Users className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category: Category, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{category.description || "No description"}</TableCell>
                    <TableCell>{category.productsCount || 0}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/categories/edit/${category.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SubCategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch categories (subcategories are categories with parentId)
  const { data: categoriesData, isLoading, error } = useCategories();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading sub-categories...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading sub-categories: {error.message}</div>;
  }
  
  // Filter to only show subcategories (categories with parentId)
  const subCategories = categoriesData?.filter((category: any) => category.parentId) || [];
  
  // Filter subcategories based on search term
  const filteredSubCategories = subCategories.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sub-Category Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all sub-categories in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sub-Categories</CardTitle>
          <CardDescription>
            Manage your product sub-categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search sub-categories..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/admin/subcategories/add">
                <BarChart3 className="mr-2 h-4 w-4" />
                Add Sub-Category
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub-Category</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((subcategory: Category, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="font-medium">{subcategory.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {categoriesData?.find((cat: Category) => cat.id === subcategory.parentId)?.name || "Unknown"}
                    </TableCell>
                    <TableCell>{subcategory.description || "No description"}</TableCell>
                    <TableCell>{subcategory.productsCount || 0}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/subcategories/edit/${subcategory.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No sub-categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RefundManagement() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch refunds
  const { data: refundsData, isLoading, error } = useRefunds({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading refunds...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading refunds: {error.message}</div>;
  }
  
  const refunds = refundsData?.refunds || [];
  const pagination = refundsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all refunds in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Refunds</CardTitle>
          <CardDescription>
            Manage customer refund requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.length > 0 ? (
                refunds.map((refund: Refund, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{refund.id}</TableCell>
                    <TableCell>{refund.date}</TableCell>
                    <TableCell>{refund.customer}</TableCell>
                    <TableCell>{refund.brand}</TableCell>
                    <TableCell>${refund.amount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          refund.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          refund.status === "approved" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        )}
                      >
                        {refund.status?.charAt(0).toUpperCase() + refund.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{refund.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No refunds found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} refunds
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch customers
  const { data: customersData, isLoading, error } = useCustomers({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading customers...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading customers: {error.message}</div>;
  }
  
  const customers = customersData?.customers || [];
  const pagination = customersData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all customers in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Manage your customer accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search customers..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer: Customer, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CouponManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch coupons
  const { data: couponsData, isLoading, error } = useCoupons({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading coupons...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading coupons: {error.message}</div>;
  }
  
  const coupons = couponsData?.coupons || [];
  const pagination = couponsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all coupons in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>
            Manage your discount coupons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search coupons..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Ticket className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Minimum Amount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length > 0 ? (
                coupons.map((coupon: Coupon, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell>{coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}`}</TableCell>
                    <TableCell>{coupon.minimumAmount ? `${coupon.minimumAmount}` : 'N/A'}</TableCell>
                    <TableCell>{coupon.usedCount}/{coupon.usageLimit || '∞'}</TableCell>
                    <TableCell>
                      <Badge className={coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.startDate).toLocaleDateString()} - {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'No end date'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No coupons found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} coupons
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BlogPostManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch blog posts
  const { data: blogPostsData, isLoading, error } = useBlogPosts({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading blog posts...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading blog posts: {error.message}</div>;
  }
  
  const blogPosts = blogPostsData?.blogPosts || [];
  const pagination = blogPostsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Post Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all blog posts in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search blog posts..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/admin/blog-posts/add">
                <FileText className="mr-2 h-4 w-4" />
                Add Blog Post
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.length > 0 ? (
                blogPosts.map((post: BlogPost, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.excerpt || "No excerpt"}</TableCell>
                    <TableCell>
                      <Badge className={post.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {post.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/blog-posts/edit/${post.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No blog posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} blog posts
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch reviews
  const { data: reviewsData, isLoading, error } = useReviews({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading reviews...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading reviews: {error.message}</div>;
  }
  
  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all product reviews in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Manage customer product reviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search reviews..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length > 0 ? (
                reviews.map((review: Review, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{review.productName}</TableCell>
                    <TableCell>{review.userName}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>{review.title}</TableCell>
                    <TableCell>
                      <Badge className={review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">
                        {review.isApproved ? "Unapprove" : "Approve"}
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No reviews found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CollectionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch collections
  const { data: collectionsData, isLoading, error } = useCollections({ page, limit });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading collections...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading collections: {error.message}</div>;
  }
  
  const collections = collectionsData?.collections || [];
  const pagination = collectionsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collection Management</h1>
        <p className="mt-2 text-gray-700">
          Manage all product collections in your store.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>
            Manage your product collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search collections..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/admin/collections/add">
                <Archive className="mr-2 h-4 w-4" />
                Add Collection
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.length > 0 ? (
                collections.map((collection: Collection, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {collection.image ? (
                          <img 
                            src={collection.image} 
                            alt={collection.name} 
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        )}
                        <div className="font-medium">{collection.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{collection.description || "No description"}</TableCell>
                    <TableCell>
                      <Badge className={collection.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {collection.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{collection.productsCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/collections/edit/${collection.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No collections found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} collections
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MessagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-700">
          Communicate with customers.
        </p>
      </div>
      
      <div className="flex h-[calc(100vh-200px)] border rounded-lg bg-white">
        {/* Customer list */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="w-full appearance-none bg-white pl-8 shadow-none"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            <div className="p-4 border-b hover:bg-gray-50 cursor-pointer bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">Hello, I have a question...</div>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">2m ago</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">Online</div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  Hello, I have a question about my order.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                  Sure, how can I help you?
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}