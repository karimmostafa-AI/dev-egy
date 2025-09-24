import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter, SortAsc, Grid, List, Eye, Heart, Calendar } from 'lucide-react';
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

// Mock collections data - in a real app this would come from a backend API
const mockCollections = [
  {
    id: '1',
    name: 'Fall 2024 Professional Collection',
    slug: 'fall-2024-professional',
    description: 'Sophisticated medical uniforms perfect for the changing seasons.',
    image: '/images/collections/fall-2024.jpg',
    productCount: 24,
    tags: ['Fall', 'Professional', 'New'],
    createdDate: '2024-09-01',
    featured: true,
    season: 'Fall 2024'
  },
  {
    id: '2',
    name: 'Essential Scrubs Collection',
    slug: 'essential-scrubs',
    description: 'Basic, comfortable scrubs for everyday healthcare professionals.',
    image: '/images/collections/essential-scrubs.jpg',
    productCount: 18,
    tags: ['Essential', 'Everyday', 'Comfort'],
    createdDate: '2024-08-15',
    featured: true,
    season: 'All Season'
  },
  {
    id: '3',
    name: 'Premium Lab Coats Collection',
    slug: 'premium-lab-coats',
    description: 'High-quality lab coats for doctors and medical professionals.',
    image: '/images/collections/premium-lab-coats.jpg',
    productCount: 12,
    tags: ['Premium', 'Lab Coats', 'Professional'],
    createdDate: '2024-08-01',
    featured: false,
    season: 'All Season'
  },
  {
    id: '4',
    name: 'Pediatric Care Collection',
    slug: 'pediatric-care',
    description: 'Fun and colorful medical uniforms designed for pediatric healthcare.',
    image: '/images/collections/pediatric-care.jpg',
    productCount: 16,
    tags: ['Pediatric', 'Colorful', 'Kids'],
    createdDate: '2024-07-20',
    featured: true,
    season: 'All Season'
  },
  {
    id: '5',
    name: 'Antimicrobial Technology',
    slug: 'antimicrobial-tech',
    description: 'Advanced medical uniforms with antimicrobial protection.',
    image: '/images/collections/antimicrobial.jpg',
    productCount: 21,
    tags: ['Technology', 'Antimicrobial', 'Protection'],
    createdDate: '2024-07-01',
    featured: false,
    season: 'All Season'
  },
  {
    id: '6',
    name: 'Sustainable Scrubs',
    slug: 'sustainable-scrubs',
    description: 'Eco-friendly medical uniforms made from sustainable materials.',
    image: '/images/collections/sustainable.jpg',
    productCount: 14,
    tags: ['Eco-Friendly', 'Sustainable', 'Green'],
    createdDate: '2024-06-15',
    featured: false,
    season: 'All Season'
  },
  {
    id: '7',
    name: 'Athletic Performance Scrubs',
    slug: 'athletic-performance',
    description: 'High-performance scrubs designed for active healthcare workers.',
    image: '/images/collections/athletic.jpg',
    productCount: 19,
    tags: ['Athletic', 'Performance', 'Active'],
    createdDate: '2024-06-01',
    featured: true,
    season: 'Summer 2024'
  },
  {
    id: '8',
    name: 'Luxury Medical Uniforms',
    slug: 'luxury-medical',
    description: 'Premium, luxury medical uniforms for discerning professionals.',
    image: '/images/collections/luxury.jpg',
    productCount: 8,
    tags: ['Luxury', 'Premium', 'Exclusive'],
    createdDate: '2024-05-15',
    featured: false,
    season: 'All Season'
  }
];

export default function Collections() {
  const [location, setLocation] = useLocation();
  const [collections, setCollections] = useState(mockCollections);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const collectionsPerPage = 8;

  // Filter and search collections
  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'featured' && collection.featured) ||
                         (filterBy === 'seasonal' && collection.season !== 'All Season');
    
    return matchesSearch && matchesFilter;
  });

  // Sort collections
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'oldest':
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return b.productCount - a.productCount;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedCollections.length / collectionsPerPage);
  const startIndex = (currentPage - 1) * collectionsPerPage;
  const currentCollections = sortedCollections.slice(startIndex, startIndex + collectionsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentCollections.map((collection) => (
        <Card
          key={collection.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => setLocation(`/collections/${collection.slug}`)}
          data-testid={`collection-card-${collection.slug}`}
        >
          {/* Collection Image */}
          <div className="relative h-48 bg-muted overflow-hidden">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground font-medium text-center px-4">
                {collection.name}
              </span>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {collection.featured && (
                <Badge className="text-xs font-bold">FEATURED</Badge>
              )}
              {collection.season !== 'All Season' && (
                <Badge variant="secondary" className="text-xs">
                  {collection.season}
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button 
                size="sm" 
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`View collection: ${collection.name}`);
                }}
                data-testid={`view-collection-${collection.slug}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Add collection to favorites: ${collection.name}`);
                }}
                data-testid={`favorite-collection-${collection.slug}`}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Collection Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                {collection.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {formatDate(collection.createdDate)}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {collection.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {collection.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {collection.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{collection.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* Product Count */}
            <p className="text-sm font-medium text-primary">
              {collection.productCount} products
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {currentCollections.map((collection) => (
        <Card
          key={collection.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setLocation(`/collections/${collection.slug}`)}
          data-testid={`collection-list-${collection.slug}`}
        >
          <div className="p-6 flex items-center gap-6">
            {/* Collection Image */}
            <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-xs text-center px-2">
                  {collection.name}
                </span>
              </div>
            </div>

            {/* Collection Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-xl hover:text-primary transition-colors">
                      {collection.name}
                    </h3>
                    <div className="flex gap-1">
                      {collection.featured && (
                        <Badge className="text-xs">FEATURED</Badge>
                      )}
                      {collection.season !== 'All Season' && (
                        <Badge variant="secondary" className="text-xs">
                          {collection.season}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(collection.createdDate)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <p className="text-sm text-muted-foreground mb-1">Products</p>
                  <p className="text-2xl font-bold text-primary">
                    {collection.productCount}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`View collection: ${collection.name}`);
                      }}
                      data-testid={`view-list-${collection.slug}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
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
          <h1 className="text-3xl font-bold mb-2" data-testid="collections-title">Our Collections</h1>
          <p className="text-muted-foreground">
            Discover curated collections of medical uniforms and healthcare apparel
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
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="collections-search"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px]" data-testid="collections-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]" data-testid="collections-sort">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="products">Most Products</SelectItem>
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
            Showing {currentCollections.length} of {sortedCollections.length} collections
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Collections Grid/List */}
        {sortedCollections.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No collections found</h3>
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