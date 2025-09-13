import { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MainHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-background border-b h-16 flex items-center justify-between px-4" data-testid="main-header">
      {/* Logo */}
      <div className="flex items-center">
        <div 
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-bold text-lg cursor-pointer hover-elevate"
          data-testid="logo"
          onClick={() => console.log('Logo clicked')}
        >
          UA
        </div>
        <span className="ml-2 text-lg font-semibold text-foreground" data-testid="brand-name">
          Uniform Advantage
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search keywords(etc)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log('Search:', e.target.value);
            }}
            className="pl-10 bg-muted/50 border-border focus:ring-primary"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Account & Cart */}
      <div className="flex items-center space-x-4">
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