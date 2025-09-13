import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import femaleWorkerImage from '@assets/generated_images/Female_healthcare_worker_in_scrubs_c9f74238.png';
import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';

const showcaseProducts = [
  {
    id: 1,
    title: "HYPOTHESIS™",
    subtitle: "Performance Collection",
    description: "New Jumpsuit Style",
    details: "Nothing to match, just add shoes.",
    buttonText: "Shop Hypothesis",
    image: femaleWorkerImage,
    background: "bg-gradient-to-r from-green-600 to-green-700",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Cherokee Scrubs",
    subtitle: "Achieve Collection",
    description: "Professional Performance",
    details: "Comfort meets durability in our best-selling line.",
    buttonText: "Shop Cherokee",
    image: maleWorkerImage,
    background: "bg-gradient-to-r from-gray-100 to-gray-200",
    textColor: "text-gray-800"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {showcaseProducts.map((product) => (
          <Card 
            key={product.id}
            className={`${product.background} ${product.textColor} overflow-hidden relative h-96 hover-elevate cursor-pointer`}
            data-testid={`product-card-${product.id}`}
            onClick={() => console.log(`Product ${product.id} clicked`)}
          >
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-2xl font-bold mb-2" data-testid={`product-title-${product.id}`}>
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-lg mb-4" data-testid={`product-subtitle-${product.id}`}>
                    {product.subtitle}
                  </p>
                )}
                <h4 className="text-xl font-semibold mb-2" data-testid={`product-description-${product.id}`}>
                  {product.description}
                </h4>
                <p className="text-sm mb-6" data-testid={`product-details-${product.id}`}>
                  {product.details}
                </p>
              </div>
              
              <Button 
                variant={product.id === 1 ? "outline" : "default"}
                className={`self-start ${product.id === 1 ? 'border-white text-white hover:bg-white hover:text-green-700' : ''}`}
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
            <img 
              src={product.image} 
              alt={product.title}
              className="absolute right-0 top-0 h-full w-auto object-cover opacity-30"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}