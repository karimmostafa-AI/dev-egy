import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Download, 
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const orderStatuses = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "pickup", label: "Pick Up" },
  { value: "ontheway", label: "On the Way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const ordersData = [
  {
    id: "#1001",
    date: "2023-05-15",
    customer: "John Doe",
    brand: "MediWear",
    amount: "$245.00",
    status: "delivered",
    paymentMethod: "Credit Card",
  },
  {
    id: "#1002",
    date: "2023-05-14",
    customer: "Jane Smith",
    brand: "NursePro",
    amount: "$1,200.00",
    status: "processing",
    paymentMethod: "PayPal",
  },
  {
    id: "#1003",
    date: "2023-05-14",
    customer: "Robert Johnson",
    brand: "ScrubsInc",
    amount: "$89.99",
    status: "pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "#1004",
    date: "2023-05-13",
    customer: "Emily Davis",
    brand: "MediWear",
    amount: "$345.50",
    status: "confirmed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "#1005",
    date: "2023-05-12",
    customer: "Michael Wilson",
    brand: "NursePro",
    amount: "$560.75",
    status: "delivered",
    paymentMethod: "Credit Card",
  },
  {
    id: "#1006",
    date: "2023-05-11",
    customer: "Sarah Brown",
    brand: "LabGear",
    amount: "$1,120.00",
    status: "ontheway",
    paymentMethod: "PayPal",
  },
  {
    id: "#1007",
    date: "2023-05-10",
    customer: "David Miller",
    brand: "MediWear",
    amount: "$78.25",
    status: "cancelled",
    paymentMethod: "Credit Card",
  },
  {
    id: "#1008",
    date: "2023-05-09",
    customer: "Lisa Taylor",
    brand: "ScrubsInc",
    amount: "$430.00",
    status: "pickup",
    paymentMethod: "Bank Transfer",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  pickup: "bg-purple-100 text-purple-800",
  ontheway: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-2 text-gray-700">
          Manage and track all orders in your store.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <label htmlFor="search-orders" className="sr-only">
              Search orders
            </label>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
            <Input
              id="search-orders"
              placeholder="Search orders..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-describedby="search-orders-description"
            />
            <p id="search-orders-description" className="sr-only">
              Enter order ID, customer name, or brand to search
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {orderStatuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onSelect={() => setStatusFilter(status.value)}
                >
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button>
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Export Orders
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {orderStatuses.map((status) => (
            <TabsTrigger 
              key={status.value} 
              value={status.value}
              onClick={() => setStatusFilter(status.value)}
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={statusFilter} className="mt-6">
          <div className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
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
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.brand}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" aria-label={`View details for order ${order.id}`}>
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button variant="outline" size="sm" aria-label={`Download order ${order.id}`}>
                              <Download className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
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
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}