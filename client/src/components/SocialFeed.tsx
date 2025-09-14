import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialPost {
  id: number;
  username: string;
  avatar: string;
  date: string;
  content: string;
  rating?: number;
  helpful: number;
  notHelpful: number;
  products: {
    name: string;
    rating: number;
    link: string;
  }[];
  tags: string[];
}

const socialPosts: SocialPost[] = [
  {
    id: 1,
    username: "hijabi_with_asteth",
    avatar: "H",
    date: "08/25/25",
    content: "When scrubs meet sneakers = the ultimate back-to-school duo 🙌 uniformadvantage x goclove 🩵🩺👟",
    helpful: 1,
    notHelpful: 0,
    products: [
      { name: "ReSurge Diamond Women's 3-Pocket V-Neck Tuck In / Wear Out Scrub Top", rating: 4.9, link: "#product1" },
      { name: "ReSurge Crystal Women's 7-Pocket High Waisted Wide Leg Pant", rating: 4.9, link: "#product2" },
      { name: "Clove Women's Strada Sand / Navy / White Athletic Lace up Shoe", rating: 0, link: "#product3" }
    ],
    tags: ["#scrubslife", "#medgram", "#medschoollife", "#medstudent", "#doctors", "#meddiaries", "#doctorlife", "#backtoschoool"]
  },
  {
    id: 2,
    username: "brianavivian",
    avatar: "B",
    date: "09/08/25", 
    content: "LOVING uniformadvantage new fall color Tea Rose 🫖💗 Discount code in my linktree under Shop My UA Looks 🫶🏼",
    helpful: 0,
    notHelpful: 0,
    products: [
      { name: "ReSurge Crystal Women's 7-Pocket High Waisted Wide Leg Pant", rating: 4.9, link: "#product2" },
      { name: "Clove Women's Strada Sand / Navy / White Athletic Lace up Shoe", rating: 0, link: "#product3" }
    ],
    tags: ["#nursesofinstagram", "#nursescrubs", "#uascrubs", "#uniformadvantageresurge", "#nurseootd", "#nurseoutfit", "#latinanurse"]
  },
  {
    id: 3,
    username: "uniformadvantage",
    avatar: "U",
    date: "08/23/25",
    content: "Core classics never looked so good💙 Swipe for head-to-toe scrub inspo for the new semester ➡️",
    helpful: 0,
    notHelpful: 0,
    products: [
      { name: "ReSurge Crystal Women's 7-Pocket High Waisted Wide Leg Pant", rating: 4.9, link: "#product2" },
      { name: "Clove Women's Strada Sand / Navy / White Athletic Lace up Shoe", rating: 0, link: "#product3" }
    ],
    tags: []
  }
];

export default function SocialFeed() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showAllProducts, setShowAllProducts] = useState<{ [key: number]: boolean }>({});

  const toggleExpanded = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const toggleShowProducts = (postId: number) => {
    setShowAllProducts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="py-12 px-4" data-testid="social-feed">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Customer Stories</h2>
          <p className="text-muted-foreground">See how our community styles their uniforms</p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPosts.map((post) => (
            <Card key={post.id} className="p-6" data-testid={`social-post-${post.id}`}>
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{post.username}</h4>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-sm text-foreground">
                  {expandedPost === post.id || post.content.length <= 100 
                    ? post.content 
                    : `${post.content.substring(0, 100)}...`
                  }
                </p>
                
                {post.content.length > 100 && (
                  <button
                    onClick={() => toggleExpanded(post.id)}
                    className="text-primary text-xs hover:underline mt-1"
                    data-testid={`toggle-content-${post.id}`}
                  >
                    {expandedPost === post.id ? 'READ LESS' : 'READ MORE...'}
                  </button>
                )}

                {/* Tags */}
                {post.tags.length > 0 && expandedPost === post.id && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Helpful Rating */}
              <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                <span>Was this review helpful?</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{post.helpful}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.notHelpful}</span>
                  </div>
                </div>
              </div>

              {/* Tagged Products */}
              <div className="space-y-3">
                {post.products.slice(0, showAllProducts[post.id] ? undefined : 2).map((product, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      {product.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {renderStars(Math.floor(product.rating))}
                          </div>
                          <span className="text-xs font-medium">{product.rating}</span>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => console.log(`Buy ${product.name}`)}
                        data-testid={`buy-product-${post.id}-${index}`}
                      >
                        Buy Now
                      </Button>
                    </div>
                    <h5 className="text-xs font-semibold mb-1">{product.name}</h5>
                  </div>
                ))}

                {/* Show More/Less Products */}
                {post.products.length > 2 && (
                  <div className="text-center">
                    <button
                      onClick={() => toggleShowProducts(post.id)}
                      className="text-primary text-xs hover:underline"
                      data-testid={`toggle-products-${post.id}`}
                    >
                      {showAllProducts[post.id] ? 'SHOW LESS' : 'SHOW MORE'}
                    </button>
                  </div>
                )}

                {/* Other tagged products label */}
                {post.products.length > 1 && (
                  <div className="text-xs text-muted-foreground text-center mt-2">
                    <span className="font-medium">Other tagged products</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => console.log('Load more posts')}
            data-testid="load-more-posts"
          >
            Load More Stories
          </Button>
        </div>
      </div>
    </div>
  );
}