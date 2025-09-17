import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
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
import { Product } from '@/data/products';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 9;

const fetchProducts = async (filters: any) => {
  const queryParams = new URLSearchParams({
    limit: PRODUCTS_PER_PAGE.toString(),
    page: filters.page.toString(),
    sortBy: filters.sortBy,
    category: 'womens',
    ...filters.applied
  });
  const response = await fetch(`/api/products?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function WomensProducts() {
  const [location, setLocation] = useLocation();
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('best-match');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'womens', { page: currentPage, sortBy, applied: appliedFilters }],
    queryFn: () => fetchProducts({ page: currentPage, sortBy, applied: appliedFilters }),
    keepPreviousData: true,
  });

  const currentProducts = data?.products || [];
  const totalPages = data?.pagination.totalPages || 1;

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
    setCurrentPage(1);
    setAppliedFilters(filters);
  };

  const handleSortChange = (sort: string) => {
    setCurrentPage(1);
    setSortBy(sort);
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
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Women's Medical Uniforms</h1>
          <p className="text-muted-foreground">
            Professional scrubs and medical wear designed for healthcare professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-36">
            <ProductFilters onFilterChange={handleFilterChange} />
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-muted-foreground">
              {isLoading ? <Skeleton className="h-6 w-32" /> : `Showing ${data?.pagination.totalProducts.toLocaleString() || 0} items`}
            </h2>
            <SortDropdown onSortChange={handleSortChange} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">Failed to load products. Please try again.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProducts.map((product: Product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setLocation(`/product/${product.id}`)}
                >
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isOnSale && <Badge variant="destructive">SALE</Badge>}
                      {product.isNew && <Badge>NEW</Badge>}
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}>
                        <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-destructive text-destructive' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <div className="flex items-center gap-1 my-2">
                      <div className="flex">{renderStars(Math.floor(product.rating))}</div>
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-lg text-primary">${(product.price / 100).toFixed(2)}</span>
                      {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${(product.originalPrice / 100).toFixed(2)}</span>}
                    </div>
                    <Button className="w-full" size="sm" onClick={(e) => e.stopPropagation()}>Add to Cart</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                     <PaginationItem key={i}>
                       <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                     </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}