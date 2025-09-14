import { useState, useEffect } from 'react';
import HeroCarousel from './HeroCarousel';
import EmailSignupModal from './EmailSignupModal';

export default function HeroSection() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Show modal after 3 seconds to simulate the Uniform Advantage behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignupModal(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative" data-testid="hero-section">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Email Signup Modal */}
      <EmailSignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
      />
    </div>
  );
}