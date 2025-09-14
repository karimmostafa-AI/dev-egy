import maleWorkerImage from '@assets/generated_images/Male_healthcare_worker_sitting_40871523.png';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isOnSale?: boolean;
  isNew?: boolean;
  colors: string[];
  sizes: string[];
}

export interface ProductDetail extends Product {
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  availability: string;
  shipping: string;
}

// Comprehensive men's medical uniform product catalog
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Cherokee Revolution V-Neck Top",
    brand: "Cherokee",
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 267,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Navy", "Black", "Royal Blue", "White"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 2,
    name: "Barco One Cargo Scrub Pants",
    brand: "Barco",
    price: 3599,
    originalPrice: 3999,
    rating: 4.7,
    reviewCount: 189,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "Pewter", "White"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 3,
    name: "WonderWink Renew Cargo Pant",
    brand: "WonderWink",
    price: 2799,
    rating: 4.5,
    reviewCount: 298,
    image: maleWorkerImage,
    colors: ["Black", "Navy", "Hunter Green", "Wine"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"]
  },
  {
    id: 4,
    name: "Healing Hands Purple Label Top",
    brand: "Healing Hands",
    price: 2299,
    originalPrice: 2699,
    rating: 4.9,
    reviewCount: 412,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "Royal Blue", "White", "Wine"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 5,
    name: "Greys Anatomy Signature Series",
    brand: "Greys Anatomy",
    price: 3299,
    rating: 4.6,
    reviewCount: 156,
    image: maleWorkerImage,
    isNew: true,
    colors: ["Black", "Navy", "Pewter"],
    sizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 6,
    name: "Dickies Dynamix V-Neck Top",
    brand: "Dickies",
    price: 1999,
    originalPrice: 2399,
    rating: 4.4,
    reviewCount: 224,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "Hunter Green", "White"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 7,
    name: "Landau Proflex Modern Jogger",
    brand: "Landau",
    price: 2699,
    rating: 4.3,
    reviewCount: 187,
    image: maleWorkerImage,
    colors: ["Black", "Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 8,
    name: "Koi Lite Peace Cargo Pants",
    brand: "Koi",
    price: 2999,
    originalPrice: 3499,
    rating: 4.6,
    reviewCount: 145,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "White", "Hunter Green"],
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 9,
    name: "UA Butter-Soft Men's V-Neck",
    brand: "Uniform Advantage",
    price: 1999,
    originalPrice: 2499,
    rating: 4.8,
    reviewCount: 445,
    image: maleWorkerImage,
    isOnSale: true,
    colors: ["Black", "Navy", "White", "Royal Blue"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 10,
    name: "FIGS Technical Collection Top",
    brand: "FIGS",
    price: 3899,
    rating: 4.9,
    reviewCount: 298,
    image: maleWorkerImage,
    isNew: true,
    colors: ["Black", "Navy", "White"],
    sizes: ["M", "L", "XL", "2XL"]
  }
];

// Convert product to detailed product for ProductDetail page
export const getProductDetail = (id: number): ProductDetail | null => {
  const product = sampleProducts.find(p => p.id === id);
  if (!product) return null;

  return {
    ...product,
    images: [
      product.image,
      product.image,
      product.image,
      product.image
    ],
    description: `The ${product.name} combines comfort, style, and functionality. Made with innovative moisture-wicking fabric, this ${product.brand} piece keeps you cool and dry throughout your shift. Features multiple pockets for all your essentials.`,
    features: [
      'Moisture-wicking technology',
      'Four-way stretch fabric',
      'Multiple functional pockets',
      'Anti-microbial protection',
      'Easy-care fabric',
      'Fade-resistant colors'
    ],
    specifications: {
      'Fabric': '95% Polyester, 5% Spandex',
      'Length': '25.5 inches (size Medium)',
      'Care': 'Machine wash cold, tumble dry low',
      'Fit': 'Contemporary fit',
      'Pockets': '2 front pockets, 1 chest pocket',
      'Neckline': 'V-neck'
    },
    availability: 'In Stock',
    shipping: 'Ships within 1-2 business days'
  };
};