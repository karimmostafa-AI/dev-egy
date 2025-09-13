import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import femaleWorkerImage from '@assets/generated_images/Female_healthcare_worker_in_scrubs_c9f74238.png';
import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';
import medicalInstruments from '@assets/generated_images/Medical_instruments_on_white_background_46c995af.png';

export default function HeroSection() {
  return (
    <div className="relative" data-testid="hero-section">
      {/* Promotional Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Left Banner - Spotlight Sale */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2" data-testid="banner-title-spotlight">
              20% off Spotlight Sale
            </h3>
            <p className="text-sm mb-4" data-testid="banner-subtitle-spotlight">
              Featured styles from Cherokee, Barco One, and more
            </p>
            <CountdownTimer />
          </div>
          <img 
            src={femaleWorkerImage} 
            alt="Female healthcare worker in green scrubs"
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
          />
        </div>

        {/* Center Banner - Medical Equipment */}
        <div className="bg-muted rounded-lg p-6 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-foreground mb-2" data-testid="banner-title-echoes">
              20% off Echoes of Autumn Color Drop
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              New seasonal colors for fall
            </p>
            <Button 
              variant="default" 
              data-testid="button-shop-echoes"
              onClick={() => console.log('Shop Echoes clicked')}
              className="hover-elevate"
            >
              Shop Now
            </Button>
          </div>
          <img 
            src={medicalInstruments} 
            alt="Medical instruments"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        </div>

        {/* Right Banner - Great Deals */}
        <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-accent-foreground mb-2" data-testid="banner-title-deals">
              Up to 50% off Great Deals
            </h3>
            <p className="text-accent-foreground/80 text-sm mb-4">
              20% off Fall Prints
            </p>
            <p className="text-accent-foreground text-sm font-medium">
              Shop Halloween Shop and 1512-3
            </p>
          </div>
          <img 
            src={maleWorkerImage} 
            alt="Male healthcare worker"
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
          />
        </div>
      </div>

      {/* Newsletter Modal would appear here */}
    </div>
  );
}