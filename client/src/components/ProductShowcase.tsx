import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import OptimizedImage from '@/components/OptimizedImage';
import femaleWorkerImage from '@assets/generated_images/Female_healthcare_worker_in_scrubs_c9f74238.png';
import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';

const showcaseProducts = [
  {
    id: 1,
    title: "BUTTER-SOFT™",
    subtitle: "UA Exclusive Collection",
    description: "Premium Stretch Scrubs",
    details: "Ultra-soft fabric with superior stretch & comfort.",
    buttonText: "Shop Butter-Soft",
    image: femaleWorkerImage,
    background: "bg-gradient-to-r from-primary to-primary/90",
    textColor: "text-primary-foreground",
    badge: "BESTSELLER"
  },
  {
    id: 2,
    title: "Cherokee® Scrubs",
    subtitle: "Revolution Collection",
    description: "Professional Performance",
    details: "Comfort meets durability in our most popular line.",
    buttonText: "Shop Cherokee",
    image: maleWorkerImage,
    background: "bg-muted",
    textColor: "text-foreground",
    badge: "20% OFF"
  },
  {
    id: 3,
    title: "WonderWink®",
    subtitle: "Renew Collection",
    description: "Sustainable Scrubs",
    details: "Eco-friendly fabric made from recycled bottles.",
    buttonText: "Shop WonderWink",
    image: femaleWorkerImage,
    background: "bg-secondary",
    textColor: "text-secondary-foreground",
    badge: "ECO-FRIENDLY"
  },
  {
    id: 4,
    title: "Healing Hands®",
    subtitle: "Purple Label Collection",
    description: "Luxury Medical Wear",
    details: "Premium comfort with modern styling details.",
    buttonText: "Shop Healing Hands",
    image: maleWorkerImage,
    background: "bg-accent",
    textColor: "text-accent-foreground",
    badge: "NEW ARRIVAL"
  },
  {
    id: 5,
    title: "Greys Anatomy®",
    subtitle: "Signature Series",
    description: "Modern Classic Fit",
    details: "Timeless style with contemporary performance.",
    buttonText: "Shop Greys Anatomy",
    image: femaleWorkerImage,
    background: "bg-gradient-to-r from-secondary/80 to-secondary/60",
    textColor: "text-secondary-foreground",
    badge: "SALE"
  },
  {
    id: 6,
    title: "Barco One®",
    subtitle: "Performance Knit",
    description: "Athletic Inspired",
    details: "Four-way stretch fabric with moisture-wicking.",
    buttonText: "Shop Barco One",
    image: maleWorkerImage,
    background: "bg-primary/90",
    textColor: "text-primary-foreground",
    badge: "FEATURED"
  }
];

export default function ProductShowcase() {
  return (
    <div className="py-8" data-testid="product-showcase">
      {/* Sale Banner */}
      <div className="bg-primary text-primary-foreground text-center py-3 mb-8">
        <p className="text-sm font-medium" data-testid="sale-banner">
          Limited Time: Up to 50% off Select Items - Shop Sale Now!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
        {showcaseProducts.map((product) => (
          <Card 
            key={product.id}
            className={`${product.background} ${product.textColor} overflow-hidden relative h-96 hover-elevate cursor-pointer border-0 shadow-lg`}
            data-testid={`product-card-${product.id}`}
            onClick={() => console.log(`Product ${product.id} clicked`)}
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold rounded z-20">
                {product.badge}
              </div>
            )}

            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-2xl font-bold mb-2 leading-tight" data-testid={`product-title-${product.id}`}>
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-base mb-3 opacity-90" data-testid={`product-subtitle-${product.id}`}>
                    {product.subtitle}
                  </p>
                )}
                <h4 className="text-lg font-semibold mb-2" data-testid={`product-description-${product.id}`}>
                  {product.description}
                </h4>
                <p className="text-sm mb-6 opacity-80" data-testid={`product-details-${product.id}`}>
                  {product.details}
                </p>
              </div>
              
              <Button 
                variant="outline"
                size="lg"
                className={`self-start border-2 bg-transparent hover:bg-current/10 font-semibold transition-all hover-elevate`}
                data-testid={`button-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`${product.buttonText} clicked`);
                }}
              >
                {product.buttonText}
              </Button>
            </div>
            
            {/* Background Image */}
            <OptimizedImage 
              src={product.image} 
              alt={product.title}
              className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </Card>
        ))}
      </div>
    </div>
  );
}