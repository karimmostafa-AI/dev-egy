import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import NotFound from '@/pages/not-found';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTrackEvent } from '@/hooks/useTracking';
import { useAuth } from '@/hooks/useAuth';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const { trackProductView, trackAddToCart } = useTrackEvent();
  const { addItem, isAddingItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get product by slug using React Query
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    },
    enabled: !!slug,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !productData?.product) {
    return <NotFound />;
  }
  
  const product = productData.product;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Fetch product options and variants
  const { data: optionsData } = useQuery({
    queryKey: ['productOptions', product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      const response = await fetch(`/api/products/${product.id}/options`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!product?.id,
  });
  
  const { data: variantsData } = useQuery({
    queryKey: ['productVariants', product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      const response = await fetch(`/api/products/${product.id}/variants`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!product?.id,
  });
  
  const productOptions = optionsData?.options || [];
  const productVariants = variantsData?.variants || [];
  
  // Fetch product reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['productReviews', product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      const response = await fetch(`/api/products/${product.id}/reviews`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!product?.id,
  });
  
  // Mock images for now - in production, these would come from product images
  const mockImages = [
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg'
  ];
  
  // Find selected variant based on selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const selectedVariant = productVariants.find((variant: any) => {
    if (!variant.optionValues || variant.optionValues.length === 0) return false;
    
    return variant.optionValues.every((optionValue: any) => {
      const optionName = optionValue.option.name;
      const selectedValue = selectedOptions[optionName];
      return selectedValue === optionValue.optionValue.id;
    });
  });
  
  // Set default selections when options load
  useEffect(() => {
    if (productOptions.length > 0) {
      const defaultSelections: Record<string, string> = {};
      productOptions.forEach((option: any) => {
        if (option.values && option.values.length > 0) {
          defaultSelections[option.name] = option.values[0].id;
        }
      });
      setSelectedOptions(defaultSelections);
    }
  }, [productOptions]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track product view
    if (product) {
      trackProductView(product.id, product.name, 'Brand Name');
    }
  }, [product, trackProductView]);
  
  // Availability helper functions
  const isAvailable = () => {
    if (selectedVariant) {
      return selectedVariant.isAvailable && 
             (selectedVariant.inventoryQuantity > 0 || selectedVariant.allowOutOfStockPurchases);
    }
    return product.isAvailable && 
           (product.inventoryQuantity > 0 || product.allowOutOfStockPurchases);
  };
  
  const getAvailabilityText = () => {
    if (selectedVariant) {
      if (!selectedVariant.isAvailable) return 'Unavailable';
      if (selectedVariant.inventoryQuantity > 0) return `In Stock (${selectedVariant.inventoryQuantity} available)`;
      if (selectedVariant.allowOutOfStockPurchases) return 'Available (Backorder)';
      return 'Out of Stock';
    }
    
    if (!product.isAvailable) return 'Unavailable';
    if (product.inventoryQuantity > 0) return `In Stock (${product.inventoryQuantity} available)`;
    if (product.allowOutOfStockPurchases) return 'Available (Backorder)';
    return 'Out of Stock';
  };
  
  const getAvailabilityColor = () => {
    return isAvailable() ? 'text-green-600' : 'text-red-600';
  };
  
  // Price helper functions
  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return parseFloat(selectedVariant.price);
    }
    return parseFloat(product.price);
  };
  
  const getCurrentComparePrice = () => {
    if (selectedVariant && selectedVariant.comparePrice) {
      return parseFloat(selectedVariant.comparePrice);
    }
    if (product.comparePrice) {
      return parseFloat(product.comparePrice);
    }
    return null;
  };
  
  // Rating helper function
  const calculateAverageRating = () => {
    if (!reviewsData?.reviews || reviewsData.reviews.length === 0) {
      return 0;
    }
    const totalRating = reviewsData.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    return totalRating / reviewsData.reviews.length;
  };
  
  // Review form helpers
  const resetReviewForm = () => {
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
  };
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a review.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
      
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback! Your review will be visible after moderation.',
      });
      
      // Reset form and close
      resetReviewForm();
      setShowReviewForm(false);
      
      // Refetch reviews
      // Note: In a real app, you might want to use React Query's invalidateQueries
      window.location.reload();
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    // Check if all required options are selected
    const missingOptions = productOptions.filter((option: any) => 
      !selectedOptions[option.name] && option.values && option.values.length > 0
    );
    
    if (missingOptions.length > 0) {
      toast({
        title: 'Options Required',
        description: `Please select ${missingOptions.map((opt: any) => opt.displayName).join(', ')} before adding to cart.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Track add to cart event
    trackAddToCart(
      product.id, 
      product.name, 
      quantity, 
      parseFloat(product.price)
    );
    
    // Add to cart using the useCart hook with variant if selected
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Added to Cart',
            description: `${product.name} has been added to your cart.`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: 'Failed to add item to cart. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${product.name} - DEV Egypt`}
        description={product.description || product.shortDescription || `High-quality ${product.name} for healthcare professionals`}
        keywords={`${product.name}, medical uniform, scrubs, healthcare apparel`}
        type="product"
      />
      
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group">
              <img
                src={mockImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
              {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  SALE
                </div>
              )}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid="button-prev-image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid="button-next-image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {mockImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold" data-testid="product-name">{product.name}</h1>
              <p className="text-muted-foreground mt-1" data-testid="product-brand">Brand Name</p>
              
              {/* Rating - Mock data */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => {
                    const averageRating = calculateAverageRating();
                    const isFilled = i < Math.floor(averageRating);
                    const isHalfFilled = i === Math.floor(averageRating) && averageRating % 1 >= 0.5;
                    
                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          isFilled || isHalfFilled
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="product-rating">
                  {calculateAverageRating().toFixed(1)} ({reviewsData?.reviews?.length || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary" data-testid="product-price">
                    ${getCurrentPrice().toFixed(2)}
                  </span>
                  {getCurrentComparePrice() && (
                    <span className="text-xl text-muted-foreground line-through" data-testid="product-compare-price">
                      ${getCurrentComparePrice()!.toFixed(2)}
                    </span>
                  )}
                </div>
                {getCurrentComparePrice() && (
                  <div className="mt-1 text-sm text-green-600 font-medium" data-testid="product-savings">
                    You save ${(getCurrentComparePrice()! - getCurrentPrice()).toFixed(2)} ({Math.round(((getCurrentComparePrice()! - getCurrentPrice()) / getCurrentComparePrice()!) * 100)}%)
                  </div>
                )}
              </div>
            </div>

            {/* Product Options */}
            {productOptions.map((option: any) => (
              <div key={option.id}>
                <h3 className="font-medium mb-2">{option.displayName}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values?.map((value: any) => {
                    const isSelected = selectedOptions[option.name] === value.id;
                    
                    if (option.name.toLowerCase().includes('color')) {
                      // Render color swatches
                      return (
                        <button
                          key={value.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value.id }))}
                          className={`h-8 w-8 rounded-full border-2 ${
                            isSelected 
                              ? 'border-black ring-2 ring-offset-2 ring-primary' 
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: value.value.toLowerCase() }}
                          aria-label={value.displayValue}
                          data-testid={`${option.name}-${value.value}`}
                          title={value.displayValue}
                        />
                      );
                    } else {
                      // Render text-based options (sizes, etc.)
                      return (
                        <button
                          key={value.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value.id }))}
                          className={`px-4 py-2 rounded-md border ${
                            isSelected
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          data-testid={`${option.name}-${value.value}`}
                        >
                          {value.displayValue}
                        </button>
                      );
                    }
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center border rounded-md w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  data-testid="button-decrease-quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 border-x" data-testid="quantity-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  data-testid="button-increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingItem}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{isAddingItem ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg border ${
                    isFavorite ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                  data-testid="button-favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-600">Free Shipping</div>
                    <div className="text-sm text-muted-foreground">
                      On orders over $75. Standard delivery in 3-5 business days.
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-600">Easy Returns</div>
                    <div className="text-sm text-muted-foreground">
                      30-day return policy
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-600">Quality Guarantee</div>
                    <div className="text-sm text-muted-foreground">
                      Premium medical apparel
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <CheckCircle className={`h-5 w-5 ${getAvailabilityColor()}`} />
              <span className={`font-medium ${getAvailabilityColor()}`} data-testid="product-availability">
                {getAvailabilityText()}
              </span>
              {isAvailable() && <span className="text-gray-600">• Ships in 1-2 business days</span>}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-black py-4 px-1 text-sm font-medium text-black">
                Description
              </button>
              <button className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Specifications
              </button>
              <button className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Reviews ({reviewsData?.reviews?.length || 0})
              </button>
              <button className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Size Guide
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab Content */}
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6" data-testid="product-description">
                {product.description || product.shortDescription || `The ${product.name} combines comfort, style, and functionality. Made with innovative moisture-wicking fabric, this premium piece keeps you cool and dry throughout your shift. Features multiple pockets for all your essentials.`}
              </p>
              
              <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Moisture-wicking technology</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Four-way stretch fabric</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Multiple functional pockets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Anti-microbial protection</span>
                </li>
              </ul>

              <h4 className="font-semibold text-gray-900 mb-4">Specifications:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="text-gray-600" data-testid="product-sku">{product.sku}</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Weight:</span>
                    <span className="text-gray-600">{product.weight} {product.weightUnit}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">Fabric:</span>
                  <span className="text-gray-600">95% Polyester, 5% Spandex</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">Care:</span>
                  <span className="text-gray-600">Machine wash cold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {user && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Write a Review
              </button>
            )}
          </div>
          
          {/* Review Form */}
          {showReviewForm && user && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className={`p-1`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Review Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Give your review a title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2 border rounded-md h-32"
                    placeholder="Share your experience with this product"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      resetReviewForm();
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
              reviewsData.reviews.map((review: any) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.user?.fullName || 'Anonymous'}</span>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;