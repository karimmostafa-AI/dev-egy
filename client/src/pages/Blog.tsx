import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "The Evolution of Medical Uniforms: From Basic to Fashion-Forward",
    excerpt: "Discover how medical uniforms have transformed from purely functional garments to stylish pieces that boost confidence and professionalism.",
    author: "Dr. Emily Roberts",
    date: "2023-05-15",
    category: "Industry Trends",
    readTime: "5 min read",
    image: "/images/blog/uniform-evolution.jpg"
  },
  {
    id: 2,
    title: "Top 10 Features to Look for in Anti-Microbial Scrubs",
    excerpt: "Not all scrubs are created equal. Here's what to consider when choosing the best anti-microbial scrubs for your profession.",
    author: "Nurse Manager Sarah Chen",
    date: "2023-04-28",
    category: "Product Guide",
    readTime: "7 min read",
    image: "/images/blog/anti-microbial-scrubs.jpg"
  },
  {
    id: 3,
    title: "How to Choose the Perfect Fit: A Complete Scrub Sizing Guide",
    excerpt: "Finding the right scrub fit can be challenging. Our comprehensive guide helps you choose the perfect size for comfort and mobility.",
    author: "Fit Specialist Michael Torres",
    date: "2023-04-12",
    category: "Sizing & Fit",
    readTime: "6 min read",
    image: "/images/blog/scrub-sizing.jpg"
  },
  {
    id: 4,
    title: "Sustainable Medical Wear: Eco-Friendly Options for Healthcare Professionals",
    excerpt: "Learn about the growing trend of sustainable medical uniforms and how you can make environmentally conscious choices.",
    author: "Environmental Health Expert Lisa Wong",
    date: "2023-03-30",
    category: "Sustainability",
    readTime: "8 min read",
    image: "/images/blog/sustainable-uniforms.jpg"
  },
  {
    id: 5,
    title: "The Science Behind Moisture-Wicking Fabrics in Medical Wear",
    excerpt: "Explore how advanced fabric technology keeps healthcare professionals cool and dry during long shifts.",
    author: "Textile Engineer Dr. James Peterson",
    date: "2023-03-15",
    category: "Fabric Technology",
    readTime: "6 min read",
    image: "/images/blog/moisture-wicking.jpg"
  },
  {
    id: 6,
    title: "Color Psychology in Medical Uniforms: How Colors Affect Patient Care",
    excerpt: "Discover how color choices in medical uniforms can influence patient comfort and create healing environments.",
    author: "Healthcare Design Consultant Amanda Foster",
    date: "2023-02-28",
    category: "Design & Psychology",
    readTime: "5 min read",
    image: "/images/blog/color-psychology.jpg"
  }
];

const categories = [
  "All Categories",
  "Industry Trends",
  "Product Guide",
  "Sizing & Fit",
  "Sustainability",
  "Fabric Technology",
  "Design & Psychology"
];

export default function Blog() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = 4;
  
  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Medical Uniform Insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice, industry trends, and practical guides for healthcare professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-36 space-y-8">
              {/* Search */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Search Articles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search blog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Popular Tags */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Scrubs</Badge>
                  <Badge variant="secondary">Lab Coats</Badge>
                  <Badge variant="secondary">Footwear</Badge>
                  <Badge variant="secondary">Fabric</Badge>
                  <Badge variant="secondary">Sustainability</Badge>
                  <Badge variant="secondary">Fit</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredPosts.length} articles
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="bg-gray-200 border-2 border-dashed w-full h-full min-h-48" />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span className="text-sm text-muted-foreground">{post.readTime}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer"
                            onClick={() => setLocation(`/blog/${post.id}`)}>
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setLocation(`/blog/${post.id}`)}>
                            Read More <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or category filter</p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
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
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}