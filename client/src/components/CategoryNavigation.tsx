import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    name: 'WOMEN',
    subcategories: [
      'Shop All Women\'s Scrubs',
      'Tops',
      'Solid Tops',
      'Fashion Scrub Tops',
      'Print Tops',
      'Bottoms',
      'Solid Bottoms',
      'Print Bottoms',
      'Petite Scrubs',
      'Plus Size Scrubs',
      'Jackets',
      'Solid Jackets',
      'Knit Jackets',
      'Print Jackets',
      'Fleece Jackets',
      'Lab Coats'
    ]
  },
  {
    name: 'MEN',
    subcategories: [
      'Shop All Men',
      'Tops',
      'Solid Tops',
      'Print Tops',
      'Bottoms',
      'Solid Bottoms',
      'Print Bottoms',
      'Big & Tall Scrubs',
      'Jackets & Outerwear',
      'Lab Coats'
    ]
  },
  {
    name: 'UA EXCLUSIVE',
    subcategories: [
      'Shop All UA Scrubs',
      'UA Performance Collection',
      'UA Butter-Soft Original',
      'UA Stretch',
      'UA Classic',
      'UA Jackets',
      'Solid Jackets',
      'Print Jackets',
      'Lab Coats',
      'Just Reduced Sale'
    ]
  },
  {
    name: 'BRANDS',
    subcategories: [
      'Barco Scrubs',
      'Barco One Performance Knit',
      'Cherokee Scrubs',
      'Cherokee Achieve',
      'Cherokee Atmos',
      'Dickies Scrubs',
      'WonderWink Scrubs',
      'Greys Anatomy',
      'Healing Hands',
      'Hypothesis',
      'Koi Scrubs',
      'Landau Scrubs',
      'Skechers By Barco'
    ]
  },
  {
    name: 'COLOR',
    subcategories: [
      'Shop All Solid Colors',
      'Navy Blue',
      'Royal Blue', 
      'Ceil Blue',
      'Black',
      'White',
      'Gray',
      'Wine',
      'Hunter Green',
      'Purple',
      'Pink',
      'Red'
    ]
  },
  {
    name: 'PRINTS',
    subcategories: [
      'Shop All Prints',
      'New Print Arrivals',
      'Holiday Prints',
      'Floral Prints',
      'Animal Prints',
      'Geometric Prints',
      'Character Prints',
      'Nature Prints',
      'Sport Prints'
    ]
  },
  {
    name: 'FOOTWEAR',
    subcategories: [
      'View All Footwear',
      'Athletic Shoes',
      'Clogs',
      'Nursing Shoes',
      'Slip-Resistant Shoes',
      'Comfort Shoes',
      'Boots',
      'Crocs',
      'Sketchers',
      'Footwear Sale'
    ]
  },
  {
    name: 'ACCESSORIES',
    subcategories: [
      'View All Accessories',
      'Stethoscopes',
      'ID Badge Holders',
      'Lanyards',
      'Compression Socks',
      'Medical Bags',
      'Watches',
      'Scissors',
      'Penlight',
      'Accessories Sale'
    ]
  },
  {
    name: 'NEW & TRENDING',
    subcategories: [
      'New Arrivals',
      'Trending Now',
      'Customer Favorites',
      'Best Sellers',
      'Featured Collections',
      'Seasonal Trends'
    ]
  },
  {
    name: 'SALE',
    subcategories: [
      'Current Limited Time Sale',
      'Clearance Items',
      'Up to 50% Off',
      '$7.99 or Less Printed Scrubs',
      'Discount Print Scrubs', 
      '$14.99 or Less Printed Scrubs',
      'Final Sale'
    ],
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