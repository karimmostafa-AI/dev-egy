import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2, Star, Grid, List } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

// Mock wishlist data - in a real app this would come from a backend API
const mockWishlistItems = [
  {
    id: '1',
    name: 'Cherokee Workwear Scrub Set',
    brand: 'Cherokee',
    price: 49.99,
    comparePrice: 59.99,
    image: '/images/scrub-set-1.jpg',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    addedDate: '2024-09-15'
  },
  {
    id: '2',
    name: 'FIGS Technical Collection Scrubs',
    brand: 'FIGS',
    price: 75.00,
    image: '/images/scrub-set-2.jpg',
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    addedDate: '2024-09-10'
  },
  {
    id: '3',
    name: 'Crocs Medical Professional Clogs',
    brand: 'Crocs',
    price: 54.99,
    comparePrice: 64.99,
    image: '/images/medical-shoes.jpg',
    rating: 4.6,
    reviewCount: 267,
    inStock: false,
    addedDate: '2024-09-08'
  },
  {
    id: '4',
    name: 'Littmann Classic III Stethoscope',
    brand: 'Littmann',
    price: 189.99,
    image: '/images/stethoscope.jpg',
    rating: 4.9,
    reviewCount: 445,
    inStock: true,
    addedDate: '2024-09-05'
  }
];

export default function Wishlist() {
  const [location, setLocation] = useLocation();
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, startIndex + itemsPerPage);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (itemId: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (item) {
      console.log(`Adding ${item.name} to cart`);
      // In a real app, this would call the cart API
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentItems.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow group"
          data-testid={`wishlist-item-${item.id}`}
        >
          {/* Product Image */}
          <div className="relative h-64 bg-muted overflow-hidden">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {item.comparePrice && (
                <Badge variant="destructive" className="text-xs font-bold">
                  SALE
                </Badge>
              )}
              {!item.inStock && (
                <Badge variant="secondary" className="text-xs font-bold">
                  OUT OF STOCK
                </Badge>
              )}
            </div>

            {/* Remove from wishlist */}
            <div className="absolute top-3 right-3">
              <Button 
                size="sm" 
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => removeFromWishlist(item.id)}
                data-testid={`remove-wishlist-${item.id}`}
              >
                <Heart className="h-4 w-4 fill-destructive text-destructive" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 
                className="font-semibold text-sm group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => setLocation(`/product/${item.slug || item.id}`)}
                data-testid={`product-name-${item.id}`}
              >
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground">{item.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(item.rating)}</div>
              <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg text-primary">
                ${item.price.toFixed(2)}
              </span>
              {item.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${item.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                size="sm"
                disabled={!item.inStock}
                onClick={() => addToCart(item.id)}
                data-testid={`add-to-cart-${item.id}`}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromWishlist(item.id)}
                data-testid={`remove-button-${item.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {currentItems.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
          data-testid={`wishlist-item-list-${item.id}`}
        >
          <div className="p-6 flex items-center gap-6">
            {/* Product Image */}
            <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 
                    className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setLocation(`/product/${item.slug || item.id}`)}
                    data-testid={`product-name-list-${item.id}`}
                  >
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground">{item.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-muted-foreground">({item.reviewCount} reviews)</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Added on {new Date(item.addedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-xl text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Status badges */}
                  <div className="flex gap-1 mb-3 justify-end">
                    {item.comparePrice && (
                      <Badge variant="destructive" className="text-xs">SALE</Badge>
                    )}
                    {!item.inStock && (
                      <Badge variant="secondary" className="text-xs">OUT OF STOCK</Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={!item.inStock}
                      onClick={() => addToCart(item.id)}
                      data-testid={`add-to-cart-list-${item.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      data-testid={`remove-button-list-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Page Header */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2" data-testid="wishlist-title">My Wishlist</h1>
          <p className="text-muted-foreground">Your saved items ({wishlistItems.length} items)</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding items to your wishlist by clicking the heart icon on products you love
            </p>
            <Button onClick={() => setLocation('/')} data-testid="continue-shopping">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {viewMode === 'grid' ? <GridView /> : <ListView />}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}