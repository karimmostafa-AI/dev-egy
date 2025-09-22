// Hook for analytics and tracking
import { useEffect } from "react";
import { useLocation } from "wouter";
import trackingService from "@/lib/tracking";

export const useTracking = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize tracking service
    trackingService.initialize();
    
    // Track page view
    trackingService.trackPageView(window.location.href, document.title);
  }, []);

  useEffect(() => {
    // Track page view when location changes
    trackingService.trackPageView(window.location.href, document.title);
  }, [location]);

  return trackingService;
};

// Custom hook for specific tracking events
export const useTrackEvent = () => {
  const trackingService = useTracking();

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    trackingService.trackEvent(action, category, label, value);
  };

  const trackSignUp = (method: string) => {
    trackingService.trackSignUp(method);
  };

  const trackLogin = (method: string) => {
    trackingService.trackLogin(method);
  };

  const trackProductView = (
    productId: string,
    productName: string,
    category?: string
  ) => {
    trackingService.trackProductView(productId, productName, category);
  };

  const trackAddToCart = (
    productId: string,
    productName: string,
    quantity: number,
    price: number
  ) => {
    trackingService.trackAddToCart(productId, productName, quantity, price);
  };

  const trackPurchase = (
    transactionId: string,
    value: number,
    currency: string,
    items: any[]
  ) => {
    trackingService.trackPurchase(transactionId, value, currency, items);
  };

  const trackSearch = (searchTerm: string) => {
    trackingService.trackSearch(searchTerm);
  };

  const trackCheckoutStep = (step: number, option?: string) => {
    trackingService.trackCheckoutStep(step, option);
  };

  return {
    trackEvent,
    trackSignUp,
    trackLogin,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackCheckoutStep,
  };
};