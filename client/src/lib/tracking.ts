// Tracking service for analytics and user behavior tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class TrackingService {
  private trackingId: string;
  private isInitialized: boolean;

  constructor(trackingId: string) {
    this.trackingId = trackingId;
    this.isInitialized = false;
  }

  // Initialize Google Analytics
  initialize() {
    if (this.isInitialized || !this.trackingId) {
      return;
    }

    // Create dataLayer array if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Create gtag function
    window.gtag = function () {
      window.dataLayer!.push(arguments);
    };

    // Initialize gtag
    window.gtag('js', new Date());
    window.gtag('config', this.trackingId);

    this.isInitialized = true;
  }

  // Track page views
  trackPageView(url: string, title?: string) {
    if (!this.isInitialized || !window.gtag || !this.trackingId) {
      // Only log in development mode to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        console.debug('Tracking not initialized or tracking ID missing');
      }
      return;
    }

    window.gtag('config', this.trackingId, {
      page_title: title,
      page_location: url,
    });
  }

  // Track events
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isInitialized || !window.gtag || !this.trackingId) {
      // Only log in development mode to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        console.debug('Tracking not initialized or tracking ID missing');
      }
      return;
    }

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Track user sign up
  trackSignUp(method: string) {
    this.trackEvent('sign_up', 'engagement', method);
  }

  // Track user login
  trackLogin(method: string) {
    this.trackEvent('login', 'engagement', method);
  }

  // Track product views
  trackProductView(productId: string, productName: string, category?: string) {
    this.trackEvent('view_item', 'engagement', productId, 1);
  }

  // Track add to cart
  trackAddToCart(productId: string, productName: string, quantity: number, price: number) {
    this.trackEvent('add_to_cart', 'ecommerce', productId, quantity);
  }

  // Track purchase
  trackPurchase(transactionId: string, value: number, currency: string, items: any[]) {
    if (!this.isInitialized || !window.gtag || !this.trackingId) {
      // Only log in development mode to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        console.debug('Tracking not initialized or tracking ID missing');
      }
      return;
    }

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }

  // Track search
  trackSearch(searchTerm: string) {
    this.trackEvent('search', 'engagement', searchTerm);
  }

  // Track checkout step
  trackCheckoutStep(step: number, option?: string) {
    this.trackEvent('checkout_progress', 'ecommerce', `step_${step}`, step);
  }
}

// Create a singleton instance
const trackingService = new TrackingService(import.meta.env.VITE_GA_TRACKING_ID || '');

export default trackingService;