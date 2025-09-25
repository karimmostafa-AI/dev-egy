import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { 
  ArrowLeft,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategory, useUpdateCategory } from "@/hooks/admin/useAdmin";

export default function EditCategory() {
  const [, params] = useRoute("/admin/categories/edit/:id");
  const categoryId = params?.id;
  
  // Redirect if no category ID is provided
  if (!categoryId) {
    return <div>Category ID is required</div>;
  }
  
  const { data: category, isLoading, error } = useCategory(categoryId);
  const updateCategoryMutation = useUpdateCategory();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Load category data when it's available
  useEffect(() => {
    if (category?.data) {
      const categoryData = category.data;
      setName(categoryData.name || "");
      setDescription(categoryData.description || "");
    }
  }, [category]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) return;
    
    const categoryData = {
      name,
      description,
    };
    
    updateCategoryMutation.mutate(
      { id: categoryId, data: categoryData },
      {
        onSuccess: () => {
          // Redirect to categories list or show success message
          console.log("Category updated successfully");
        },
        onError: (error) => {
          console.error("Error updating category:", error);
        }
      }
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading category...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading category: {error.message}</div>;
  }

  if (!category) {
    return <div className="flex justify-center items-center h-64">Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link to="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="mt-2 text-gray-700">
          Update category details for your store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-32 w-32 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-md bg-gray-100 border flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    JPG, PNG, GIF (Max 2MB)
                  </p>
                </div>
                
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Label>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a thumbnail for this category. Recommended size: 300x300px
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link to="/admin/categories">
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending}>
                {updateCategoryMutation.isPending ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}