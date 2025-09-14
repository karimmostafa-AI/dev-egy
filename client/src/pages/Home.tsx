import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import HeroSection from '@/components/HeroSection';
import ProductCarousel from '@/components/ProductCarousel';
import UniformMarketplace from '@/components/UniformMarketplace';
import SocialFeed from '@/components/SocialFeed';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Three-tier Navigation Structure */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Main Content */}
      <main data-testid="main-content">
        <HeroSection />
        <ProductCarousel />
        <UniformMarketplace />
        <SocialFeed />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}