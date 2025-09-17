import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import ProductFilters from '@/components/ProductFilters';
import SortDropdown from '@/components/product/SortDropdown';
import Footer from '@/components/Footer';
import { sampleProducts } from '@/data/products';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 9;

export default function LabCoatsPage() {
  const [location, setLocation] = useLocation();
  // Filter products to show only lab coats
  const labCoatProducts = sampleProducts.filter(product => 
    product.name.toLowerCase().includes('coat') || 
    product.name.toLowerCase().includes('lab')
  );
  const [filteredProducts, setFilteredProducts] = useState(labCoatProducts);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    
    let filtered = [...labCoatProducts];
    
    Object.entries(filters).forEach(([filterType, filterValues]) => {
      if (filterValues.length === 0) return;
      
      filtered = filtered.filter(product => {
        switch (filterType) {
          case 'brand':
            return filterValues.some(brandSlug => 
              product.brand.toLowerCase().replace(/[^a-z0-9]/g, '-') === brandSlug
            );
          case 'color':
            return filterValues.some(color =>
              product.colors.some(productColor =>
                productColor.toLowerCase().includes(color.toLowerCase())
              )
            );
          case 'size':
            return filterValues.some(size =>
              product.sizes.some(productSize =>
                productSize.toLowerCase() === size.toLowerCase()
              )
            );
          case 'sale':
            if (filterValues.includes('all-sale') && product.isOnSale) return true;
            return false;
          default:
            return true;
        }
      });
    });
    
    setFilteredProducts(filtered);
  };

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredProducts];
    setCurrentPage(1);
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
          <h1 className="text-3xl font-bold mb-2">Lab Coats</h1>
          <p className="text-muted-foreground">
            Professional lab coats for healthcare professionals and medical students.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-36">
            <ProductFilters onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-muted-foreground">
              Showing {filteredProducts.length} items
            </h2>
            <SortDropdown onSortChange={handleSortChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setLocation(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && <Badge className="text-xs font-bold">NEW</Badge>}
                    {product.isOnSale && <Badge variant="destructive" className="text-xs font-bold">SALE</Badge>}
                  </div>

                  {/* Favorite */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-destructive text-destructive' : ''}`} 
                      />
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">{renderStars(Math.floor(product.rating))}</div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-lg text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(product.originalPrice / 100).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Add to cart: ${product.name}`);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No lab coats match your filters</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more products</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}