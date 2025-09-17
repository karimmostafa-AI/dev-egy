import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Heart, 
  Bell, 
  Shield, 
  LogOut,
  Edit3,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

// Mock data for user information
const mockUser = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  joinDate: "January 2023",
  avatar: "/images/avatar.png"
};

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    total: 89.99,
    status: "Delivered",
    items: 3
  },
  {
    id: "ORD-002",
    date: "2023-04-22",
    total: 124.50,
    status: "Delivered",
    items: 5
  },
  {
    id: "ORD-003",
    date: "2023-03-10",
    total: 67.25,
    status: "Processing",
    items: 2
  }
];

// Mock data for saved addresses
const mockAddresses = [
  {
    id: 1,
    name: "Home",
    address: "123 Medical Center Drive, New York, NY 10001",
    isDefault: true
  },
  {
    id: 2,
    name: "Work",
    address: "456 Hospital Plaza, New York, NY 10002",
    isDefault: false
  }
];

// Mock data for wishlist items
const mockWishlist = [
  {
    id: 1,
    name: "Cherokee Workwear Scrub Set",
    price: 49.99,
    image: "/images/scrub-set.jpg"
  },
  {
    id: 2,
    name: "Crocs Women's Scrub Shoes",
    price: 39.99,
    image: "/images/scrub-shoes.jpg"
  }
];

export default function AccountDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50";
      case "Processing":
        return "text-yellow-600 bg-yellow-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div>
                  <CardTitle className="text-lg">{mockUser.name}</CardTitle>
                  <CardDescription>{mockUser.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === "overview" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("overview")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Account Overview
                  </Button>
                  <Button 
                    variant={activeTab === "orders" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                  <Button 
                    variant={activeTab === "addresses" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </Button>
                  <Button 
                    variant={activeTab === "payment" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("payment")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </Button>
                  <Button 
                    variant={activeTab === "wishlist" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setLocation("/")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>
              
              {/* Account Overview */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">+3 from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-xs text-muted-foreground">1 default address</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your most recent orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Order {order.id}</div>
                            <div className="text-sm text-muted-foreground">{order.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${order.total.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">{order.items} items</div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("orders")}>
                      View All Orders
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Orders */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>View your order history and track shipments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div>
                              <div className="font-medium">Order {order.id}</div>
                              <div className="text-sm text-muted-foreground">{order.date} • {order.items} items</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium">${order.total.toFixed(2)}</div>
                              <div className={`text-sm flex items-center gap-1 ${getStatusClass(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Addresses</CardTitle>
                    <CardDescription>Manage your shipping and billing addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAddresses.map((address) => (
                        <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{address.name}</div>
                              {address.isDefault && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground mt-1">{address.address}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4">Add New Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods */}
              <TabsContent value="payment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div>
                            <div className="font-medium">Visa ending in 1234</div>
                            <div className="text-muted-foreground">Expires 12/25</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Add Payment Method</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wishlist</CardTitle>
                    <CardDescription>Your saved items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockWishlist.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-primary font-medium">${item.price.toFixed(2)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm">Add to Cart</Button>
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}