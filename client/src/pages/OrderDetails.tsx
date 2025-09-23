import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Download, FileText, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generatePDFInvoice } from "@/lib/simplePdfGenerator";

interface OrderItem {
  id: string;
  productName: string;
  shop: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  total: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  addressType: string;
  area: string;
  roadNo: string;
  flatNo: string;
  houseNo: string;
  postCode: string;
  addressLine: string;
  addressLine2: string;
}

interface OrderDetail {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string | null;
  items: OrderItem[];
  customer: CustomerInfo;
  shipping: ShippingAddress;
  subTotal: number;
  couponDiscount: number;
  deliveryCharge: number;
  vatTax: number;
  grandTotal: number;
}

// Mock data - replace with API call
const mockOrderData: OrderDetail = {
  id: "RC000132",
  orderStatus: "Cancelled",
  paymentStatus: "Pending",
  paymentMethod: "Cash Payment",
  orderDate: "Sep 23, 2025",
  deliveryDate: null,
  subTotal: 2800,
  couponDiscount: 0,
  deliveryCharge: 20,
  vatTax: 140,
  grandTotal: 2960,
  items: [
    {
      id: "1",
      productName: "FITVII Health & Fitness Tracker 2024 (Answer/Make Calls), Smart Watch with 24/7 Heart Rate and Blood Pressure, Sleep Tracking, Blood Oxygen Monitor",
      shop: "Echo Mart",
      quantity: 1,
      size: "32",
      color: "Blue",
      price: 2800,
      total: 2800,
      image: "/api/placeholder/60/60"
    }
  ],
  customer: {
    name: "Demo Customer",
    phone: "01000000405"
  },
  shipping: {
    name: "hurhmk",
    phone: "10827694818",
    addressType: "Home",
    area: "1",
    roadNo: "",
    flatNo: "2",
    houseNo: "55",
    postCode: "100221",
    addressLine: "1hy6 37h",
    addressLine2: "22 sijcn"
  }
};

const statusColors: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  processing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  pickup: "bg-purple-50 text-purple-700 border border-purple-200",
  ontheway: "bg-orange-50 text-orange-700 border border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

interface OrderDetailsProps {
  orderId?: string;
}

export default function OrderDetails({ orderId: propOrderId }: OrderDetailsProps = {}) {
  const [location, setLocation] = useLocation();
  const [orderData, setOrderData] = useState<OrderDetail>(mockOrderData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Use prop orderId if provided, otherwise extract from URL
  const orderId = propOrderId || (() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    return urlParams.get('view') || "132";
  })();
  
  
  // Update mock data based on the order ID
  useEffect(() => {
    if (orderId && orderId !== "132") {
      setOrderData(prev => ({
        ...prev,
        id: `RC${orderId.padStart(6, '0')}`
      }));
    }
  }, [orderId]);

  useEffect(() => {
    // Load order data based on orderId
    // In a real app, this would be an API call
    console.log("Loading order:", orderId);
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      // API call to update order status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setOrderData(prev => ({ ...prev, orderStatus: newStatus }));
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      // API call to update payment status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setOrderData(prev => ({ ...prev, paymentStatus: newStatus }));
    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadInvoice = () => {
    generatePDFInvoice(orderData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/admin/orders')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">English</div>
            <div className="text-sm font-medium text-gray-900">Admin Tool</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order Details</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => console.log("Payment slip")}
                    >
                      Payment Slip
                    </Button>
                    <Button 
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={handleDownloadInvoice}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Id:</label>
                    <p className="font-semibold">#{orderData.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Status:</label>
                    <Badge className={`${statusColors[orderData.orderStatus.toLowerCase()]} ml-2`}>
                      {orderData.orderStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Status:</label>
                    <p className="font-medium">{orderData.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Date:</label>
                    <p className="font-medium">{orderData.orderDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Method:</label>
                    <p className="font-medium">{orderData.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Delivery Date:</label>
                    <p className="font-medium">{orderData.deliveryDate || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SL</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Shop</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderData.items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={item.image} 
                                alt={item.productName}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <span className="font-medium max-w-md truncate">
                                {item.productName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{item.shop}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{backgroundColor: item.color.toLowerCase()}}>
                              {item.color}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell className="font-semibold">${item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Order Summary */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between">
                        <span>Sub Total</span>
                        <span>${orderData.subTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coupon Discount</span>
                        <span>${orderData.couponDiscount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Charge</span>
                        <span>${orderData.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT & Tax</span>
                        <span>${orderData.vatTax}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Grand Total</span>
                        <span>${orderData.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name:</label>
                    <p className="font-medium">{orderData.customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone:</label>
                    <p className="font-medium">{orderData.customer.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order & Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order & Shipping Info
                  <Edit3 className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Change Order Status</label>
                  <Select 
                    value={orderData.orderStatus.toLowerCase()} 
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="ontheway">On The Way</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <Select 
                    value={orderData.paymentStatus.toLowerCase()} 
                    onValueChange={handlePaymentStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{orderData.shipping.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{orderData.shipping.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600">Address Type:</span>
                    <p className="font-medium">{orderData.shipping.addressType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <p className="font-medium">{orderData.shipping.area}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-600">Road No.:</span>
                    <p className="font-medium">{orderData.shipping.roadNo || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Flat No.:</span>
                    <p className="font-medium">{orderData.shipping.flatNo}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">House No.:</span>
                    <p className="font-medium">{orderData.shipping.houseNo}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600">Post Code:</span>
                  <p className="font-medium">{orderData.shipping.postCode}</p>
                </div>

                <div>
                  <span className="text-gray-600">Address Line:</span>
                  <p className="font-medium">{orderData.shipping.addressLine}</p>
                </div>

                <div>
                  <span className="text-gray-600">Address Line 2:</span>
                  <p className="font-medium">{orderData.shipping.addressLine2}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}