import { useState } from 'react';
import { Link } from 'wouter';
import { Search, User, ShoppingCart, BookOpen, Menu } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileMenu from '@/components/MobileMenu';

const categories = [
  { 
    id: 1, 
    name: "Scrubs", 
    subcategories: ["Men's Scrubs", "Women's Scrubs", "Children's Scrubs"] 
  },
  { 
    id: 2, 
    name: "Lab Coats", 
    subcategories: ["Men's Lab Coats", "Women's Lab Coats", "Children's Lab Coats"] 
  },
  { 
    id: 3, 
    name: "Shoes", 
    subcategories: ["Men's Shoes", "Women's Shoes", "Children's Shoes"] 
  },
  { 
    id: 4, 
    name: "Accessories", 
    subcategories: ["Scrubs Caps", "Face Masks", "Stethoscopes"] 
  },
];

export default function MainHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-background border-b h-20 flex items-center justify-between px-6" data-testid="main-header">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <MobileMenu categories={categories} />
      </div>

      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <div 
            className="bg-primary text-primary-foreground px-3 py-2 rounded font-bold text-xl cursor-pointer hover-elevate"
            data-testid="logo"
          >
            DE
          </div>
        </Link>
        <div className="ml-3 hidden sm:block">
          <div className="text-lg font-bold text-foreground" data-testid="brand-name">
            DEV Egypt
          </div>
          <div className="text-xs text-muted-foreground">
            Scrubs & Medical Uniforms that Don't Conform
          </div>
        </div>
      </div>

      {/* Account & Cart with Search */}
      <div className="flex items-center space-x-4">
        {/* Search Bar - moved to right, styled to match original */}
        <div className="relative flex-1 max-w-2xl mx-8 hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for scrubs, uniforms, brands..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log('Search:', e.target.value);
            }}
            className="h-12 w-full pl-10 pr-4 py-3 text-base bg-background border-2 border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
            data-testid="search-input"
          />
        </div>
        <Link 
          href="/blog"
          className={buttonVariants({ variant: "ghost", size: "icon" }) + " hidden lg:flex hover-elevate"}
          data-testid="blog-button"
        >
          <BookOpen className="h-5 w-5" />
        </Link>
        <Link 
          href="/account"
          className={buttonVariants({ variant: "ghost", size: "icon" }) + " hidden lg:flex hover-elevate"}
          data-testid="account-button"
        >
          <User className="h-5 w-5" />
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          data-testid="cart-button"
          onClick={() => console.log('Cart clicked')}
          className="relative hover-elevate"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
            0
          </span>
        </Button>
      </div>
    </div>
  );
}