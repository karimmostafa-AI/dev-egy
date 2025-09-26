import { useState, useEffect } from 'react';
import { 
  Upload,
  Plus,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUploadImage, useCategories, useBrands, useUpdateProductColors } from '@/hooks/admin/useAdmin';
import { handleApiError, handleSuccess } from '@/lib/errorHandler';
import { useTrackEvent } from '@/hooks/useTracking';

interface ProductFormProps {
  mode: 'add' | 'edit';
  productId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProductData {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  comparePrice?: number;
  inventoryQuantity: number;
  minimumOrder: number;
  status: 'active' | 'inactive' | 'draft';
  thumbnailUrl?: string;
  colorImageUrls: Record<string, string>;
  selectedColors: string[];
  selectedSizes: string[];
}

export default function ProductForm({ mode, productId, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    price: 0,
    comparePrice: 0,
    inventoryQuantity: 0,
    minimumOrder: 1,
    status: 'draft',
    thumbnailUrl: '',
    colorImageUrls: {},
    selectedColors: [],
    selectedSizes: []
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [colorImages, setColorImages] = useState<Record<string, {file: File | null, preview: string | null}>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadImageMutation = useUploadImage();
  const updateProductColorsMutation = useUpdateProductColors();
  const { trackEvent } = useTrackEvent();
  
  // Fetch real categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();
  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

  // Fetch real brands from API
  const { data: brandsResponse, isLoading: brandsLoading } = useBrands();
  const brands = Array.isArray(brandsResponse?.brands) ? brandsResponse.brands : 
                Array.isArray(brandsResponse?.data) ? brandsResponse.data : [];

  // State for custom color management
  const [customColors, setCustomColors] = useState<Array<{
    id: string;
    name: string;
    hex: string;
    imageUrl: string;
  }>>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // Functions for color management
  const addCustomColor = () => {
    if (!newColorName.trim()) {
      setError('Please enter a color name');
      return;
    }
    
    const newColor = {
      id: `color-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      imageUrl: ''
    };
    
    setCustomColors(prev => [...prev, newColor]);
    setNewColorName('');
    setNewColorHex('#000000');
    setError(null);
  };

  const removeCustomColor = (colorId: string) => {
    setCustomColors(prev => prev.filter(color => color.id !== colorId));
  };

  const updateColorImage = (colorId: string, imageUrl: string) => {
    setCustomColors(prev => 
      prev.map(color => 
        color.id === colorId ? { ...color, imageUrl } : color
      )
    );
  };

  // Load product data for edit mode
  useEffect(() => {
    if (mode === 'edit' && productId) {
      const loadProduct = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/admin/products/${productId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
          });

          if (response.ok) {
            const product = await response.json();
            setFormData({
              name: product.name || '',
              description: product.description || '',
              categoryId: product.categoryId || '',
              brandId: product.brandId || '',
              price: product.price || 0,
              comparePrice: product.comparePrice || 0,
              inventoryQuantity: product.inventoryQuantity || 0,
              minimumOrder: product.minimumOrder || 1,
              status: product.status || 'draft',
              thumbnailUrl: product.thumbnailUrl || '',
              colorImageUrls: product.colorImageUrls || {},
              selectedColors: product.selectedColors || [],
              selectedSizes: product.selectedSizes || []
            });
          }
        } catch (err) {
          setError('Failed to load product data');
        } finally {
          setIsLoading(false);
        }
      };

      loadProduct();
    }
  }, [mode, productId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (colorName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter(c => c !== colorName)
        : [...prev.selectedColors, colorName]
    }));

    setColorImages(prev => {
      if (prev[colorName]) {
        const newImages = {...prev};
        delete newImages[colorName];
        return newImages;
      } else {
        return {
          ...prev,
          [colorName]: {file: null, preview: null}
        };
      }
    });
  };

  const handleSizeSelect = (size: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const handleColorImageChange = (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
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
    setError(null);
    setIsLoading(true);

    try {
      // Validate custom colors - each must have an image URL
      if (customColors.length > 0) {
        const missingImages = customColors.filter(color => !color.imageUrl.trim());
        if (missingImages.length > 0) {
          throw new Error(`Please provide image URLs for: ${missingImages.map(c => c.name).join(', ')}`);
        }
      }

      // Upload thumbnail image if available
      let thumbnailUrl = formData.thumbnailUrl;
      if (thumbnail) {
        const imageData = await uploadImageMutation.mutateAsync(thumbnail);
        thumbnailUrl = imageData.data?.url || '';
      }
      
      // Generate SKU and slug
      const generateSKU = (name: string) => {
        const prefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}-${timestamp}`;
      };
      
      const generateSlug = (name: string) => {
        return name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };

      // Prepare product data (without custom colors for now)
      const productData = {
        ...formData,
        thumbnailUrl,
        sku: generateSKU(formData.name),
        slug: generateSlug(formData.name)
      };
      
      // Track product creation/update
      trackEvent(mode === 'add' ? 'create_product' : 'update_product', 'admin', formData.name);
      
      // Submit product to backend API
      const url = mode === 'add' ? '/api/admin/products' : `/api/admin/products/${productId}`;
      const method = mode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${mode} product`);
      }

      const productResult = await response.json();
      const savedProductId = mode === 'add' ? productResult.product?.id : productId;

      // Save custom colors if any
      if (customColors.length > 0 && savedProductId) {
        const colorsToSave = customColors.map(color => ({
          name: color.name,
          hex: color.hex,
          imageUrl: color.imageUrl
        }));

        await updateProductColorsMutation.mutateAsync({
          id: savedProductId,
          colors: colorsToSave
        });
      }

      handleSuccess(
        mode === 'add' ? "Product Created!" : "Product Updated!",
        `The product has been ${mode === 'add' ? 'created' : 'updated'} successfully.`
      );
      onSuccess();
    } catch (error) {
      handleApiError(error, `Failed to ${mode} product`);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select 
                  value={formData.brandId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    placeholder="0.00"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory">Stock Quantity</Label>
                  <Input
                    id="inventory"
                    type="number"
                    placeholder="0"
                    value={formData.inventoryQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, inventoryQuantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumOrder">Minimum Order</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    placeholder="1"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumOrder: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'draft') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Media */}
        <Card>
          <CardHeader>
            <CardTitle>Product Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thumbnail */}
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

            {/* Custom Color Palette */}
            <div className="space-y-4">
              <Label>Custom Color Palette</Label>
              
              {/* Add New Color */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium mb-3 block">Add New Color</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="color-name" className="text-xs">Color Name</Label>
                    <Input
                      id="color-name"
                      placeholder="e.g., Navy Blue"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color-hex" className="text-xs">Hex Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-hex"
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">&nbsp;</Label>
                    <Button
                      type="button"
                      onClick={addCustomColor}
                      className="w-full"
                      data-testid="button-add-color"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Color
                    </Button>
                  </div>
                </div>
              </div>

              {/* Custom Colors List */}
              {customColors.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Selected Colors & Images</Label>
                  {customColors.map((color) => (
                    <div key={color.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-6 w-6 rounded-full border-2 border-gray-300" 
                            style={{ backgroundColor: color.hex }}
                            data-testid={`color-swatch-${color.id}`}
                          />
                          <span className="text-sm font-medium">{color.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">{color.hex}</div>
                        <div className="md:col-span-3">
                          <Label htmlFor={`image-${color.id}`} className="text-xs">Image URL for {color.name}</Label>
                          <Input
                            id={`image-${color.id}`}
                            placeholder="https://example.com/image.jpg"
                            value={color.imageUrl}
                            onChange={(e) => updateColorImage(color.id, e.target.value)}
                            data-testid={`input-color-image-${color.id}`}
                          />
                          {!color.imageUrl && (
                            <p className="text-xs text-red-500 mt-1">Image URL is required for each color</p>
                          )}
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCustomColor(color.id)}
                            data-testid={`button-remove-color-${color.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {customColors.length === 0 && (
                <div className="text-center py-6 text-gray-500 border rounded-lg border-dashed">
                  <Package className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                  <p className="text-sm">No colors added yet. Add your first color above.</p>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.selectedSizes.includes(size)}
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

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || uploadImageMutation.isPending}
          >
            {isLoading || uploadImageMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'add' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === 'add' ? 'Create Product' : 'Update Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
