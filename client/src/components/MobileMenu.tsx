import { useState } from "react";
import { Link } from "wouter";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  ShoppingCart, 
  BookOpen,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";

interface MobileMenuProps {
  categories: Array<{
    id: number;
    name: string;
    subcategories: string[];
  }>;
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  // Ensure all hooks are called consistently at the top level
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, isLoading, error } = useCart();
  
  // Safely calculate cart item count with defensive programming
  const cartItemCount = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  const toggleCategory = (categoryId: number) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would navigate to the search results page
    console.log("Searching for:", searchQuery);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          data-testid="mobile-menu-button"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[400px] p-0 flex flex-col"
        data-testid="mobile-menu-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Link href="/">
              <div 
                className="bg-primary text-primary-foreground px-2 py-1 rounded font-bold text-lg cursor-pointer"
                data-testid="mobile-logo"
              >
                DE
              </div>
            </Link>
            <div className="ml-2">
              <div className="text-base font-bold text-foreground">DEV Egypt</div>
              <div className="text-xs text-muted-foreground">Medical Uniforms</div>
            </div>
          </div>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <X className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for scrubs, uniforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              data-testid="mobile-search-input"
            />
          </form>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
            {/* Top Level Links */}
            <div className="border-b">
              <Link href="/account" className="flex items-center justify-between p-4 hover:bg-muted">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3" />
                  <span>Account</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/cart" className="flex items-center justify-between p-4 hover:bg-muted relative">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  <span>Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/blog" className="flex items-center justify-between p-4 hover:bg-muted">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-3" />
                  <span>Blog</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Categories */}
            <div className="py-2">
              <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">Categories</h3>
              {Array.isArray(categories) && categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-muted"
                  >
                    <span>{category.name}</span>
                    <ChevronDown 
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        openCategory === category.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openCategory === category.id && (
                    <div className="pl-8 pr-4 pb-2">
                      {Array.isArray(category.subcategories) && category.subcategories.map((subcategory, index) => (
                        <Link
                          key={index}
                          href={`/${category.name.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="sm">Login</Button>
            <Button variant="ghost" size="sm">Register</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}