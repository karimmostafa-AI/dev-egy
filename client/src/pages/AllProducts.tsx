import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ArrowLeft,
  Search,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Filter,
  Eye,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';
import { useProducts, useDeleteProduct } from '@/hooks/admin/useAdmin';
import OptimizedImage from '@/components/OptimizedImage';

const productsData = [
  {
    id: 1,
    name: "Men's Classic Fit Scrubs Set",
    brand: "MediWear",
    thumbnail: "",
    price: 89.99,
    discountPrice: 69.99,
    status: true,
  },
  {
    id: 2,
    name: "Women's Slim Fit Lab Coat",
    brand: "NursePro",
    thumbnail: "",
    price: 120.00,
    discountPrice: 0,
    status: true,
  },
  {
    id: 3,
    name: "Anti-Slip Nursing Shoes",
    brand: "ComfortFeet",
    thumbnail: "",
    price: 75.50,
    discountPrice: 59.99,
    status: false,
  },
  {
    id: 4,
    name: "Disposable Face Masks (50 pcs)",
    brand: "SafeGuard",
    thumbnail: "",
    price: 25.00,
    discountPrice: 0,
    status: true,
  },
  {
    id: 5,
    name: "Nurse ID Badge Holder",
    brand: "AccessoriesPlus",
    thumbnail: "",
    price: 12.99,
    discountPrice: 9.99,
    status: true,
  },
];

export default function AllProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-700">
            Manage products in your store.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Status: Active</DropdownMenuItem>
            <DropdownMenuItem>Status: Inactive</DropdownMenuItem>
            <DropdownMenuItem>On Sale</DropdownMenuItem>
            <DropdownMenuItem>Out of Stock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">PROD-{product.id.toString().padStart(3, '0')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.thumbnail ? (
                        <OptimizedImage 
                          src={product.thumbnail} 
                          alt={product.name} 
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.discountPrice > 0 ? (
                      <span className="line-through text-gray-500">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={product.status} 
                      onCheckedChange={() => {}} // In a real app, this would update the status
                    />
                    <span className="ml-2 text-sm">
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/product/${product.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}