import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import femaleWorkerImage from '@assets/generated_images/Female_healthcare_worker_in_scrubs_c9f74238.png';
import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';
import medicalInstruments from '@assets/generated_images/Medical_instruments_on_white_background_46c995af.png';

const carouselSlides = [
  {
    id: 'spotlight-sale',
    title: '20% OFF SPOTLIGHT SALE',
    subtitle: 'Healing Hands, Butter-Soft & more',
    description: 'ENDS IN:',
    ctaText: 'Shop Sale',
    ctaSecondary: 'View All Deals',
    bgGradient: 'from-secondary via-secondary/90 to-secondary/80',
    textColor: 'text-secondary-foreground',
    image: femaleWorkerImage,
    imageAlt: 'Female healthcare worker in scrubs',
    showCountdown: true,
    ctaAction: 'spotlight-sale',
  },
  {
    id: 'echoes-autumn', 
    title: 'ECHOES OF AUTUMN',
    subtitle: 'New Color Drop - Limited Time',
    description: '20% off seasonal colors & prints',
    ctaText: 'Shop Now',
    ctaSecondary: 'View Collection',
    bgGradient: 'from-primary via-primary/95 to-primary/90',
    textColor: 'text-primary-foreground', 
    image: medicalInstruments,
    imageAlt: 'Medical instruments and autumn colors',
    showCountdown: false,
    ctaAction: 'autumn-collection',
  },
  {
    id: 'great-deals',
    title: 'UP TO 50% OFF',
    subtitle: 'Great Deals Collection',
    description: 'While supplies last - Final markdowns',
    ctaText: 'Shop Deals',
    ctaSecondary: 'See All Sales',
    bgGradient: 'from-muted via-muted/95 to-accent',
    textColor: 'text-foreground',
    image: maleWorkerImage,
    imageAlt: 'Male healthcare worker',
    showCountdown: false,
    ctaAction: 'great-deals',
  },
  {
    id: 'fall-prints',
    title: 'NEW FALL PRINTS',
    subtitle: 'Including Halloween Shop',
    description: '20% off all new print designs',
    ctaText: 'Shop Prints',
    ctaSecondary: 'Halloween Shop',
    bgGradient: 'from-secondary/80 via-secondary/70 to-secondary/60',
    textColor: 'text-secondary-foreground',
    image: femaleWorkerImage,
    imageAlt: 'Fall and Halloween themed scrubs',
    showCountdown: true,
    ctaAction: 'fall-prints',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleCtaClick = (action: string) => {
    console.log(`CTA clicked: ${action}`);
  };

  const slide = carouselSlides[currentSlide];

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg mx-4 mb-6" data-testid="hero-carousel">
      {/* Carousel Content */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 ease-in-out`}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/10" /> {/* Overlay for better text readability */}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-2xl">
              <h1 
                className={`text-4xl md:text-5xl font-bold ${slide.textColor} mb-4 leading-tight`}
                data-testid="carousel-title"
              >
                {slide.title}
              </h1>
              <h2 
                className={`text-xl md:text-2xl ${slide.textColor} mb-4 font-medium`}
                data-testid="carousel-subtitle"
              >
                {slide.subtitle}
              </h2>
              <p 
                className={`text-lg ${slide.textColor}/90 mb-6`}
                data-testid="carousel-description"
              >
                {slide.description}
              </p>

              {/* Countdown Timer */}
              {slide.showCountdown && (
                <div className="mb-6">
                  <CountdownTimer initialHours={8} initialMinutes={45} initialSeconds={30} />
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className={`${slide.textColor === 'text-primary-foreground' ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'} px-8 py-3 text-lg font-semibold hover-elevate`}
                  onClick={() => handleCtaClick(slide.ctaAction)}
                  data-testid="carousel-primary-cta"
                >
                  {slide.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`border-2 ${slide.textColor} bg-transparent hover:bg-current/10 px-8 py-3 text-lg hover-elevate`}
                  onClick={() => handleCtaClick(`${slide.ctaAction}-secondary`)}
                  data-testid="carousel-secondary-cta"
                >
                  {slide.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover-elevate z-20"
        data-testid="carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover-elevate z-20"
        data-testid="carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover-elevate ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${((currentSlide + 1) / carouselSlides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}