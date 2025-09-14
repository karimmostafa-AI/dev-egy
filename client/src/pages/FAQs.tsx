import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQ[] = [
  {
    id: 1,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unworn items in original condition. Items must have tags attached and be returned in original packaging. Sale items are final sale unless defective.",
    category: "Returns & Exchanges"
  },
  {
    id: 2,
    question: "How do I determine my scrub size?",
    answer: "Use our detailed size chart available on each product page. Measure your chest, waist, and hips, then compare to our sizing guide. If between sizes, we recommend sizing up for comfort. Contact us for personalized sizing assistance.",
    category: "Sizing & Fit"
  },
  {
    id: 3,
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free standard shipping on orders over $50. Orders under $50 have a flat $7.99 shipping fee. Express shipping options are available for an additional cost.",
    category: "Shipping"
  },
  {
    id: 4,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Processing time is 1-2 business days before shipping. You'll receive a tracking number once your order ships.",
    category: "Shipping"
  },
  {
    id: 5,
    question: "Do you have physical stores I can visit?",
    answer: "Yes! We have over 100 retail locations nationwide. Use our store locator to find the nearest location. Many stores offer fitting services and in-person consultations.",
    category: "Store Locations"
  },
  {
    id: 6,
    question: "How do I care for my scrubs?",
    answer: "Machine wash cold with like colors. Avoid bleach. Tumble dry low or hang dry for best results. Iron on low heat if needed. Check individual product labels for specific care instructions.",
    category: "Care Instructions"
  },
  {
    id: 7,
    question: "Do you offer group or bulk discounts?",
    answer: "Yes! We offer special pricing for healthcare facilities and large orders. Contact our group sales team at 1-800-SCRUBS-1 for custom quotes and volume discounts.",
    category: "Group Orders"
  },
  {
    id: 8,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and healthcare facility purchase orders for qualified accounts.",
    category: "Payment"
  },
  {
    id: 9,
    question: "Are your scrubs antimicrobial?",
    answer: "Many of our scrubs feature antimicrobial treatments that help reduce odor-causing bacteria. Look for the antimicrobial badge on product pages. Popular antimicrobial brands include Barco One and Cherokee Revolution.",
    category: "Product Features"
  },
  {
    id: 10,
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking email with your tracking number. You can also track your order on our website using your order number and email address.",
    category: "Order Status"
  }
];

const categories = [
  "All Categories",
  "Returns & Exchanges", 
  "Sizing & Fit",
  "Shipping",
  "Store Locations",
  "Care Instructions",
  "Group Orders",
  "Payment",
  "Product Features",
  "Order Status"
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about our medical uniforms, shipping, returns, and more.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
                {selectedCategory === category && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category === 'All Categories' 
                      ? filteredFAQs.length 
                      : faqData.filter(faq => faq.category === category).length
                    }
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base">{faq.question}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4">
                    <div className="border-t pt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-16">
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our customer service team is here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Live Chat
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}