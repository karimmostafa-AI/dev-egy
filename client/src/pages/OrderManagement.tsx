import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  Download, 
  Eye,
  Filter,
  MoreHorizontal,
  Settings,
  Calendar,
  FileSpreadsheet,
  RefreshCw,
  X,
  ArrowLeft,
  Loader2
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { exportFilteredOrders } from "@/lib/excelExporter";
import { generatePDFInvoice } from "@/lib/simplePdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/admin/useAdmin";
import OrderDetails from "./OrderDetails";

// Define interfaces for our data
interface OrderStatus {
  value: string;
  label: string;
}

const orderStatuses: OrderStatus[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirm", label: "Confirm" },
  { value: "processing", label: "Processing" },
  { value: "pickup", label: "Pickup" },
  { value: "ontheway", label: "On The Way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];


const statusColors: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700 border border-blue-200",
  confirm: "bg-green-50 text-green-700 border border-green-200",
  processing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  pickup: "bg-purple-50 text-purple-700 border border-purple-200",
  ontheway: "bg-orange-50 text-orange-700 border border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  // Fetch orders using the real API
  const { data: ordersResponse, isLoading, error, refetch } = useOrders({ 
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage, 
    limit: itemsPerPage 
  });

  // Extract orders from API response
  const ordersData = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination;

  // Client-side filtering for search and payment method (API handles status filter)
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = ordersData.filter((order: any) => {
      // Search filter
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Payment method filter
      const matchesPaymentMethod = paymentMethodFilter === "all" || order.paymentMethod === paymentMethodFilter;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const orderDate = new Date(order.date);
        if (dateRange.from && orderDate < dateRange.from) matchesDateRange = false;
        if (dateRange.to && orderDate > dateRange.to) matchesDateRange = false;
      }
      
      return matchesSearch && matchesPaymentMethod && matchesDateRange;
    });

    // Client-side sorting (API already handles pagination)
    filtered.sort((a: any, b: any) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          const amountA = parseFloat(a.amount?.toString().replace('$', '') || '0');
          const amountB = parseFloat(b.amount?.toString().replace('$', '') || '0');
          comparison = amountA - amountB;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [ordersData, searchTerm, paymentMethodFilter, dateRange, sortBy, sortOrder]);

  // Use the filtered orders directly since API handles pagination
  const paginatedOrders = filteredAndSortedOrders;
  const totalPages = pagination?.totalPages || 1;

  const paymentMethods = [...new Set(ordersData.map((order: any) => order.paymentMethod).filter(Boolean))];

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600 text-lg">Error loading orders: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Export functionality
  const handleExportOrders = () => {
    setIsLoading(true);
    try {
      exportFilteredOrders(
        filteredAndSortedOrders,
        searchTerm,
        statusFilter,
        `orders_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      );
      toast({
        title: "Export Successful",
        description: `${filteredAndSortedOrders.length} orders exported successfully!`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  // Handler functions for order actions
  const handleViewOrderDetails = (orderId: string) => {
    const orderNumber = orderId.replace('RC', '');
    setViewOrderId(orderNumber);
  };

  const handleDownloadInvoice = (order: Order) => {
    setIsLoading(true);
    try {
      // Convert Order to OrderDetail format for PDF generation
      const orderDetail = {
        id: order.id,
        orderStatus: order.status,
        paymentStatus: 'Pending', // Default status
        paymentMethod: order.paymentMethod,
        orderDate: order.date,
        deliveryDate: null,
        subTotal: parseFloat(order.amount.replace('$', '')) - 160, // Subtract taxes and delivery
        couponDiscount: 0,
        deliveryCharge: 20,
        vatTax: 140,
        grandTotal: parseFloat(order.amount.replace('$', '')),
        items: [{
          id: '1',
          productName: 'Sample Product',
          shop: order.shop,
          quantity: 1,
          size: 'Standard',
          color: 'Default',
          price: parseFloat(order.amount.replace('$', '')) - 160,
          total: parseFloat(order.amount.replace('$', '')) - 160,
          image: '/api/placeholder/60/60'
        }],
        customer: {
          name: order.customer,
          phone: '01000000000'
        },
        shipping: {
          name: order.customer,
          phone: '01000000000',
          addressType: 'Home',
          area: 'Area 1',
          roadNo: '',
          flatNo: '1',
          houseNo: '1',
          postCode: '10000',
          addressLine: 'Address Line 1',
          addressLine2: 'Address Line 2'
        }
      };
      
      generatePDFInvoice(orderDetail);
      toast({
        title: "Invoice Downloaded",
        description: `Invoice for order ${order.id} downloaded successfully!`,
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "Invoice Generation Failed",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to cancel the order
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      
      // Update the order status locally (in a real app, refetch data)
      const updatedOrders = ordersData.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      
      toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled successfully.`,
      });
      // In a real app, you would update the state or refetch data
      setTimeout(() => window.location.reload(), 1000); // Simple refresh for demo with delay
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: "Pending",
      confirm: "Confirmed", 
      processing: "Processing",
      pickup: "Pickup",
      ontheway: "On The Way",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    
    return (
      <Badge variant="secondary" className={`${statusColors[status] || "bg-gray-100 text-gray-800"} font-medium`}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  // If viewing order details, render OrderDetails component
  if (viewOrderId) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setViewOrderId(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Button>
        </div>
        <OrderDetails orderId={viewOrderId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
              <p className="text-gray-600">
                Manage and track all orders in your store.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">English</div>
              <div className="text-sm font-medium text-gray-900">Admin Tool</div>
            </div>
          </div>

          {/* Advanced Search and Filters */}
          <div className="bg-white p-4 rounded-lg border space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Order ID, Customer, or Shop..."
                  className="pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Payment Method Filter */}
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-48 h-10 justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} -{" "}
                          {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Date Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              {/* Reset Filters */}
              <Button variant="outline" onClick={resetFilters} className="h-10">
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Showing {paginatedOrders.length} of {filteredAndSortedOrders.length} orders
                </span>
                
                {/* Sort Options */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'amount' | 'status')}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="amount">Sort by Amount</SelectItem>
                    <SelectItem value="status">Sort by Status</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  disabled={isLoading}
                  className="h-8"
                >
                  <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                  Refresh
                </Button>
                
                <Button
                  onClick={handleExportOrders}
                  disabled={isLoading || filteredAndSortedOrders.length === 0}
                  className="h-8"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-100 p-1 rounded-lg">
              {orderStatuses.map((status) => (
                <TabsTrigger 
                  key={status.value} 
                  value={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={statusFilter} className="mt-6">
              <div className="rounded-lg border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="font-semibold text-gray-900 py-4">Order ID</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Order Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Shop</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Total Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Payment Method</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order: Order) => (
                          <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <TableCell className="font-semibold text-gray-900 py-4">{order.id}</TableCell>
                            <TableCell className="py-4 text-gray-700">{order.date}</TableCell>
                            <TableCell className="py-4 text-gray-700">{order.customer}</TableCell>
                            <TableCell className="py-4 text-gray-700">{order.shop}</TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{order.amount}</span>
                                {getStatusBadge(order.status)}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-gray-700">{order.paymentMethod}</TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-full"
                                  aria-label={`View details for order ${order.id}`}
                                  onClick={() => handleViewOrderDetails(order.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full"
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewOrderDetails(order.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDownloadInvoice(order)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleCancelOrder(order.id)}
                                    >
                                      Cancel Order
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-4xl">📦</div>
                              <div className="font-medium">No orders found</div>
                              <div className="text-sm">Try adjusting your search or filter criteria</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 
                        ? i + 1 
                        : currentPage + i - 2;
                      if (page > totalPages) return null;
                      
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={page === currentPage ? "bg-pink-600 hover:bg-pink-700" : ""}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}