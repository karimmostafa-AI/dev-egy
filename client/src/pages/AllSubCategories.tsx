import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye
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

const subCategoriesData = [
  {
    id: 1,
    name: "Men's Scrubs",
    parentCategory: "Scrubs",
    thumbnail: "",
    status: true,
  },
  {
    id: 2,
    name: "Women's Scrubs",
    parentCategory: "Scrubs",
    thumbnail: "",
    status: true,
  },
  {
    id: 3,
    name: "Children's Lab Coats",
    parentCategory: "Lab Coats",
    thumbnail: "",
    status: false,
  },
  {
    id: 4,
    name: "Surgical Shoes",
    parentCategory: "Shoes",
    thumbnail: "",
    status: true,
  },
  {
    id: 5,
    name: "Nursing Caps",
    parentCategory: "Accessories",
    thumbnail: "",
    status: true,
  },
];

export default function AllSubCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<number | null>(null);

  const filteredSubCategories = subCategoriesData.filter(subCategory => 
    subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subCategory.parentCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setSubCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the sub-category
    setDeleteDialogOpen(false);
    setSubCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Sub-Categories</h1>
          <p className="mt-2 text-gray-700">
            Manage product sub-categories in your store.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/subcategories/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Sub-Category
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search sub-categories..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub-Category ID</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Sub-Category Name</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell className="font-medium">SUB-{subCategory.id.toString().padStart(3, '0')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {subCategory.thumbnail ? (
                        <img 
                          src={subCategory.thumbnail} 
                          alt={subCategory.name} 
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{subCategory.name}</TableCell>
                  <TableCell>{subCategory.parentCategory}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={subCategory.status} 
                      onCheckedChange={() => {}} // In a real app, this would update the status
                    />
                    <span className="ml-2 text-sm">
                      {subCategory.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/subcategories/edit/${subCategory.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/subcategories/edit/${subCategory.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(subCategory.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No sub-categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub-Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sub-category? This action cannot be undone.
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