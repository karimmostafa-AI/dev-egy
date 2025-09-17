import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Heart,
  Eye,
  BarChart3
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock data for all analytics
const kpiData = [
  { 
    title: "Total Products", 
    value: "1,245", 
    change: "+12%", 
    changeType: "increase",
    icon: Package,
    description: "Active products in store"
  },
  { 
    title: "Total Customers", 
    value: "12,450", 
    change: "+8%", 
    changeType: "increase",
    icon: Users,
    description: "Registered customers"
  },
  { 
    title: "Total Orders", 
    value: "8,923", 
    change: "+15%", 
    changeType: "increase",
    icon: ShoppingCart,
    description: "All time orders"
  },
  { 
    title: "Total Earnings", 
    value: "$124,560", 
    change: "+22%", 
    changeType: "increase",
    icon: DollarSign,
    description: "Lifetime revenue"
  },
];

const orderStatusData = [
  { name: "Confirmed Orders", value: "7,200", status: "confirmed", change: "+5%" },
  { name: "Pending Orders", value: "450", status: "pending", change: "+2%" },
  { name: "Processing Orders", value: "320", status: "processing", change: "+3%" },
  { name: "Pick Up Orders", value: "180", status: "pickup", change: "+1%" },
  { name: "On The Way Orders", value: "210", status: "ontheway", change: "+4%" },
  { name: "Delivered Orders", value: "7,500", status: "delivered", change: "+18%" },
  { name: "Cancelled Orders", value: "123", status: "cancelled", change: "-1%" },
];

const withdrawalData = [
  { name: "Pending Withdrawals", value: "1,200", status: "pending", change: "+3%" },
  { name: "Rejected Withdrawals", value: "80", status: "rejected", change: "-2%" },
];

const todayEarningsData = [
  { name: "Today's Earnings", value: "$2,450", change: "+8%", changeType: "increase" },
];

const visitsData = [
  { name: "Total Visits Today", value: "1,245", change: "+12%", changeType: "increase" },
];

const recentOrders = [
  { id: "#1001", date: "2023-05-15", customer: "John Doe", brand: "MediWear", amount: "$245.00", status: "Delivered" },
  { id: "#1002", date: "2023-05-14", customer: "Jane Smith", brand: "NursePro", amount: "$1,200.00", status: "Processing" },
  { id: "#1003", date: "2023-05-14", customer: "Robert Johnson", brand: "ScrubsInc", amount: "$89.99", status: "Pending" },
  { id: "#1004", date: "2023-05-13", customer: "Emily Davis", brand: "MediWear", amount: "$345.50", status: "Confirmed" },
  { id: "#1005", date: "2023-05-12", customer: "Michael Wilson", brand: "NursePro", amount: "$560.75", status: "Delivered" },
];

const topBrands = [
  { name: "MediWear", sales: "$45,230", change: "+12%", products: 124 },
  { name: "NursePro", sales: "$38,450", change: "+8%", products: 98 },
  { name: "ScrubsInc", sales: "$28,760", change: "+15%", products: 87 },
  { name: "HealthGear", sales: "$22,100", change: "+5%", products: 65 },
  { name: "UniformPlus", sales: "$18,900", change: "+10%", products: 54 },
];

const wishlistProducts = [
  { name: "Premium Scrub Set", wishlist: 1245, category: "Scrubs" },
  { name: "Comfort Fit Lab Coat", wishlist: 987, category: "Lab Coats" },
  { name: "Slip Resistant Shoes", wishlist: 876, category: "Footwear" },
  { name: "Designer Scrub Cap", wishlist: 754, category: "Accessories" },
  { name: "Ergonomic Stethoscope", wishlist: 654, category: "Accessories" },
];

const bestSellingProducts = [
  { name: "Classic Navy Scrubs", sold: 1250, revenue: "$24,500" },
  { name: "Pink Floral Scrubs", sold: 980, revenue: "$19,600" },
  { name: "Black Lab Coat", sold: 750, revenue: "$22,500" },
  { name: "Comfort Fit Shoes", sold: 620, revenue: "$18,600" },
  { name: "Designer Scrub Cap", sold: 540, revenue: "$8,100" },
];

export default function EnhancedDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here you can find all the analytics you need.
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center mt-1">
                  {item.changeType === "increase" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : item.changeType === "decrease" ? (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <Minus className="h-3 w-3 text-gray-500 mr-1" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {item.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Earnings and Visits */}
      <div className="grid gap-4 md:grid-cols-2">
        {todayEarningsData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.name}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-muted-foreground">
                  {item.change} from yesterday
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {visitsData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.name}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-muted-foreground">
                  {item.change} from yesterday
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {orderStatusData.map((item, index) => (
          <Card key={index} className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center mt-1">
                {item.change.startsWith("+") ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className="text-xs text-muted-foreground">
                  {item.change} from last week
                </span>
              </div>
              <Badge 
                className={`mt-2 ${
                  item.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  item.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                  item.status === "processing" ? "bg-indigo-100 text-indigo-800" :
                  item.status === "pickup" ? "bg-purple-100 text-purple-800" :
                  item.status === "ontheway" ? "bg-orange-100 text-orange-800" :
                  item.status === "delivered" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Withdrawal Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {withdrawalData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.name}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center mt-1">
                {item.change.startsWith("+") ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className="text-xs text-muted-foreground">
                  {item.change} from last week
                </span>
              </div>
              <Badge 
                className={`mt-2 ${
                  item.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Graphs Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>
              Monthly sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">
                  Sales chart visualization would appear here
                </p>
                <p className="text-xs text-gray-400">
                  (Using Recharts library in final implementation)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Last 5 orders processed
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.brand}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                          order.status === "Processing" ? "bg-indigo-100 text-indigo-800" :
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {order.status}
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
      </div>

      {/* Top Selling Brands */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Brands</CardTitle>
            <CardDescription>
              Best performing brands by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBrands.map((brand, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div>
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-sm text-muted-foreground">{brand.products} products</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{brand.sales}</div>
                    <div className="flex items-center text-xs text-green-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {brand.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Wishlist Products */}
        <Card>
          <CardHeader>
            <CardTitle>Most Wishlisted Products</CardTitle>
            <CardDescription>
              Products most added to wishlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wishlistProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-medium">{product.wishlist}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Selling Products */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>
              Top products by units sold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestSellingProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}