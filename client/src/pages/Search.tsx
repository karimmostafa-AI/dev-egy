import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Search } from 'lucide-react';
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
import ProductFilters from '@/components/ProductFilters';
import SortDropdown from '@/components/product/SortDropdown';
import Footer from '@/components/Footer';
import { useSearchProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 12;

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: PRODUCTS_PER_PAGE
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { data, isLoading, error } = useSearchProducts(searchQuery, filters);

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Extract search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      page: 1
    }));
  }, [location]);

  const toggleFavorite = (productId: string) => {
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

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    // Convert filter format to what the backend expects
    const backendFilters: any = {
      page: 1,
      limit: PRODUCTS_PER_PAGE
    };
    
    // Process category filters
    if (newFilters.category && newFilters.category.length > 0) {
      backendFilters.category = newFilters.category[0]; // For now, just use the first category
    }
    
    // Process brand filters
    if (newFilters.brand && newFilters.brand.length > 0) {
      backendFilters.brand = newFilters.brand[0]; // For now, just use the first brand
    }
    
    setFilters(backendFilters);
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sort,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      page: 1
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-36">
            <ProductFilters 
              itemCount={totalCount}
              onFilterChange={handleFilterChange} 
              onSortChange={handleSortChange} 
            />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-muted-foreground">
              {totalCount} results for "{searchQuery}"
            </h2>
            <SortDropdown onSortChange={handleSortChange} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setLocation(`/product/${product.id}`)}
                  >
                    {/* Product Image */}
                    <div className="relative h-64 bg-muted overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isFeatured && <Badge className="text-xs font-bold">FEATURED</Badge>}
                        {product.comparePrice && (
                          <Badge variant="destructive" className="text-xs font-bold">
                            SALE
                          </Badge>
                        )}
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
                        <p className="text-xs text-muted-foreground">
                          {product.brand?.name || 'Unknown Brand'}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg text-primary">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${parseFloat(product.comparePrice).toFixed(2)}
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
                          onClick={() => handlePageChange(Math.max(filters.page - 1, 1))}
                          className={filters.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (filters.page <= 3) {
                          pageNum = i + 1;
                        } else if (filters.page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = filters.page - 2 + i;
                        }
                        
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink 
                                onClick={() => handlePageChange(pageNum)}
                                isActive={filters.page === pageNum}
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
                          onClick={() => handlePageChange(Math.min(filters.page + 1, totalPages))}
                          className={filters.page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Empty state */}
              {products.length === 0 && !isLoading && (
                <div className="text-center py-16">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products match your search</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}