import { useState } from 'react';
import { Button } from '@/components/ui/button';

const brands = [
  { id: 'seen', name: 'Seen', logo: true },
  { id: 'hleo', name: 'Hleo', logo: true },
  { id: 'omaima', name: 'Omaima', logo: true },
];

const utilityLinks = [
  'Ship to: 🇪🇬 Egypt | العربية',
  'English',
  'Groups',
  'Store Locator',
  'Tracking',
  'Help'
];

export default function TopNavigationBar() {
  const [activeBrand, setActiveBrand] = useState('');

  return (
    <div className="bg-primary text-primary-foreground text-sm h-10 flex items-center justify-between px-4 border-b" data-testid="top-navigation">
      <div className="flex items-center space-x-6">
        {brands.map((brand) => (
          <button
            key={brand.id}
            data-testid={`brand-tab-${brand.id}`}
            onClick={() => {
              setActiveBrand(brand.id);
              console.log(`Switched to brand: ${brand.name}`);
            }}
            className={`px-3 py-1 text-xs font-medium transition-colors hover-elevate ${
              activeBrand === brand.id 
                ? 'bg-primary-foreground text-primary' 
                : 'text-primary-foreground/90 hover:bg-primary-foreground/20 hover:text-primary-foreground'
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        {utilityLinks.map((link, index) => (
          <button
            key={index}
            data-testid={`utility-link-${index}`}
            onClick={() => console.log(`Clicked: ${link}`)}
            className="hover:text-primary-foreground transition-colors hover-elevate px-2 py-1 rounded"
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}