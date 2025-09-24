import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  ArrowLeft
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

const trackingSchema = z.object({
  orderNumber: z.string().min(1, 'Please enter an order number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

type TrackingForm = z.infer<typeof trackingSchema>;

// Mock tracking data
const mockTrackingData = {
  orderNumber: 'ORD-2024-001234',
  status: 'In Transit',
  estimatedDelivery: '2024-09-25',
  trackingNumber: 'TRK789456123',
  carrier: 'FedEx',
  carrierUrl: 'https://fedex.com/track',
  
  customer: {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567'
  },
  
  shippingAddress: {
    name: 'Dr. Sarah Johnson',
    address: '123 Medical Center Drive',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  
  items: [
    {
      id: '1',
      name: 'Cherokee Workwear Scrub Set - Navy Blue',
      quantity: 2,
      image: '/images/scrub-set-navy.jpg'
    },
    {
      id: '2',
      name: 'FIGS Technical Collection Top - Black',
      quantity: 1,
      image: '/images/figs-top-black.jpg'
    }
  ],
  
  timeline: [
    {
      status: 'Order Placed',
      description: 'Your order has been received and is being processed',
      timestamp: '2024-09-20T10:30:00Z',
      location: 'DEV Egypt Warehouse',
      completed: true
    },
    {
      status: 'Order Confirmed',
      description: 'Payment processed and order confirmed',
      timestamp: '2024-09-20T11:15:00Z',
      location: 'DEV Egypt Warehouse',
      completed: true
    },
    {
      status: 'Picked & Packed',
      description: 'Your items have been picked from inventory and packed',
      timestamp: '2024-09-20T16:45:00Z',
      location: 'DEV Egypt Warehouse',
      completed: true
    },
    {
      status: 'Shipped',
      description: 'Your package has been handed over to the carrier',
      timestamp: '2024-09-21T09:00:00Z',
      location: 'DEV Egypt Distribution Center',
      completed: true
    },
    {
      status: 'In Transit',
      description: 'Your package is on its way to the destination',
      timestamp: '2024-09-21T14:30:00Z',
      location: 'FedEx Facility - Newark, NJ',
      completed: true
    },
    {
      status: 'Out for Delivery',
      description: 'Your package is out for delivery',
      timestamp: null,
      location: 'Local Delivery Hub',
      completed: false
    },
    {
      status: 'Delivered',
      description: 'Your package has been delivered',
      timestamp: null,
      location: 'Delivery Address',
      completed: false
    }
  ]
};

export default function OrderTracking() {
  const [location, setLocation] = useLocation();
  const [trackingData, setTrackingData] = useState<typeof mockTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
  });

  const onSubmit = async (data: TrackingForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would fetch tracking data from backend
      console.log('Tracking order:', data);
      
      // For demo, always return mock data if order number exists
      if (data.orderNumber.trim()) {
        setTrackingData(mockTrackingData);
      } else {
        setError('Order not found. Please check your order number and try again.');
      }
    } catch (error) {
      setError('Failed to fetch tracking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTrackingNumber = async () => {
    if (trackingData?.trackingNumber) {
      await navigator.clipboard.writeText(trackingData.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <Clock className="h-5 w-5 text-gray-400" />;
    
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "In Transit":
      case "Out for Delivery":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
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
          <h1 className="text-3xl font-bold mb-2" data-testid="tracking-title">Order Tracking</h1>
          <p className="text-muted-foreground">
            Track your order status and delivery progress
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!trackingData ? (
          /* Tracking Form */
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Track Your Order</CardTitle>
              <CardDescription>
                Enter your order details to see the latest status and tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number *</Label>
                  <Input
                    id="orderNumber"
                    placeholder="e.g., ORD-2024-001234"
                    {...register('orderNumber')}
                    className={errors.orderNumber ? 'border-destructive' : ''}
                    data-testid="order-number-input"
                  />
                  {errors.orderNumber && (
                    <p className="text-sm text-destructive" data-testid="order-number-error">
                      {errors.orderNumber.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    You can find your order number in your confirmation email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email used for the order"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive" data-testid="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="track-order-button"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Tracking Order...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>

              {/* Help Section */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email: orders@devegypt.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone: (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Mon-Fri 9AM-6PM EST</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Tracking Results */
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setTrackingData(null);
                setError(null);
              }}
              data-testid="back-to-search"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Track Another Order
            </Button>

            {/* Order Status Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Order {trackingData.orderNumber}</CardTitle>
                    <CardDescription>
                      Expected delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge 
                    className="text-lg px-4 py-2"
                    variant={trackingData.status === 'Delivered' ? 'default' : 'secondary'}
                  >
                    {trackingData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tracking Number */}
                  <div className="space-y-2">
                    <Label>Tracking Number</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-3 py-2 rounded font-mono text-sm flex-1">
                        {trackingData.trackingNumber}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={copyTrackingNumber}
                        data-testid="copy-tracking"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Carrier: {trackingData.carrier}
                    </p>
                  </div>

                  {/* Carrier Tracking */}
                  <div className="space-y-2">
                    <Label>Carrier Tracking</Label>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(trackingData.carrierUrl, '_blank')}
                      data-testid="carrier-tracking"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on {trackingData.carrier}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
                <CardDescription>Follow your order's journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        event.completed 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-muted bg-background'
                      }`}>
                        {getStatusIcon(event.status, event.completed)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {event.status}
                          </h4>
                          {event.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{trackingData.shippingAddress.name}</p>
                    <p>{trackingData.shippingAddress.address}</p>
                    <p>
                      {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zipCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{trackingData.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{trackingData.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{trackingData.customer.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({trackingData.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}