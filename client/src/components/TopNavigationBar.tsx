import { useState } from 'react';
import { Button } from '@/components/ui/button';

const brands = [
  { id: 'butter-soft', name: 'Butter-Soft', logo: true },
  { id: 'easy-stretch', name: 'Easy Stretch', logo: true },
  { id: 'hypothesis', name: 'HYPOTHESIS', logo: true },
  { id: 'resurge', name: 'ReSurge', logo: true },
  { id: 'whisperlite', name: 'Whisperlite', logo: true },
];

const utilityLinks = [
  'Ship to: 🇺🇸 United States | English',
  'Español',
  'Groups',
  'Store Locator',
  'Tracking',
  'Help'
];

export default function TopNavigationBar() {
  const [activeBrand, setActiveBrand] = useState('');

  return (
    <div className="bg-black text-white text-sm h-10 flex items-center justify-between px-4 border-b" data-testid="top-navigation">
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
                ? 'bg-white text-black' 
                : 'text-white/90 hover:bg-white/20 hover:text-white'
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
            className="hover:text-white transition-colors hover-elevate px-2 py-1 rounded"
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}