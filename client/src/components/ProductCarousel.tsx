import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  category: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Hypothesis Scrubs",
    subtitle: "Echoes of Autumn Collection",
    image: "/api/placeholder/400/300",
    link: "#hypothesis",
    category: "Featured"
  },
  {
    id: 2,
    title: "ReSurge Scrubs",
    subtitle: "Performance Collection",
    image: "/api/placeholder/400/300", 
    link: "#resurge",
    category: "Featured"
  },
  {
    id: 3,
    title: "Easy Stretch",
    subtitle: "Comfort Scrubs",
    image: "/api/placeholder/400/300",
    link: "#easy-stretch", 
    category: "Featured"
  },
  {
    id: 4,
    title: "Fall Prints",
    subtitle: "Seasonal Collection",
    image: "/api/placeholder/400/300",
    link: "#prints",
    category: "Seasonal"
  },
  {
    id: 5,
    title: "Men's Hypothesis",
    subtitle: "Professional Line",
    image: "/api/placeholder/400/300",
    link: "#mens-hypothesis",
    category: "Men's"
  }
];

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="py-8 px-4" data-testid="product-carousel">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Shop Our Collections</h2>
        <p className="text-muted-foreground">Discover the latest styles from our top brands</p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Main Display */}
        <div className="relative h-96 mb-6 overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 relative cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => console.log(`Navigate to ${item.link}`)}
                data-testid={`carousel-item-${item.id}`}
              >
                <Card className="h-full bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
                  <div className="h-full flex items-center justify-between p-8">
                    <div className="flex-1">
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                      <h3 className="text-4xl font-bold mt-4 mb-2">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-xl text-white/90 mb-6">{item.subtitle}</p>
                      )}
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-blue-600"
                          data-testid={`shop-all-${item.id}`}
                        >
                          Shop All
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-white hover:bg-white/20"
                            data-testid={`shop-women-${item.id}`}
                          >
                            Shop Women
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-white hover:bg-white/20"
                            data-testid={`shop-men-${item.id}`}
                          >
                            Shop Men
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-white/60">Product Image</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  {hoveredItem === item.id && (
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-200" />
                  )}
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            data-testid="carousel-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            data-testid="carousel-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>

        {/* Secondary Carousel (smaller items) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {carouselItems.map((item) => (
            <Card 
              key={`thumb-${item.id}`}
              className="h-32 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => console.log(`Navigate to ${item.link}`)}
              data-testid={`thumbnail-${item.id}`}
            >
              <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center p-4">
                <h4 className="text-sm font-semibold text-center">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground text-center mt-1">{item.subtitle}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}