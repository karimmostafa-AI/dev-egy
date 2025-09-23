import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock data for coupons
const couponsData = [
  {
    id: 1,
    code: "WELCOME10",
    description: "Welcome discount for new customers",
    discountType: "percentage",
    discountValue: 10,
    minimumOrder: 50,
    maxUses: 100,
    usedCount: 23,
    status: "active",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    id: 2,
    code: "SUMMER25",
    description: "Summer sale discount",
    discountType: "percentage",
    discountValue: 25,
    minimumOrder: 100,
    maxUses: 500,
    usedCount: 156,
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
  },
  {
    id: 3,
    code: "FIXED20",
    description: "Fixed amount discount",
    discountType: "fixed",
    discountValue: 20,
    minimumOrder: 80,
    maxUses: 200,
    usedCount: 89,
    status: "active",
    startDate: "2023-03-15",
    endDate: "2023-09-15",
  },
  {
    id: 4,
    code: "EXPIRED15",
    description: "Expired promotional code",
    discountType: "percentage",
    discountValue: 15,
    minimumOrder: 75,
    maxUses: 150,
    usedCount: 150,
    status: "expired",
    startDate: "2023-01-01",
    endDate: "2023-03-31",
  },
  {
    id: 5,
    code: "INACTIVE5",
    description: "Inactive discount code",
    discountType: "percentage",
    discountValue: 5,
    minimumOrder: 30,
    maxUses: 50,
    usedCount: 12,
    status: "inactive",
    startDate: "2023-05-01",
    endDate: "2023-11-30",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  expired: "bg-red-100 text-red-800",
};

export default function CouponManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoupons = couponsData.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    );
  };

  const formatDiscountValue = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `$${value}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="mt-2 text-gray-700">
            Manage discount coupons and promotional codes.
          </p>
        </div>
        <Button data-testid="button-add-coupon">
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-coupons" className="sr-only">
            Search coupons
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-coupons"
            placeholder="Search coupons..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-coupons"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id} data-testid={`row-coupon-${coupon.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(coupon.code)}
                          data-testid={`button-copy-${coupon.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-gray-900">{coupon.description}</div>
                      <div className="text-xs text-gray-500">
                        Min. order: ${coupon.minimumOrder}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Percent className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {formatDiscountValue(coupon.discountType, coupon.discountValue)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{coupon.usedCount}</span>
                        <span className="text-gray-500"> / {coupon.maxUses}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(coupon.status)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${coupon.id}`}>
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Coupon
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No coupons found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}