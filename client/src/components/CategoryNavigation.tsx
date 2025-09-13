import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    name: 'WOMEN',
    subcategories: ['Scrub Tops', 'Scrub Bottoms', 'Lab Coats', 'Jackets', 'Dresses']
  },
  {
    name: 'MEN',
    subcategories: ['Scrub Tops', 'Scrub Bottoms', 'Lab Coats', 'Jackets']
  },
  {
    name: 'UA EXCLUSIVE',
    subcategories: ['New Arrivals', 'Best Sellers', 'Limited Edition']
  },
  {
    name: 'BRANDS',
    subcategories: ['Cherokee', 'Dickies', 'WonderWink', 'Barco One']
  },
  {
    name: 'COLOR',
    subcategories: ['Navy', 'Royal Blue', 'Black', 'White', 'Gray', 'Green']
  },
  {
    name: 'PRINTS',
    subcategories: ['Floral', 'Animal', 'Geometric', 'Holiday']
  },
  {
    name: 'FOOTWEAR',
    subcategories: ['Athletic', 'Clogs', 'Nursing Shoes', 'Boots']
  },
  {
    name: 'ACCESSORIES',
    subcategories: ['Stethoscopes', 'Badges', 'Lanyards', 'Bags']
  },
  {
    name: 'NEW & TRENDING',
    subcategories: ['New Arrivals', 'Trending Now', 'Customer Favorites']
  },
  {
    name: 'SALE',
    subcategories: ['Clearance', 'Up to 50% Off', 'Final Sale'],
    highlight: true
  }
];

export default function CategoryNavigation() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-background border-b h-12 relative" data-testid="category-navigation">
      <div className="flex items-center justify-center h-full">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => console.log(`Category clicked: ${category.name}`)}
              className={`px-4 py-3 text-sm font-medium transition-colors hover-elevate flex items-center space-x-1 ${
                category.highlight 
                  ? 'text-destructive hover:text-destructive-foreground' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <span>{category.name}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Dropdown Menu */}
            {hoveredCategory === category.name && (
              <div 
                className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-md py-2 min-w-48 z-50"
                data-testid={`dropdown-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    data-testid={`subcategory-${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => console.log(`Subcategory clicked: ${subcategory}`)}
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}