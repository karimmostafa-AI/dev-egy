import PromotionalBanner from '@/components/PromotionalBanner';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import HeroSection from '@/components/HeroSection';
import ProductCarousel from '@/components/ProductCarousel';
import UniformMarketplace from '@/components/UniformMarketplace';
import BrandShowcase from '@/components/BrandShowcase';
import SocialFeed from '@/components/SocialFeed';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Four-tier Navigation Structure - DEV Egypt Style */}
      <div className="sticky top-0 z-40 bg-background">
        <PromotionalBanner />
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Main Content */}
      <main data-testid="main-content">
        <HeroSection />
        <ProductCarousel />
        <UniformMarketplace />
        <BrandShowcase />
        <SocialFeed />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}