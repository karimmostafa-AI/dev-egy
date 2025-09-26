import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  comparePrice?: number;
  inventoryQuantity: number;
  minimumOrder: number;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  brand: string;
  thumbnailUrl?: string;
  colorImageUrls: Record<string, string>;
  selectedColors: string[];
  selectedSizes: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsProps {
  productId: string;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export default function ProductDetails({ productId, onEdit, onBack }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/admin/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        onBack();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Product not found</AlertDescription>
      </Alert>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => onEdit(product.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {product.thumbnailUrl ? (
                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {product.description || 'No description provided'}
              </p>
            </CardContent>
          </Card>

          {/* Colors and Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Available Colors</CardTitle>
              </CardHeader>
              <CardContent>
                {product.selectedColors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.selectedColors.map((color) => (
                      <Badge key={color} variant="outline" className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'white' ? '#fff' : color }}
                        />
                        {color}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No colors specified</p>
                )}
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                {product.selectedSizes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.selectedSizes.map((size) => (
                      <Badge key={size} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No sizes specified</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(product.status)}
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
              </div>
              {product.comparePrice && product.comparePrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Compare Price</span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                </div>
              )}
              {product.comparePrice && product.comparePrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm text-green-600">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stock Quantity</span>
                <span className={`font-semibold ${product.inventoryQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inventoryQuantity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Minimum Order</span>
                <span className="text-sm">{product.minimumOrder}</span>
              </div>
              {product.inventoryQuantity === 0 && (
                <Badge variant="destructive" className="w-full justify-center">
                  Out of Stock
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Brand</span>
                <span className="text-sm">{product.brand}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Updated</span>
                <span className="text-sm">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
