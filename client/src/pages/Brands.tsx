import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter, SortAsc, Grid, List, TrendingUp } from 'lucide-react';
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

// Mock brands data - in a real app this would come from a backend API
const mockBrands = [
  {
    id: '1',
    name: 'Cherokee',
    slug: 'cherokee',
    description: 'Leading medical apparel brand trusted by healthcare professionals worldwide.',
    logo: '/images/brands/cherokee-logo.jpg',
    productCount: 234,
    rating: 4.5,
    reviewCount: 1284,
    founded: 1972,
    categories: ['Scrubs', 'Lab Coats', 'Accessories'],
    isPopular: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'FIGS',
    slug: 'figs',
    description: 'Modern scrubs designed for the next generation of healthcare heroes.',
    logo: '/images/brands/figs-logo.jpg',
    productCount: 189,
    rating: 4.7,
    reviewCount: 892,
    founded: 2013,
    categories: ['Scrubs', 'Activewear', 'Accessories'],
    isPopular: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Dickies Medical',
    slug: 'dickies-medical',
    description: 'Durable and comfortable medical uniforms for demanding work environments.',
    logo: '/images/brands/dickies-logo.jpg',
    productCount: 156,
    rating: 4.3,
    reviewCount: 567,
    founded: 1922,
    categories: ['Scrubs', 'Shoes', 'Outerwear'],
    isPopular: false,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Crocs',
    slug: 'crocs',
    description: 'Comfortable, slip-resistant footwear designed for healthcare professionals.',
    logo: '/images/brands/crocs-logo.jpg',
    productCount: 89,
    rating: 4.6,
    reviewCount: 1156,
    founded: 2002,
    categories: ['Shoes', 'Accessories'],
    isPopular: true,
    isFeatured: false
  },
  {
    id: '5',
    name: 'Littmann',
    slug: 'littmann',
    description: 'Premium stethoscopes and diagnostic equipment for medical professionals.',
    logo: '/images/brands/littmann-logo.jpg',
    productCount: 45,
    rating: 4.9,
    reviewCount: 2234,
    founded: 1961,
    categories: ['Medical Equipment', 'Accessories'],
    isPopular: false,
    isFeatured: true
  },
  {
    id: '6',
    name: 'WonderWink',
    slug: 'wonderwink',
    description: 'Innovative medical apparel with advanced fabric technology.',
    logo: '/images/brands/wonderwink-logo.jpg',
    productCount: 167,
    rating: 4.4,
    reviewCount: 423,
    founded: 2003,
    categories: ['Scrubs', 'Lab Coats'],
    isPopular: false,
    isFeatured: false
  },
  {
    id: '7',
    name: 'Barco One',
    slug: 'barco-one',
    description: 'Performance scrubs that combine style, comfort, and functionality.',
    logo: '/images/brands/barco-logo.jpg',
    productCount: 134,
    rating: 4.5,
    reviewCount: 678,
    founded: 1929,
    categories: ['Scrubs', 'Lab Coats', 'Accessories'],
    isPopular: false,
    isFeatured: false
  },
  {
    id: '8',
    name: 'Jaanuu',
    slug: 'jaanuu',
    description: 'Stylish scrubs and medical apparel with antimicrobial technology.',
    logo: '/images/brands/jaanuu-logo.jpg',
    productCount: 98,
    rating: 4.6,
    reviewCount: 345,
    founded: 2013,
    categories: ['Scrubs', 'Accessories'],
    isPopular: false,
    isFeatured: false
  }
];

export default function Brands() {
  const [location, setLocation] = useLocation();
  const [brands, setBrands] = useState(mockBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 12;

  // Filter and search brands
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'popular' && brand.isPopular) ||
                         (filterBy === 'featured' && brand.isFeatured);
    
    return matchesSearch && matchesFilter;
  });

  // Sort brands
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return b.productCount - a.productCount;
      case 'rating':
        return b.rating - a.rating;
      case 'founded':
        return b.founded - a.founded;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedBrands.length / brandsPerPage);
  const startIndex = (currentPage - 1) * brandsPerPage;
  const currentBrands = sortedBrands.slice(startIndex, startIndex + brandsPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const categories = Array.from(new Set(brands.flatMap(brand => brand.categories)));

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentBrands.map((brand) => (
        <Card
          key={brand.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => setLocation(`/brand/${brand.slug}`)}
          data-testid={`brand-card-${brand.slug}`}
        >
          {/* Brand Logo */}
          <div className="relative h-32 bg-muted p-4 flex items-center justify-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground font-medium">{brand.name}</span>
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {brand.isFeatured && (
                <Badge className="text-xs">FEATURED</Badge>
              )}
              {brand.isPopular && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  POPULAR
                </Badge>
              )}
            </div>
          </div>

          {/* Brand Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Founded {brand.founded}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {brand.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(brand.rating)}</div>
              <span className="text-sm text-muted-foreground">
                {brand.rating} ({brand.reviewCount} reviews)
              </span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-3">
              {brand.categories.slice(0, 2).map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
              {brand.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{brand.categories.length - 2} more
                </Badge>
              )}
            </div>

            {/* Product Count */}
            <p className="text-sm font-medium text-primary">
              {brand.productCount} products
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {currentBrands.map((brand) => (
        <Card
          key={brand.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setLocation(`/brand/${brand.slug}`)}
          data-testid={`brand-list-${brand.slug}`}
        >
          <div className="p-6 flex items-center gap-6">
            {/* Brand Logo */}
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-sm">{brand.name}</span>
              </div>
            </div>

            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-xl hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex gap-1">
                      {brand.isFeatured && (
                        <Badge className="text-xs">FEATURED</Badge>
                      )}
                      {brand.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          POPULAR
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {brand.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(brand.rating)}</div>
                    <span className="text-sm text-muted-foreground">
                      {brand.rating} ({brand.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {brand.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium mb-2">{brand.founded}</p>
                  <p className="text-lg font-semibold text-primary">
                    {brand.productCount} products
                  </p>
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
          <h1 className="text-3xl font-bold mb-2" data-testid="brands-title">Shop by Brand</h1>
          <p className="text-muted-foreground">
            Discover top medical apparel and equipment brands trusted by healthcare professionals
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="brands-search"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px]" data-testid="brands-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]" data-testid="brands-sort">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="products">Most Products</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="founded">Newest First</SelectItem>
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {currentBrands.length} of {sortedBrands.length} brands
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Brands Grid/List */}
        {sortedBrands.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <>
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