import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft,
  Search,
  Edit3,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useProducts, useUpdateProduct } from "@/hooks/admin/useAdmin";

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [inventoryQuantity, setInventoryQuantity] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  
  const { data: productsData, isLoading, error } = useProducts();
  const updateProductMutation = useUpdateProduct();
  
  const products = productsData?.products || [];
  
  // Filter products based on search term
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determine stock status
  const getStockStatus = (quantity: number, isAvailable: boolean) => {
    if (!isAvailable) return "out-of-stock";
    if (quantity === 0) return "out-of-stock";
    if (quantity <= lowStockThreshold) return "low-stock";
    return "in-stock";
  };
  
  const getStockStatusBadge = (quantity: number, isAvailable: boolean) => {
    const status = getStockStatus(quantity, isAvailable);
    
    switch (status) {
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "low-stock":
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">In Stock</Badge>;
    }
  };
  
  const handleEditInventory = (product: any) => {
    setEditingProduct(product);
    setInventoryQuantity(product.inventoryQuantity?.toString() || "0");
    setIsAvailable(product.isAvailable ?? true);
  };
  
  const handleSaveInventory = async () => {
    if (!editingProduct) return;
    
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          inventoryQuantity: parseInt(inventoryQuantity) || 0,
          isAvailable: isAvailable
        }
      });
      
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading inventory data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading inventory: {(error as Error).message}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="mt-2 text-gray-700">
          Manage your product inventory levels and availability.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                    <p className="text-2xl font-bold">
                      {products.filter((p: any) => getStockStatus(p.inventoryQuantity, p.isAvailable) === "in-stock").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold">
                      {products.filter((p: any) => getStockStatus(p.inventoryQuantity, p.isAvailable) === "low-stock").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold">
                      {products.filter((p: any) => getStockStatus(p.inventoryQuantity, p.isAvailable) === "out-of-stock").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="low-stock-threshold">Low stock threshold:</Label>
              <Input
                id="low-stock-threshold"
                type="number"
                className="w-20"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.brand?.name || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${
                        getStockStatus(product.inventoryQuantity, product.isAvailable) === "out-of-stock" ? "text-red-600" :
                        getStockStatus(product.inventoryQuantity, product.isAvailable) === "low-stock" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {product.inventoryQuantity || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStockStatusBadge(product.inventoryQuantity, product.isAvailable)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditInventory(product)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Inventory: {product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="inventory-quantity">Inventory Quantity</Label>
                              <Input
                                id="inventory-quantity"
                                type="number"
                                value={inventoryQuantity}
                                onChange={(e) => setInventoryQuantity(e.target.value)}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="is-available"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label htmlFor="is-available">Product is available for sale</Label>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingProduct(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleSaveInventory}
                                disabled={updateProductMutation.isPending}
                              >
                                {updateProductMutation.isPending ? "Saving..." : "Save"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}