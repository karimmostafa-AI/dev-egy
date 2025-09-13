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
        {/* Left Banner - Limited Time Sale */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2" data-testid="banner-title-spotlight">
              Limited Time Sale
            </h3>
            <p className="text-sm mb-4" data-testid="banner-subtitle-spotlight">
              Up to 50% off select scrubs & accessories
            </p>
            <CountdownTimer />
          </div>
          <img 
            src={femaleWorkerImage} 
            alt="Female healthcare worker in green scrubs"
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
          />
        </div>

        {/* Center Banner - New Arrivals */}
        <div className="bg-muted rounded-lg p-6 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-foreground mb-2" data-testid="banner-title-echoes">
              New Fall Collection
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Latest styles in seasonal colors
            </p>
            <Button 
              variant="default" 
              data-testid="button-shop-echoes"
              onClick={() => console.log('Shop New Arrivals clicked')}
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

        {/* Right Banner - Clearance */}
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-secondary-foreground mb-2" data-testid="banner-title-deals">
              Clearance Sale
            </h3>
            <p className="text-secondary-foreground/80 text-sm mb-4">
              $7.99 or less printed scrubs
            </p>
            <p className="text-secondary-foreground text-sm font-medium">
              Final markdowns - while supplies last
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