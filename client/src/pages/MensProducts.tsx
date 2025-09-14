import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import ProductFilters from '@/components/ProductFilters';
import Footer from '@/components/Footer';

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

// Sample product data based on Egyptian medical uniform market
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Professional V-Neck Scrub Top",
    brand: "Seen",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 124,
    image: "/api/placeholder/300/400",
    isOnSale: true,
    colors: ["Black", "Navy", "White"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Executive Jogger Scrub Pants",
    brand: "Hleo",
    price: 349,
    rating: 4.9,
    reviewCount: 89,
    image: "/api/placeholder/300/400",
    isNew: true,
    colors: ["Black", "Charcoal", "Navy"],
    sizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 3,
    name: "Comfort Plus Medical Top",
    brand: "Omaima",
    price: 279,
    originalPrice: 329,
    rating: 4.7,
    reviewCount: 156,
    image: "/api/placeholder/300/400",
    isOnSale: true,
    colors: ["White", "Light Blue", "Black"],
    sizes: ["S", "M", "L"]
  },
  {
    id: 4,
    name: "Desert Professional Set",
    brand: "Cairo Medical",
    price: 599,
    rating: 4.9,
    reviewCount: 67,
    image: "/api/placeholder/300/400",
    colors: ["Khaki", "Olive", "Black"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: 5,
    name: "Alexandria Coastal Scrubs",
    brand: "Alexandria",
    price: 459,
    rating: 4.6,
    reviewCount: 91,
    image: "/api/placeholder/300/400",
    colors: ["Navy", "Teal", "White"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 6,
    name: "Nile Flow Comfort Pants",
    brand: "Nile Healthcare",
    price: 329,
    originalPrice: 379,
    rating: 4.8,
    reviewCount: 203,
    image: "/api/placeholder/300/400",
    isOnSale: true,
    colors: ["Black", "Navy", "Charcoal"],
    sizes: ["M", "L", "XL", "2XL"]
  }
];

export default function MensProducts() {
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
    // Filter logic would go here - for demo purposes, keeping all products
    setFilteredProducts(sampleProducts);
  };

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredProducts];
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
      case 'newest':
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
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
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => console.log(`View product ${product.id}`)}
              data-testid={`product-card-${product.id}`}
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isOnSale && (
                    <Badge variant="destructive" className="text-xs">
                      Sale
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="text-xs">
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
                  <span className="font-bold text-lg">
                    {product.price} LE
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice} LE
                    </span>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => console.log('Load more products')}
            data-testid="load-more-products"
          >
            Load More Products
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}