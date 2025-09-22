import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, CheckCircle } from 'lucide-react';
import { getProductDetail } from '@/data/products';
import NotFound from '@/pages/not-found';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTrackEvent } from '@/hooks/useTracking';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { trackProductView, trackAddToCart } = useTrackEvent();
  
  // Get product by ID - show NotFound if product doesn't exist
  const product = getProductDetail(parseInt(id || '0', 10));
  
  if (!product) {
    return <NotFound />;
  }
  
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track product view
    trackProductView(product.id.toString(), product.name, product.brand);
  }, [product.id, product.name, product.brand, trackProductView]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Track add to cart event
    trackAddToCart(
      product.id.toString(), 
      product.name, 
      quantity, 
      parseFloat((product.price || 0).toString())
    );
    
    // Add to cart logic here
    console.log('Adding to cart:', { product, selectedColor, selectedSize, quantity });
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${product.name} - DEV Egypt`}
        description={product.description}
        keywords={`${product.name}, ${product.brand}, medical uniform, scrubs, healthcare apparel`}
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
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isOnSale && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  SALE
                </div>
              )}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
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
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-1">{product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${(product.originalPrice / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="mt-1 text-sm text-green-600 font-medium">
                    You save ${(Math.abs(product.price - product.originalPrice) / 100).toFixed(2)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-2">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
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
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 rounded-md border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
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
                >
                  −
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
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
                  className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg border ${
                    isFavorite ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
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
              <span className="font-medium">{product.availability}</span>
              <span className="text-gray-600">• {product.shipping}</span>
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
                Reviews ({product.reviewCount})
              </button>
              <button className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Size Guide
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab Content */}
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-gray-900 mb-4">Specifications:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
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