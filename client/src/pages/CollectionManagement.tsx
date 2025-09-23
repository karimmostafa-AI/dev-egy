import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Image,
  Package
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
import OptimizedImage from "@/components/OptimizedImage";

// Mock data for collections
const collectionsData = [
  {
    id: 1,
    name: "Summer Scrubs Collection",
    description: "Lightweight and breathable scrubs perfect for summer weather",
    image: "",
    productCount: 24,
    status: "active",
    featured: true,
    createdDate: "2023-04-15",
    updatedDate: "2023-05-10",
  },
  {
    id: 2,
    name: "Premium Lab Coats",
    description: "High-quality professional lab coats for medical professionals",
    image: "",
    productCount: 12,
    status: "active",
    featured: false,
    createdDate: "2023-03-22",
    updatedDate: "2023-04-05",
  },
  {
    id: 3,
    name: "Comfort Footwear",
    description: "Ergonomic shoes designed for long shifts and maximum comfort",
    image: "",
    productCount: 18,
    status: "active",
    featured: true,
    createdDate: "2023-02-10",
    updatedDate: "2023-05-01",
  },
  {
    id: 4,
    name: "Pediatric Collection",
    description: "Fun and colorful medical wear designed for pediatric healthcare workers",
    image: "",
    productCount: 8,
    status: "inactive",
    featured: false,
    createdDate: "2023-01-18",
    updatedDate: "2023-03-15",
  },
  {
    id: 5,
    name: "Essential Accessories",
    description: "Must-have accessories for healthcare professionals",
    image: "",
    productCount: 15,
    status: "active",
    featured: false,
    createdDate: "2023-05-01",
    updatedDate: "2023-05-08",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function CollectionManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollections = collectionsData.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Management</h1>
          <p className="mt-2 text-gray-700">
            Manage product collections and curated sets.
          </p>
        </div>
        <Button data-testid="button-add-collection">
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-collections" className="sr-only">
            Search collections
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-collections"
            placeholder="Search collections..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-collections"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <TableRow key={collection.id} data-testid={`row-collection-${collection.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {collection.image ? (
                            <OptimizedImage
                              src={collection.image}
                              alt={collection.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Image className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {collection.name}
                            {collection.featured && (
                              <Badge variant="secondary" className="text-xs">Featured</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {collection.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{collection.productCount}</span>
                        <span className="text-gray-500">products</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(collection.status)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {new Date(collection.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {new Date(collection.updatedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${collection.id}`}>
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Collection
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Collection
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Manage Products
                          </DropdownMenuItem>
                          {collection.status === "inactive" ? (
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
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
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No collections found
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