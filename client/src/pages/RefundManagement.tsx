import { useState } from "react";
import { 
  Search, 
  Eye,
  Check,
  X
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
import { Badge } from "@/components/ui/badge";

// Define interface for our data
interface Refund {
  id: string;
  date: string;
  customer: string;
  brand: string;
  amount: string;
  status: string;
  paymentStatus: string;
}

const refundsData: Refund[] = [
  {
    id: "#R1001",
    date: "2023-05-15",
    customer: "John Doe",
    brand: "MediWear",
    amount: "$245.00",
    status: "pending",
    paymentStatus: "Refunded",
  },
  {
    id: "#R1002",
    date: "2023-05-14",
    customer: "Jane Smith",
    brand: "NursePro",
    amount: "$1,200.00",
    status: "approved",
    paymentStatus: "Processing",
  },
  {
    id: "#R1003",
    date: "2023-05-14",
    customer: "Robert Johnson",
    brand: "ScrubsInc",
    amount: "$89.99",
    status: "rejected",
    paymentStatus: "Not Refunded",
  },
  {
    id: "#R1004",
    date: "2023-05-13",
    customer: "Emily Davis",
    brand: "MediWear",
    amount: "$345.50",
    status: "pending",
    paymentStatus: "Pending",
  },
  {
    id: "#R1005",
    date: "2023-05-12",
    customer: "Michael Wilson",
    brand: "NursePro",
    amount: "$560.75",
    status: "approved",
    paymentStatus: "Refunded",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function RefundManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRefunds = refundsData.filter(refund => 
    refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
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
        <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
        <p className="mt-2 text-gray-700">
          Manage and process refund requests.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-refunds" className="sr-only">
            Search refunds
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-refunds"
            placeholder="Search refunds..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-describedby="search-refunds-description"
          />
          <p id="search-refunds-description" className="sr-only">
            Enter refund ID, customer name, or brand to search
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds.map((refund: Refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">{refund.id}</TableCell>
                    <TableCell>{refund.date}</TableCell>
                    <TableCell>{refund.customer}</TableCell>
                    <TableCell>{refund.brand}</TableCell>
                    <TableCell>{refund.amount}</TableCell>
                    <TableCell>{getStatusBadge(refund.status)}</TableCell>
                    <TableCell>{refund.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" aria-label={`View details for refund ${refund.id}`}>
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        {refund.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" aria-label={`Approve refund ${refund.id}`}>
                              <Check className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" aria-label={`Reject refund ${refund.id}`}>
                              <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </>
                        )}
                      </div>
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
        </div>
      </div>
    </div>
  );
}