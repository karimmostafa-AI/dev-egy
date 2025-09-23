import TopNavigationBar from "@/components/TopNavigationBar";
import MainHeader from "@/components/MainHeader";
import CategoryNavigation from "@/components/CategoryNavigation";
import HeroSection from "@/components/HeroSection";
import ProductCarousel from "@/components/ProductCarousel";
import UniformMarketplace from "@/components/UniformMarketplace";
import BrandShowcase from "@/components/BrandShowcase";
import SocialFeed from "@/components/SocialFeed";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="DEV Egypt - Professional Medical Uniforms"
        description="DEV Egypt provides high-quality medical uniforms including scrubs, lab coats, shoes, and accessories for healthcare professionals."
        keywords="medical uniforms, scrubs, lab coats, nursing uniforms, healthcare apparel, medical clothing"
      />
      
      {/* Four-tier Navigation Structure - DEV Egypt Style */}
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
        <BrandShowcase />
        <SocialFeed />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}