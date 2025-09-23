import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  highlight?: boolean;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.categories;
};

export default function CategoryNavigation() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const { data: categories = [], error, isLoading } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Map subcategories to their corresponding routes
  const getRouteForSubcategory = (subcategory: string, categoryName: string) => {
    const normalizedSubcategory = subcategory.toLowerCase();
    const normalizedCategory = categoryName.toLowerCase();
    
    // Handle main category pages
    if (normalizedSubcategory.includes('shop all men')) {
      return '/mens-products';
    }
    if (normalizedSubcategory.includes('shop all women')) {
      return '/womens-products';
    }
    
    // Handle specific product categories from PRODUCT CATEGORIES section
    if (normalizedCategory === 'product categories') {
      switch (normalizedSubcategory) {
        case 'scrubs':
          return '/scrubs';
        case 'lab coats':
          return '/lab-coats';
        case 'shoes':
          return '/shoes';
        case 'accessories':
          return '/accessories';
        default:
          return '/';
      }
    }
    
    // Handle resources section
    if (normalizedCategory === 'resources') {
      switch (normalizedSubcategory) {
        case 'blog':
          return '/blog';
        case 'faqs':
          return '/faqs';
        default:
          return '/';
      }
    }
    
    // Handle brand-specific pages
    if (normalizedCategory === 'brands') {
      // Convert brand name to URL-friendly format
      const brandSlug = normalizedSubcategory
        .replace(/®/g, '') // Remove trademark symbols
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      return `/brands/${brandSlug}`;
    }
    
    // Handle specific product categories from other sections
    if (normalizedSubcategory.includes('scrub') && !normalizedSubcategory.includes('accessories')) {
      return '/scrubs';
    }
    if (normalizedSubcategory.includes('lab coat')) {
      return '/lab-coats';
    }
    if (normalizedSubcategory.includes('footwear') || normalizedSubcategory.includes('shoe')) {
      return '/shoes';
    }
    if (normalizedSubcategory.includes('accessories') || normalizedSubcategory.includes('stethoscope') || 
        normalizedSubcategory.includes('id badge') || normalizedSubcategory.includes('lanyard')) {
      return '/accessories';
    }
    
    // For other subcategories, we can extend this mapping later
    // For now, route to the main category page
    if (normalizedCategory === 'men') {
      return '/mens-products';
    }
    if (normalizedCategory === 'women') {
      return '/womens-products';
    }
    if (normalizedCategory === 'dev egypt exclusive') {
      // For now, route to the main products page
      return '/scrubs';
    }
    
    return '/';
  };

  const handleCategoryClick = (categoryName: string) => {
    const normalizedCategory = categoryName.toLowerCase();
    if (normalizedCategory === 'men') {
      setLocation('/mens-products');
    } else if (normalizedCategory === 'women') {
      setLocation('/womens-products');
    }
  };

  const handleSubcategoryClick = (subcategory: string, categoryName: string) => {
    const route = getRouteForSubcategory(subcategory, categoryName);
    setLocation(route);
    setHoveredCategory(null); // Close the dropdown after navigation
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div className="hidden lg:block bg-background border-b" data-testid="category-navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8 py-4" onMouseLeave={() => setHoveredCategory(null)}>
          {categories.map((category) => (
            <div key={category.id} className="relative">
              <button
                onMouseEnter={() => setHoveredCategory(category.id)}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  hoveredCategory === category.id 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                <span>{category.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Dropdown Menu - Full width on hover */}
              {hoveredCategory === category.id && (
                <div 
                  className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50"
                  data-testid={`dropdown-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="max-w-7xl mx-auto py-4 px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {(category.subcategories || []).map((subcategory: string) => (
                      <button
                        key={subcategory}
                        data-testid={`subcategory-${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSubcategoryClick(subcategory, category.name)}
                        className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}