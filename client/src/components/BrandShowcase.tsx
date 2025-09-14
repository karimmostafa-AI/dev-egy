import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  isEgyptian?: boolean;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Seen",
    description: "Premium Egyptian medical uniforms with modern design",
    image: "/api/placeholder/300/200",
    category: "Premium",
    isEgyptian: true
  },
  {
    id: 2,
    name: "Hleo",
    description: "Professional scrubs for healthcare heroes",
    image: "/api/placeholder/300/200",
    category: "Professional",
    isEgyptian: true
  },
  {
    id: 3,
    name: "Omaima",
    description: "Comfort-first medical apparel",
    image: "/api/placeholder/300/200",
    category: "Comfort",
    isEgyptian: true
  },
  {
    id: 4,
    name: "Cairo Medical",
    description: "Traditional craftsmanship meets modern healthcare",
    image: "/api/placeholder/300/200",
    category: "Traditional",
    isEgyptian: true
  },
  {
    id: 5,
    name: "Alexandria",
    description: "Coastal-inspired medical wear",
    image: "/api/placeholder/300/200",
    category: "Lifestyle",
    isEgyptian: true
  },
  {
    id: 6,
    name: "Nile Healthcare",
    description: "Flowing comfort for healthcare professionals",
    image: "/api/placeholder/300/200",
    category: "Comfort",
    isEgyptian: true
  },
  {
    id: 7,
    name: "Pharaoh Medical",
    description: "Royal quality medical uniforms",
    image: "/api/placeholder/300/200",
    category: "Luxury",
    isEgyptian: true
  },
  {
    id: 8,
    name: "Desert Rose",
    description: "Elegant medical apparel inspired by Egypt",
    image: "/api/placeholder/300/200",
    category: "Elegant",
    isEgyptian: true
  }
];

export default function BrandShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % brands.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleBrands = () => {
    const visibleCount = 4;
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % brands.length;
      result.push(brands[index]);
    }
    return result;
  };

  return (
    <div className="py-12 px-4 bg-muted/30" data-testid="brand-showcase">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Brands You Love</h2>
          <p className="text-muted-foreground text-lg">
            DEV Egypt is the Medical Marketplace. Find all the brands in one place.
          </p>
        </div>

        {/* Brand Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            data-testid="brands-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            data-testid="brands-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Brand Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
            {getVisibleBrands().map((brand) => (
              <Card
                key={brand.id}
                className="overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                onMouseEnter={() => setHoveredBrand(brand.id)}
                onMouseLeave={() => setHoveredBrand(null)}
                onClick={() => console.log(`Navigate to ${brand.name}`)}
                data-testid={`brand-card-${brand.id}`}
              >
                {/* Brand Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">{brand.name}</span>
                  </div>
                  
                  {/* Egyptian Flag Indicator */}
                  {brand.isEgyptian && (
                    <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
                      🇪🇬 Made in Egypt
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  {hoveredBrand === brand.id && (
                    <div className="absolute inset-0 bg-primary/20 transition-opacity duration-200" />
                  )}
                </div>

                {/* Brand Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                      {brand.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {brand.description}
                  </p>
                </div>

                {/* Call to action */}
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    data-testid={`shop-brand-${brand.id}`}
                  >
                    Shop {brand.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {brands.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              data-testid={`brand-dot-${index}`}
            />
          ))}
        </div>

        {/* Featured Egyptian Brands Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <span>🇪🇬</span>
              <span>Made in Egypt</span>
              <span>🇪🇬</span>
            </h3>
            <p className="text-muted-foreground">
              Supporting local Egyptian manufacturers and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands.slice(0, 3).map((brand) => (
              <Card key={`featured-${brand.id}`} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">{brand.name[0]}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{brand.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{brand.description}</p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  data-testid={`featured-brand-${brand.id}`}
                >
                  Explore Collection
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}