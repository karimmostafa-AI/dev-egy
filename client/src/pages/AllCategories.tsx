import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories, useDeleteCategory } from "@/hooks/admin/useAdmin";
import type { Category } from "../../shared/schema";

export default function AllCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Fetch categories using the real API
  const { data: categoriesResponse, isLoading, error } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();

  // Extract categories from API response
  const categories = categoriesResponse?.categories || [];

  const filteredCategories = categories.filter((category: Category) => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600 text-lg">Error loading categories: {error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting category:", error);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
          <p className="mt-2 text-gray-700">
            Manage product categories in your store.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/add">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-categories" className="sr-only">
            Search categories
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-categories"
            placeholder="Search categories..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-describedby="search-categories-description"
          />
          <p id="search-categories-description" className="sr-only">
            Enter category name to search
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category ID</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category: Category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id.substring(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-gray-600">{category.slug}</TableCell>
                    <TableCell className="text-gray-600">
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild aria-label={`View ${category.name}`}>
                          <Link to={`/admin/categories/edit/${category.id}`}>
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild aria-label={`Edit ${category.name}`}>
                          <Link to={`/admin/categories/edit/${category.id}`}>
                            <Edit className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(category.id)}
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}