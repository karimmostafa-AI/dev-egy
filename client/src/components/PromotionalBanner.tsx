import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const promotionalBanners = [
  {
    id: 'spotlight-sale',
    text: '20% off Spotlight Sale',
    subtext: 'Healing Hands, Butter-Soft & more',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    bgColor: 'bg-secondary',
    textColor: 'text-secondary-foreground',
  },
  {
    id: 'autumn-color-drop',
    text: '20% off Echoes of Autumn Color Drop', 
    subtext: 'Limited time colors',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    bgColor: 'bg-primary',
    textColor: 'text-primary-foreground',
  },
  {
    id: 'great-deals',
    text: 'Up to 50% off Great Deals',
    subtext: 'While Supplies Last',
    endDate: null, // No end date
    bgColor: 'bg-muted',
    textColor: 'text-foreground',
  },
  {
    id: 'fall-prints',
    text: '20% off NEW Fall Prints',
    subtext: 'Including the Halloween Shop',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    bgColor: 'bg-secondary',
    textColor: 'text-secondary-foreground',
  },
];

export default function PromotionalBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {days: number, hours: number, minutes: number, seconds: number}}>({});

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate countdown timers
  useEffect(() => {
    const updateTimers = () => {
      const newTimeLeft: {[key: string]: {days: number, hours: number, minutes: number, seconds: number}} = {};
      
      promotionalBanners.forEach((banner) => {
        if (banner.endDate) {
          const now = new Date().getTime();
          const distance = banner.endDate.getTime() - now;
          
          if (distance > 0) {
            newTimeLeft[banner.id] = {
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000),
            };
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const banner = promotionalBanners[currentBanner];
  const timer = timeLeft[banner.id];

  return (
    <div className={`relative ${banner.bgColor} ${banner.textColor} text-sm py-2 px-4 flex items-center justify-center`} data-testid="promotional-banner">
      <div className="flex items-center space-x-4 max-w-6xl mx-auto">
        <div className="text-center">
          <span className="font-bold">{banner.text}</span>
          {banner.subtext && (
            <span className="ml-2 opacity-90">{banner.subtext}</span>
          )}
          {timer && (
            <div className="ml-4 inline-flex items-center space-x-1 font-mono text-xs">
              <span>ENDS IN:</span>
              {timer.days > 0 && (
                <>
                  <span className="bg-black/20 px-1 rounded">{timer.days}D</span>
                </>
              )}
              <span className="bg-black/20 px-1 rounded">{timer.hours.toString().padStart(2, '0')}H</span>
              <span className="bg-black/20 px-1 rounded">{timer.minutes.toString().padStart(2, '0')}M</span>
              <span className="bg-black/20 px-1 rounded">{timer.seconds.toString().padStart(2, '0')}S</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-black/20 rounded p-1 transition-colors"
        data-testid="close-banner"
      >
        <X className="h-3 w-3" />
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1 pb-1">
        {promotionalBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentBanner ? 'bg-current' : 'bg-current/30'
            }`}
            data-testid={`banner-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}