import { useState, useEffect } from 'react';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import HeroSection from '@/components/HeroSection';
import NewsletterModal from '@/components/NewsletterModal';
import ProductShowcase from '@/components/ProductShowcase';
import Footer from '@/components/Footer';

export default function Home() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Show newsletter modal after a delay (simulating user behavior)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletterModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
        <ProductShowcase />
      </main>

      {/* Footer */}
      <Footer />

      {/* Newsletter Modal */}
      <NewsletterModal 
        isOpen={showNewsletterModal} 
        onClose={() => setShowNewsletterModal(false)} 
      />
    </div>
  );
}