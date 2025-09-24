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

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const { trackProductView, trackAddToCart } = useTrackEvent();
  const { addItem, isAddingItem } = useCart();
  const { toast } = useToast();
  
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
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock data for colors and sizes since they're not in the backend schema yet
  const mockColors = ['Black', 'Navy', 'White', 'Royal Blue'];
  const mockSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const mockImages = [
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg',
    '/images/scrub-top.jpg'
  ];
  
  // Set default color when component mounts
  useEffect(() => {
    if (mockColors.length > 0 && !selectedColor) {
      setSelectedColor(mockColors[0]);
    }
  }, [selectedColor]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track product view
    if (product) {
      trackProductView(product.id, product.name, 'Brand Name');
    }
  }, [product, trackProductView]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Size Required',
        description: 'Please select a size before adding to cart.',
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
    
    // Add to cart using the useCart hook
    addItem(
      {
        productId: product.id,
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
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="product-rating">
                  4.5 (150 reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary" data-testid="product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xl text-muted-foreground line-through" data-testid="product-compare-price">
                      ${parseFloat(product.comparePrice).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.comparePrice && (
                  <div className="mt-1 text-sm text-green-600 font-medium" data-testid="product-savings">
                    You save ${(parseFloat(product.comparePrice) - parseFloat(product.price)).toFixed(2)} ({Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)}%)
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-2">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {mockColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color 
                        ? 'border-black ring-2 ring-offset-2 ring-primary' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={color}
                    data-testid={`color-${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {mockSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 rounded-md border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium" data-testid="product-availability">
                {product.isAvailable && product.inventoryQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-gray-600">• Ships in 1-2 business days</span>
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
                Reviews (150)
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
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;