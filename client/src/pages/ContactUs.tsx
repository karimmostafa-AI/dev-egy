import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle, Users, Truck } from 'lucide-react';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help healthcare professionals find the perfect uniforms. 
            Reach out to our dedicated customer service team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="mt-1 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium">Customer Service</h4>
                    <p className="text-sm text-muted-foreground">1-800-SCRUBS-1</p>
                    <p className="text-sm text-muted-foreground">(1-800-727-8271)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@uniformadvantage.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-8PM EST</p>
                    <p className="text-sm text-muted-foreground">Sat-Sun: 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium">Headquarters</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Medical Center Drive<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Help Topics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Help</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Size & Fit Guide</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm">Shipping & Returns</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Group Orders</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Live Chat Support</span>
                </div>
              </div>
            </Card>

            {/* FAQ Link */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Need Quick Answers?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check out our comprehensive FAQ section for instant answers to common questions.
              </p>
              <Button variant="outline" className="w-full">
                View FAQs
              </Button>
            </Card>
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">More Ways to Connect</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team in real-time for immediate assistance.
              </p>
              <Badge variant="secondary">Available 24/7</Badge>
            </Card>

            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Group Orders</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Special pricing and support for bulk orders and healthcare facilities.
              </p>
              <Badge variant="secondary">Volume Discounts</Badge>
            </Card>

            <Card className="p-6 text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Store Locator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find a physical store near you for in-person assistance and fittings.
              </p>
              <Badge variant="secondary">100+ Locations</Badge>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}