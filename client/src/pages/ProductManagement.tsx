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
  Edit,
  Loader2,
  RefreshCw,
  Package,
  Settings
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Import the new product components
import ProductList from '../components/admin/ProductList';
import ProductForm from '../components/admin/ProductForm';
import ProductDetails from '../components/admin/ProductDetails';

export default function ProductManagement() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAdminAuth();

  // Get current view from URL
  const getCurrentView = () => {
    if (location.includes('/admin/products/add')) return 'add';
    if (location.includes('/admin/products/edit/')) return 'edit';
    if (location.includes('/admin/products/view/')) return 'view';
    return 'list';
  };

  const currentView = getCurrentView();

  // Navigation handlers
  const navigateToAdd = () => setLocation('/admin/products/add');
  const navigateToList = () => setLocation('/admin/products');
  const navigateToEdit = (id: string) => setLocation(`/admin/products/edit/${id}`);
  const navigateToView = (id: string) => setLocation(`/admin/products/view/${id}`);

  // Handle product actions
  const handleDeleteProduct = async (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/products/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        // Refresh the product list
        window.location.reload();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ productIds: selectedProducts })
      });

      if (response.ok) {
        setSelectedProducts([]);
        // Refresh the product list
        window.location.reload();
      } else {
        throw new Error('Failed to delete products');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different views based on current route
  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return <ProductForm mode="add" onSuccess={navigateToList} onCancel={navigateToList} />;
      case 'edit':
        const editId = location.split('/').pop();
        if (!editId) {
          return <div>Invalid product ID</div>;
        }
        return <ProductForm mode="edit" productId={editId} onSuccess={navigateToList} onCancel={navigateToList} />;
      case 'view':
        const viewId = location.split('/').pop();
        if (!viewId) {
          return <div>Invalid product ID</div>;
        }
        return <ProductDetails productId={viewId} onEdit={navigateToEdit} onBack={navigateToList} />;
      default:
        return (
          <ProductList
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            currentPage={currentPage}
            selectedProducts={selectedProducts}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            onSortChange={(field: string, order: 'asc' | 'desc') => {
              setSortBy(field);
              setSortOrder(order);
            }}
            onPageChange={setCurrentPage}
            onSelectionChange={setSelectedProducts}
            onEdit={navigateToEdit}
            onView={navigateToView}
            onDelete={handleDeleteProduct}
            onBulkDelete={handleBulkDelete}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentView !== 'list' && (
            <Button variant="outline" size="icon" onClick={navigateToList}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentView === 'add' && 'Add Product'}
              {currentView === 'edit' && 'Edit Product'}
              {currentView === 'view' && 'Product Details'}
              {currentView === 'list' && 'Product Management'}
            </h1>
            <p className="text-gray-600">
              {currentView === 'add' && 'Create a new product for your store'}
              {currentView === 'edit' && 'Update product information'}
              {currentView === 'view' && 'View product details and analytics'}
              {currentView === 'list' && 'Manage your product inventory'}
            </p>
          </div>
        </div>

        {currentView === 'list' && (
          <div className="flex items-center space-x-2">
            {selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
            <Button onClick={navigateToAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {renderCurrentView()}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? (
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
