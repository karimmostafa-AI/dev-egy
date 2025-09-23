import { useState } from "react";
import { 
  Search, 
  Eye,
  Edit,
  Trash2,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for reviews
const reviewsData = [
  {
    id: 1,
    customer: {
      name: "John Doe",
      email: "john.doe@email.com",
      avatar: "",
    },
    product: {
      name: "Men's Classic Fit Scrubs Set",
      image: "",
    },
    rating: 5,
    title: "Excellent quality and comfort",
    content: "These scrubs are exactly what I was looking for. The fabric is comfortable and the fit is perfect.",
    date: "2023-05-15",
    status: "approved",
    helpful: 12,
    notHelpful: 1,
    verified: true,
  },
  {
    id: 2,
    customer: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      avatar: "",
    },
    product: {
      name: "Women's Slim Fit Lab Coat",
      image: "",
    },
    rating: 4,
    title: "Good quality but runs small",
    content: "The lab coat is well-made but I would recommend ordering one size up. Otherwise very satisfied.",
    date: "2023-05-12",
    status: "approved",
    helpful: 8,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 3,
    customer: {
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      avatar: "",
    },
    product: {
      name: "Anti-Slip Nursing Shoes",
      image: "",
    },
    rating: 2,
    title: "Not comfortable for long shifts",
    content: "These shoes look good but after wearing them for 12-hour shifts, my feet hurt. Not recommended for long hours.",
    date: "2023-05-10",
    status: "pending",
    helpful: 3,
    notHelpful: 8,
    verified: true,
  },
  {
    id: 4,
    customer: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      avatar: "",
    },
    product: {
      name: "Disposable Face Masks",
      image: "",
    },
    rating: 5,
    title: "Great value for money",
    content: "Perfect masks for our clinic. Good quality and the price is unbeatable.",
    date: "2023-05-08",
    status: "approved",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: 5,
    customer: {
      name: "Michael Wilson",
      email: "michael.wilson@email.com",
      avatar: "",
    },
    product: {
      name: "Nurse ID Badge Holder",
      image: "",
    },
    rating: 1,
    title: "Poor quality material",
    content: "This badge holder broke after just one week of use. Very disappointed with the quality.",
    date: "2023-05-05",
    status: "rejected",
    helpful: 5,
    notHelpful: 3,
    verified: true,
  },
];

const statusColors = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ReviewManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = reviewsData.filter(review => 
    review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="mt-2 text-gray-700">
          Manage customer reviews and ratings.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-reviews" className="sr-only">
            Search reviews
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-reviews"
            placeholder="Search reviews..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-reviews"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Helpful</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                          <AvatarFallback className="text-xs">
                            {review.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-1">
                            {review.customer.name}
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{review.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900">
                        {review.product.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <div className="font-medium text-sm text-gray-900">{review.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {review.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {new Date(review.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(review.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-600" />
                          <span>{review.helpful}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3 text-red-600" />
                          <span>{review.notHelpful}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${review.id}`}>
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          {review.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No reviews found
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