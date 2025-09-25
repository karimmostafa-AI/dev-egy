import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Share2, 
  Filter,
  Grid,
  List,
  Calendar,
  Tag
} from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

// Mock collection data - in a real app this would come from a backend API
const mockCollection = {
  id: '1',
  name: 'Fall 2024 Professional Collection',
  slug: 'fall-2024-professional',
  description: 'Sophisticated medical uniforms perfect for the changing seasons. This collection features premium fabrics, modern cuts, and professional styling that keeps you comfortable throughout your shift.',
  longDescription: `Our Fall 2024 Professional Collection represents the perfect blend of style and functionality for today's healthcare professionals. Each piece is carefully crafted with premium materials and innovative design features that prioritize both comfort and professional appearance.

This collection includes versatile scrub sets, lab coats, and accessories that work seamlessly together, allowing you to create a cohesive professional wardrobe. The rich autumn colors and sophisticated details make these pieces perfect for transitioning from the clinical environment to professional meetings.

Key features include moisture-wicking fabrics, stretch panels for enhanced mobility, antimicrobial treatments, and reinforced stress points for durability. Whether you're a nurse, doctor, or healthcare professional, this collection offers the perfect combination of style and performance.`,
  image: '/images/collections/fall-2024-hero.jpg',
  images: [
    '/images/collections/fall-2024-1.jpg',
    '/images/collections/fall-2024-2.jpg',
    '/images/collections/fall-2024-3.jpg'
  ],
  productCount: 24,
  tags: ['Fall', 'Professional', 'New', 'Premium'],
  createdDate: '2024-09-01',
  featured: true,
  season: 'Fall 2024',
  colors: ['Navy', 'Burgundy', 'Forest Green', 'Charcoal', 'Deep Purple'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  priceRange: { min: 39.99, max: 129.99 }
};

// Mock products in collection
const mockProducts = [
  {
    id: '1',
    name: 'Professional V-Neck Scrub Top - Navy',
    slug: 'professional-v-neck-scrub-top-navy',
    brand: 'Cherokee',
    price: 49.99,
    comparePrice: 59.99,
    image: '/images/products/scrub-top-navy.jpg',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    colors: ['Navy', 'Burgundy', 'Forest Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Tailored Scrub Pants - Navy',
    slug: 'tailored-scrub-pants-navy',
    brand: 'Cherokee',
    price: 39.99,
    comparePrice: 49.99,
    image: '/images/products/scrub-pants-navy.jpg',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    colors: ['Navy', 'Burgundy', 'Forest Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Premium Lab Coat - White',
    slug: 'premium-lab-coat-white',
    brand: 'FIGS',
    price: 79.99,
    image: '/images/products/lab-coat-white.jpg',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    colors: ['White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Professional Cardigan - Burgundy',
    slug: 'professional-cardigan-burgundy',
    brand: 'WonderWink',
    price: 69.99,
    image: '/images/products/cardigan-burgundy.jpg',
    rating: 4.6,
    reviewCount: 67,
    inStock: false,
    colors: ['Burgundy', 'Navy', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL']
  }
];

export default function CollectionDetail() {
  const [location, setLocation] = useLocation();
  const { slug } = useParams();
  const [collection] = useState(mockCollection);
  const [products, setProducts] = useState(mockProducts);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterColor, setFilterColor] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesColor = filterColor === 'all' || product.colors.includes(filterColor);
    const matchesSize = filterSize === 'all' || product.sizes.includes(filterSize);
    return matchesColor && matchesSize;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Back Navigation */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/collections')}
            data-testid="back-to-collections"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </div>
      </div>

      {/* Collection Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Image */}
          <div className="space-y-4">
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-center px-8">
                  {collection.name} - Hero Image
                </span>
              </div>
              
              {/* Featured badge */}
              {collection.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="text-sm font-bold">FEATURED COLLECTION</Badge>
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-2">
              {collection.images.map((image, index) => (
                <div key={index} className="h-24 bg-muted rounded overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Image {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collection Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="collection-name">
                    {collection.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Launched {formatDate(collection.createdDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid="share-collection">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" data-testid="save-collection">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                {collection.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {collection.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Collection Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{collection.productCount}</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${collection.priceRange.min} - ${collection.priceRange.max}
                  </div>
                  <div className="text-sm text-muted-foreground">Price Range</div>
                </CardContent>
              </Card>
            </div>

            {/* Available Colors */}
            <div>
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {collection.colors.map((color) => (
                  <Badge key={color} variant="outline">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Available Sizes */}
            <div>
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {collection.sizes.map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>About This Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {collection.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Products in this Collection</h2>
            <div className="flex items-center gap-2">
              <Select value={filterColor} onValueChange={setFilterColor}>
                <SelectTrigger className="w-[120px]" data-testid="filter-color">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {collection.colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger className="w-[120px]" data-testid="filter-size">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {collection.sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]" data-testid="sort-products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  data-testid="grid-view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-testid="list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setLocation(`/product/${product.slug || product.id}`)}
                data-testid={`product-card-${product.id}`}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-sm text-center px-4">
                      {product.name}
                    </span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.comparePrice && (
                      <Badge variant="destructive" className="text-xs font-bold">
                        SALE
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary" className="text-xs font-bold">
                        OUT OF STOCK
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      data-testid={`favorite-${product.id}`}
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-destructive text-destructive' : ''}`} 
                      />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/product/${product.slug || product.id}`);
                      }}
                      data-testid={`view-${product.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-lg text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Add to cart: ${product.name}`);
                    }}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
        </div>
      </div>

      <Footer />
    </div>
  );
}