import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Image,
  Package,
  MoreHorizontal
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
import { Skeleton } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/OptimizedImage";
import { useToast } from "@/hooks/use-toast";
import { 
  useCollections, 
  useDeleteCollection,
  useUpdateCollection,
  useCollectionProducts
} from "@/hooks/admin/useAdminHooks";

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function CollectionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { toast } = useToast();

  // Fetch collections
  const { 
    data: collectionsResponse, 
    isLoading, 
    error,
    refetch 
  } = useCollections({ page, limit });

  // Mutations
  const deleteCollectionMutation = useDeleteCollection();
  const updateCollectionMutation = useUpdateCollection();

  // Extract collections from response
  const collections = collectionsResponse?.success ? collectionsResponse.data?.data || [] : [];
  const pagination = collectionsResponse?.success ? collectionsResponse.data?.pagination : null;

  // Filter collections based on search term
  const filteredCollections = collections.filter((collection: any) => 
    collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isActive: boolean, isFeatured: boolean) => {
    const status = isActive ? "active" : "inactive";
    const displayText = isActive ? "Active" : "Inactive";
    
    return (
      <div className="flex items-center gap-2">
        <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
          {displayText}
        </Badge>
        {isFeatured && (
          <Badge variant="secondary" className="text-xs">Featured</Badge>
        )}
      </div>
    );
  };

  const handleDeleteCollection = async (collectionId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also remove all products from this collection.`)) {
      try {
        const result = await deleteCollectionMutation.mutateAsync(collectionId);
        if (result.success) {
          toast({
            title: "Success",
            description: "Collection deleted successfully",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete collection",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete collection",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (collectionId: string, currentStatus: boolean) => {
    try {
      const result = await updateCollectionMutation.mutateAsync({
        collectionId,
        data: { isActive: !currentStatus }
      });
      if (result.success) {
        toast({
          title: "Success",
          description: `Collection ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update collection",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | number) => {
    if (!dateString) return "Not set";
    const date = typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString);
    return date.toLocaleDateString();
  };

  // Hook to get product count for a collection (optional - can be used for live data)
  const getProductCount = (collectionId: string) => {
    // This could be enhanced to fetch actual product count from API
    // For now, we'll use a placeholder or the backend could include this in the collections response
    return 0; // Placeholder
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Collection Management</h1>
            <p className="mt-2 text-red-600">
              Error loading collections. Please try again.
            </p>
          </div>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCollections.length > 0 ? (
                filteredCollections.map((collection: any) => (
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
                          <div className="font-medium text-gray-900">
                            {collection.name}
                          </div>
                          {collection.description && (
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {collection.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(collection.isActive, collection.isFeatured)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(collection.createdAt)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(collection.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            data-testid={`button-actions-${collection.id}`}
                            disabled={deleteCollectionMutation.isPending || updateCollectionMutation.isPending}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
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
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(collection.id, collection.isActive)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {collection.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCollection(collection.id, collection.name)}
                          >
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
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No collections found matching your search" : "No collections found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}