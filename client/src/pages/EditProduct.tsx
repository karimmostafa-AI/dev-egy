import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { 
  ArrowLeft,
  Upload,
  Plus,
  X
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useProduct, useUpdateProduct, useUploadImage } from "@/hooks/admin/useAdmin";

export default function EditProduct() {
  const [, params] = useRoute("/admin/products/edit/:id");
  const productId = params?.id;
  
  // Redirect if no product ID is provided
  if (!productId) {
    return <div>Product ID is required</div>;
  }
  
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const uploadImageMutation = useUploadImage();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("1");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, {file: File | null, preview: string | null}>>({});

  const categories = [
    { id: 1, name: "Scrubs" },
    { id: 2, name: "Lab Coats" },
    { id: 3, name: "Shoes" },
    { id: 4, name: "Accessories" },
  ];

  const subCategories = [
    { id: 1, name: "Men's Scrubs", categoryId: 1 },
    { id: 2, name: "Women's Scrubs", categoryId: 1 },
    { id: 3, name: "Children's Lab Coats", categoryId: 2 },
    { id: 4, name: "Surgical Shoes", categoryId: 3 },
  ];

  const brands = [
    { id: 1, name: "MediWear" },
    { id: 2, name: "NursePro" },
    { id: 3, name: "ComfortFeet" },
    { id: 4, name: "SafeGuard" },
  ];

  const availableColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#00FF00" },
    { name: "Red", value: "#FF0000" },
    { name: "Pink", value: "#FFC0CB" },
  ];

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

  const filteredSubCategories = subCategories.filter(
    (sub) => category === "" || sub.categoryId === parseInt(category)
  );

  // Load product data when it's available
  useEffect(() => {
    if (product?.data) {
      const productData = product.data as any;
      setName(productData.name || "");
      setDescription(productData.description || "");
      setCategory(productData.categoryId?.toString() || "");
      setSubCategory(productData.subCategoryId?.toString() || "");
      setBrand(productData.brandId?.toString() || "");
      setSellingPrice(productData.price?.toString() || "");
      setDiscountPrice(productData.comparePrice?.toString() || "");
      setStockQuantity(productData.inventoryQuantity?.toString() || "");
      setMinimumOrder(productData.minimumOrder?.toString() || "1");
      setSelectedColors(productData.selectedColors || []);
      setSelectedSizes(productData.selectedSizes || []);
      
      // Set up color images if they exist
      if (productData.colorImages) {
        const images: Record<string, {file: File | null, preview: string | null}> = {};
        Object.keys(productData.colorImages).forEach(color => {
          images[color] = { file: null, preview: productData.colorImages[color] };
        });
        setColorImages(images);
      }
    }
  }, [product]);

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

  const handleColorSelect = (colorName: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorName)) {
        // Remove color and its images
        const newColors = prev.filter(c => c !== colorName);
        setColorImages(prevImages => {
          const newImages = {...prevImages};
          delete newImages[colorName];
          return newImages;
        });
        return newColors;
      } else {
        // Add color
        setColorImages(prev => ({
          ...prev,
          [colorName]: {file: null, preview: null}
        }));
        return [...prev, colorName];
      }
    });
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleColorImageChange = (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setColorImages(prev => ({
          ...prev,
          [colorName]: {
            file: file,
            preview: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) return;
    
    try {
      // Upload thumbnail image if available
      let thumbnailUrl = (product?.data as any)?.thumbnailUrl || null;
      if (thumbnail) {
        const imageData = await uploadImageMutation.mutateAsync(thumbnail);
        thumbnailUrl = imageData.data?.url;
      }
      
      // Upload color images if available
      const colorImageUrls: Record<string, string> = {};
      for (const [colorName, imageData] of Object.entries(colorImages)) {
        if (imageData.file) {
          const uploadedImage = await uploadImageMutation.mutateAsync(imageData.file);
          if (uploadedImage.data?.url) {
            colorImageUrls[colorName] = uploadedImage.data.url;
          }
        } else if (imageData.preview) {
          // Keep existing image URL
          colorImageUrls[colorName] = imageData.preview;
        }
      }
      
      // Prepare product data
      const productData = {
        name,
        description,
        categoryId: category,
        subCategoryId: subCategory,
        brandId: brand,
        price: parseFloat(sellingPrice),
        comparePrice: discountPrice ? parseFloat(discountPrice) : null,
        inventoryQuantity: parseInt(stockQuantity) || 0,
        minimumOrder: parseInt(minimumOrder) || 1,
        thumbnailUrl,
        colorImageUrls,
        selectedColors,
        selectedSizes
      };
      
      await updateProductMutation.mutateAsync({ id: productId, data: productData });
      
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading product...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading product: {(error as Error).message}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-64">Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link to="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-700">
          Update product details for your store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub-Category</Label>
                <Select 
                  value={subCategory} 
                  onValueChange={setSubCategory}
                  disabled={category === ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder="0.00"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    placeholder="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumOrder">Minimum Order</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    placeholder="1"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-32 w-32 rounded-md object-cover border"
                    />
                  ) : (product?.data as any)?.thumbnailUrl ? (
                    <img
                      src={(product?.data as any)?.thumbnailUrl}
                      alt="Current thumbnail"
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
                    Upload a thumbnail for this product. Recommended size: 600x600px
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <div key={color.name} className="flex items-center">
                    <Checkbox
                      id={`color-${color.name}`}
                      checked={selectedColors.includes(color.name)}
                      onCheckedChange={() => handleColorSelect(color.name)}
                    />
                    <Label 
                      htmlFor={`color-${color.name}`} 
                      className="ml-2 flex items-center gap-2"
                    >
                      <div 
                        className="h-4 w-4 rounded-full border" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedColors.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">Color Images</h4>
                  {selectedColors.map((color) => {
                    const colorData = availableColors.find(c => c.name === color);
                    return (
                      <div key={color} className="flex items-center gap-4 p-3 border rounded-md">
                        <div 
                          className="h-6 w-6 rounded-full border" 
                          style={{ backgroundColor: colorData?.value }}
                        />
                        <span className="font-medium">{color}</span>
                        
                        <div className="flex-1 flex items-center gap-4">
                          {colorImages[color]?.preview ? (
                            <img
                              src={colorImages[color].preview!}
                              alt={`${color} preview`}
                              className="h-16 w-16 rounded-md object-cover border"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-100 border flex items-center justify-center">
                              <Upload className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleColorImageChange(color, e)}
                              className="hidden"
                              id={`color-image-${color}`}
                            />
                            <Label
                              htmlFor={`color-image-${color}`}
                              className="cursor-pointer inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </Label>
                          </div>
                          
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setColorImages(prev => ({
                                ...prev,
                                [color]: {file: null, preview: null}
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleSizeSelect(size)}
                    />
                    <Label htmlFor={`size-${size}`} className="ml-2">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link to="/admin/products">
              Cancel
            </Link>
          </Button>
          <Button 
            type="submit" 
            disabled={updateProductMutation.isPending || uploadImageMutation.isPending}
          >
            {updateProductMutation.isPending || uploadImageMutation.isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}