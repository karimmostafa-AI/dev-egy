import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const marketplaceCategories = {
  women: [
    { name: 'Tops', description: 'Scrub tops for every style', link: '#womens-tops' },
    { name: 'Pants', description: 'Comfortable scrub pants', link: '#womens-pants' },
    { name: 'Jackets', description: 'Professional outerwear', link: '#womens-jackets' },
    { name: 'Prints', description: 'Fun & colorful designs', link: '#womens-prints' },
    { name: 'Underscrubs', description: 'Base layer comfort', link: '#womens-underscrubs' },
    { name: 'Footwear', description: 'Professional shoes', link: '#womens-footwear' }
  ],
  men: [
    { name: 'Tops', description: 'Professional scrub tops', link: '#mens-tops' },
    { name: 'Pants', description: 'Durable scrub pants', link: '#mens-pants' },
    { name: 'Jackets', description: 'Men\'s outerwear', link: '#mens-jackets' },
    { name: 'Littmann® Stethoscopes', description: 'Professional tools', link: '#stethoscopes' },
    { name: 'Underscrubs', description: 'Comfort tees', link: '#mens-underscrubs' },
    { name: 'Footwear', description: 'Men\'s work shoes', link: '#mens-footwear' }
  ]
};

export default function UniformMarketplace() {
  const [activeTab, setActiveTab] = useState('women');

  return (
    <div className="py-12 px-4 bg-muted/30" data-testid="uniform-marketplace">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-primary">The Uniform</span><br />
            <span className="text-foreground">Marketplace</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Great brands, styles and values. Curated for you.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8" data-testid="marketplace-tabs">
            <TabsTrigger 
              value="women" 
              className="text-lg font-semibold"
              data-testid="women-tab"
            >
              Women
            </TabsTrigger>
            <TabsTrigger 
              value="men" 
              className="text-lg font-semibold"
              data-testid="men-tab"
            >
              Men
            </TabsTrigger>
          </TabsList>

          <TabsContent value="women" data-testid="women-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {marketplaceCategories.women.map((category, index) => (
                <Card 
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => console.log(`Navigate to ${category.link}`)}
                  data-testid={`women-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="text-center">
                    {/* Icon placeholder */}
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <div className="w-8 h-8 bg-primary/60 rounded" />
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="men" data-testid="men-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {marketplaceCategories.men.map((category, index) => (
                <Card 
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => console.log(`Navigate to ${category.link}`)}
                  data-testid={`men-category-${category.name.toLowerCase().replace(/\s+/g, '-').replace(/®/g, '')}`}
                >
                  <div className="text-center">
                    {/* Icon placeholder */}
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                      <div className="w-8 h-8 bg-secondary/60 rounded" />
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-secondary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => console.log('Shop all marketplace clicked')}
            data-testid="shop-marketplace"
          >
            Shop The Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
}