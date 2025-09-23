import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
} from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/admin/useAdminHooks';
import { Button } from '@/components/ui/button';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description 
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  description?: string;
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center text-sm">
                {isPositive && (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+{change}%</span>
                  </>
                )}
                {isNegative && (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600">{change}%</span>
                  </>
                )}
                {!isPositive && !isNegative && (
                  <span className="text-gray-600">0%</span>
                )}
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
    processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge className={config.color} variant="secondary">
      {config.label}
    </Badge>
  );
}

export default function DashboardOverview() {
  const { data: analytics, isLoading, error } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics?.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Failed to load dashboard data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = analytics.data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={Number(data.stats.totalProducts).toLocaleString()}
          change={12}
          icon={Package}
          description="Active products in catalog"
        />
        <StatCard
          title="Total Customers"
          value={Number(data.stats.totalCustomers).toLocaleString()}
          change={8}
          icon={Users}
          description="Registered customers"
        />
        <StatCard
          title="Total Orders"
          value={Number(data.stats.totalOrders).toLocaleString()}
          change={15}
          icon={ShoppingCart}
          description="All time orders"
        />
        <StatCard
          title="Total Revenue"
          value={`$${Number(data.stats.totalEarnings).toLocaleString()}`}
          change={22}
          icon={DollarSign}
          description="Total earnings"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Today's Revenue"
          value={`$${data.stats.todayEarnings.toLocaleString()}`}
          change={5}
          icon={TrendingUp}
        />
        <StatCard
          title="Weekly Revenue"
          value={`$${data.stats.weeklyEarnings.toLocaleString()}`}
          change={12}
          icon={TrendingUp}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${data.stats.monthlyEarnings.toLocaleString()}`}
          change={18}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Trends Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Sales Trends
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>Monthly sales over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.charts.salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.charts.orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.charts.orderStatusDistribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topSellingProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{product.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{product.sales} units sold</span>
                      <span className="mx-2">•</span>
                      <span>${product.revenue} revenue</span>
                    </div>
                  </div>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Pending Orders"
          value={data.orderStatus.pending}
          icon={ShoppingCart}
        />
        <StatCard
          title="Confirmed Orders"
          value={data.orderStatus.confirmed}
          icon={ShoppingCart}
        />
        <StatCard
          title="Processing Orders"
          value={data.orderStatus.processing}
          icon={ShoppingCart}
        />
        <StatCard
          title="Delivered Orders"
          value={data.orderStatus.delivered}
          icon={ShoppingCart}
        />
        <StatCard
          title="Cancelled Orders"
          value={data.orderStatus.cancelled}
          icon={ShoppingCart}
        />
      </div>
    </div>
  );
}