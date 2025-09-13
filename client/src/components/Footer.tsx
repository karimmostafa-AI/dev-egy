import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerSections = [
  {
    title: 'Customer Service',
    links: [
      'Contact Us',
      'Size Charts',
      'Shipping Info',
      'Returns & Exchanges',
      'FAQ',
      'Track Your Order'
    ]
  },
  {
    title: 'Company',
    links: [
      'About Us',
      'Careers',
      'Press',
      'Investor Relations',
      'Store Locations',
      'Corporate Sales'
    ]
  },
  {
    title: 'Resources',
    links: [
      'Uniform Programs',
      'Group Orders',
      'Embroidery Services',
      'Gift Cards',
      'Student Discounts',
      'Healthcare Heroes'
    ]
  },
  {
    title: 'My Account',
    links: [
      'Sign In',
      'Create Account',
      'Order History',
      'Wishlist',
      'Account Settings',
      'Email Preferences'
    ]
  }
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'YouTube', icon: Youtube, url: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground" data-testid="footer">
      {/* Newsletter Signup */}
      <div className="border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Stay Connected
          </h3>
          <p className="text-sm mb-4">
            Get the latest deals and new product announcements
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="footer-email-input"
            />
            <Button 
              className="rounded-l-none"
              data-testid="footer-subscribe-button"
              onClick={() => console.log('Footer newsletter signup')}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-foreground mb-4" data-testid={`footer-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => console.log(`Footer link clicked: ${link}`)}
                        className="text-sm hover:text-foreground transition-colors"
                        data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="text-sm">
              © 2024 Uniform Advantage. All rights reserved.
            </div>
            <div className="flex space-x-4 text-xs">
              <button 
                onClick={() => console.log('Privacy Policy clicked')}
                className="hover:text-foreground transition-colors"
                data-testid="privacy-policy-footer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => console.log('Terms clicked')}
                className="hover:text-foreground transition-colors"
                data-testid="terms-footer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => console.log('Accessibility clicked')}
                className="hover:text-foreground transition-colors"
                data-testid="accessibility-footer"
              >
                Accessibility
              </button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <button
                  key={social.name}
                  onClick={() => console.log(`${social.name} clicked`)}
                  className="p-2 hover:text-foreground transition-colors hover-elevate rounded"
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}