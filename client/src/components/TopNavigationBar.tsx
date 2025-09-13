import { useState } from 'react';
import { Button } from '@/components/ui/button';

const brands = [
  { id: 'ua', name: 'Uniform Advantage', active: true },
  { id: 'butter-soft', name: 'Butter-Soft' },
  { id: 'easy', name: 'EASY' },
  { id: 'hypothesis', name: 'HYPOTHESIS' },
  { id: 'resources', name: 'RESOURCES' },
  { id: 'wink', name: 'WINK SCRUBS' },
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
  const [activeBrand, setActiveBrand] = useState('ua');

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
            className={`px-3 py-1 rounded-md transition-colors hover-elevate ${
              activeBrand === brand.id 
                ? 'bg-white text-black font-medium' 
                : 'hover:bg-white/20'
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