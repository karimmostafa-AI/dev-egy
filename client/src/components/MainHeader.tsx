import { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MainHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-background border-b h-20 flex items-center justify-between px-6" data-testid="main-header">
      {/* Logo */}
      <div className="flex items-center">
        <div 
          className="bg-primary text-primary-foreground px-3 py-2 rounded font-bold text-xl cursor-pointer hover-elevate"
          data-testid="logo"
          onClick={() => console.log('Logo clicked')}
        >
          UA
        </div>
        <div className="ml-3">
          <div className="text-lg font-bold text-foreground" data-testid="brand-name">
            Uniform Advantage
          </div>
          <div className="text-xs text-muted-foreground">
            Scrubs & Medical Uniforms that Don't Conform
          </div>
        </div>
      </div>

      {/* Account & Cart with Search */}
      <div className="flex items-center space-x-4">
        {/* Search Bar - moved to right, styled to match original */}
        <div className="relative flex-1 max-w-2xl mx-8">
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
        <Button 
          variant="ghost" 
          size="icon" 
          data-testid="account-button"
          onClick={() => console.log('Account clicked')}
          className="hover-elevate"
        >
          <User className="h-5 w-5" />
        </Button>
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