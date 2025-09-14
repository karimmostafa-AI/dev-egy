import { useState } from 'react';
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
import Footer from '@/components/Footer';
import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isOnSale?: boolean;
  isNew?: boolean;
  colors: string[];
  sizes: string[];
}

// Comprehensive men's medical uniform product catalog
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Cherokee Revolution V-Neck Top",
    brand: "Cherokee",
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 342,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "White", "Hunter Green"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 2,
    name: "Barco One Athletic Jogger Pants",
    brand: "Barco",
    price: 3299,
    rating: 4.9,
    reviewCount: 286,
    image: maleWorkerImage,
    isNew: true,
    colors: ["Black", "Charcoal", "Navy", "White"],
    sizes: ["M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 3,
    name: "WonderWink Renew Cargo Top",
    brand: "WonderWink",
    price: 2199,
    originalPrice: 2799,
    rating: 4.7,
    reviewCount: 198,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["White", "Navy", "Black", "Royal Blue"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Healing Hands Purple Label Top",
    brand: "Healing Hands",
    price: 3599,
    rating: 4.9,
    reviewCount: 124,
    image: maleWorkerImage,
    colors: ["Black", "Navy", "White"],
    sizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 5,
    name: "Greys Anatomy Classic Fit Scrub Set",
    brand: "Greys Anatomy",
    price: 4599,
    rating: 4.6,
    reviewCount: 156,
    image: maleWorkerImage,
    colors: ["Navy", "Black", "White", "Hunter Green"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 6,
    name: "Dickies Dynamix Cargo Pants",
    brand: "Dickies",
    price: 2899,
    originalPrice: 3299,
    rating: 4.8,
    reviewCount: 267,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "Charcoal", "White"],
    sizes: ["M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 7,
    name: "Landau Stretch V-Neck Scrub Top",
    brand: "Landau",
    price: 2699,
    rating: 4.7,
    reviewCount: 89,
    image: maleWorkerImage,
    isNew: true,
    colors: ["Navy", "Black", "White", "Royal Blue"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Koi Lite Peace Cargo Pants",
    brand: "Koi",
    price: 2999,
    originalPrice: 3499,
    rating: 4.6,
    reviewCount: 145,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "White", "Hunter Green"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 9,
    name: "UA Butter-Soft Men's V-Neck",
    brand: "Uniform Advantage",
    price: 1999,
    originalPrice: 2499,
    rating: 4.8,
    reviewCount: 445,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "White", "Royal Blue"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 10,
    name: "FIGS Technical Collection Top",
    brand: "FIGS",
    price: 3899,
    rating: 4.9,
    reviewCount: 298,
    image: maleWorkerImage,
    isNew: true,
    colors: ["Black", "Navy", "White"],
    sizes: ["M", "L", "XL", "2XL"]
  }
];

const PRODUCTS_PER_PAGE = 8;

export default function MensProducts() {
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
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

  const normalizeBrand = (brandName: string) => {
    return brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when filtering
    
    let filtered = [...sampleProducts];
    
    // Apply filters
    Object.entries(filters).forEach(([filterType, filterValues]) => {
      if (filterValues.length === 0) return;
      
      filtered = filtered.filter(product => {
        switch (filterType) {
          case 'brand':
            return filterValues.some(brandSlug => 
              normalizeBrand(product.brand) === brandSlug
            );
          case 'color':
            return filterValues.some(color =>
              product.colors.some(productColor =>
                productColor.toLowerCase().includes(color.toLowerCase()) ||
                color.toLowerCase().includes(productColor.toLowerCase())
              )
            );
          case 'size':
            return filterValues.some(size =>
              product.sizes.some(productSize =>
                productSize.toLowerCase() === size.toLowerCase()
              )
            );
          case 'sale':
            if (filterValues.includes('limited-time') && product.isOnSale) return true;
            if (filterValues.includes('clearance') && product.isOnSale) return true;
            if (filterValues.includes('all-sale') && product.isOnSale) return true;
            return false;
          case 'category':
            // Map category filters to product characteristics
            if (filterValues.includes('tops') && product.name.toLowerCase().includes('top')) return true;
            if (filterValues.includes('pants') && (product.name.toLowerCase().includes('pant') || product.name.toLowerCase().includes('jogger'))) return true;
            if (filterValues.includes('sets') && product.name.toLowerCase().includes('set')) return true;
            if (filterValues.includes('jackets') && product.name.toLowerCase().includes('jacket')) return true;
            return filterValues.length === 0; // If no category match but category filter applied, exclude
          default:
            return true;
        }
      });
    });
    
    setFilteredProducts(filtered);
  };

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredProducts];
    setCurrentPage(1); // Reset to first page when sorting
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
        // Sort by isNew first, then by id (assuming higher id = newer)
        sorted.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.id - a.id;
        });
        break;
      default: // best-match
        // Keep original order for 'best-match' and others
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
          <h1 className="text-3xl font-bold mb-2">Men's Medical Uniforms</h1>
          <p className="text-muted-foreground">
            Professional scrubs and medical wear designed for Egyptian healthcare professionals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <ProductFilters
          itemCount={filteredProducts.length}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => console.log(`View product ${product.id}`)}
              data-testid={`product-card-${product.id}`}
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
                  {product.isOnSale && (
                    <Badge variant="destructive" className="text-xs font-bold">
                      SALE
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                      NEW
                    </Badge>
                  )}
                </div>

                {/* Favorite & Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <Button size="sm" variant="secondary" className="text-xs px-2">
                    Quick View
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
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ${(product.originalPrice / 100).toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full bg-gray-400 border"
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  className="w-full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Add to cart: ${product.name}`);
                  }}
                  data-testid={`add-to-cart-${product.id}`}
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
                
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                
                {/* Current page range */}
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
                
                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
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
        
        {/* Results Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>

      <Footer />
    </div>
  );
}