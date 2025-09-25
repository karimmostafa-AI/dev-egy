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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategory, useUpdateCategory } from "@/hooks/admin/useAdmin";

export default function EditSubCategory() {
  const [, params] = useRoute("/admin/subcategories/edit/:id");
  const subCategoryId = params?.id;
  
  // Redirect if no subcategory ID is provided
  if (!subCategoryId) {
    return <div>Subcategory ID is required</div>;
  }
  
  const { data: subCategory, isLoading, error } = useCategory(subCategoryId);
  const updateCategoryMutation = useUpdateCategory();
  
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const parentCategories = [
    { id: 1, name: "Scrubs" },
    { id: 2, name: "Lab Coats" },
    { id: 3, name: "Shoes" },
    { id: 4, name: "Accessories" },
    { id: 5, name: "Nursing Uniforms" },
  ];

  // Load sub-category data when it's available
  useEffect(() => {
    if (subCategory?.data) {
      const subCategoryData = subCategory.data as any;
      setName(subCategoryData?.name || "");
      setParentCategory(subCategoryData?.parentId || "");
      setDescription(subCategoryData?.description || "");
    }
  }, [subCategory]);

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
    
    if (!subCategoryId) return;
    
    const categoryData = {
      name,
      parentId: parentCategory,
      description,
    };
    
    updateCategoryMutation.mutate(
      { id: subCategoryId, data: categoryData },
      {
        onSuccess: () => {
          // Redirect to sub-categories list or show success message
          console.log("Sub-category updated successfully");
        },
        onError: (error) => {
          console.error("Error updating sub-category:", error);
        }
      }
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading sub-category...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading sub-category: {error.message}</div>;
  }

  if (!subCategory) {
    return <div className="flex justify-center items-center h-64">Sub-category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link to="/admin/subcategories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sub-Categories
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Sub-Category</h1>
        <p className="mt-2 text-gray-700">
          Update sub-category details for your store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Sub-Category Name *</Label>
              <Input
                id="name"
                placeholder="Enter sub-category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category *</Label>
              <Select value={parentCategory} onValueChange={setParentCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent category" />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter sub-category description"
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
                    Upload a thumbnail for this sub-category. Recommended size: 300x300px
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link to="/admin/subcategories">
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending}>
                {updateCategoryMutation.isPending ? "Saving..." : "Save Sub-Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}