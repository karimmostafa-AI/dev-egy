import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerSections = [
  {
    title: 'Customer Service',
    links: [
      'Contact Us',
      'Live Chat Support',
      '1-800-SCRUBS-1',
      'Size Charts & Fit Guide',
      'Shipping & Delivery',
      'Returns & Exchanges',
      'FAQ & Help Center',
      'Track Your Order'
    ]
  },
  {
    title: 'Healthcare Professionals',
    links: [
      'Nurse Discounts',
      'Student Programs',
      'Group & Bulk Orders',
      'Hospital Partnerships',
      'Uniform Programs',
      'Embroidery & Customization',
      'Healthcare Heroes Program'
    ]
  },
  {
    title: 'Company',
    links: [
      'About DEV Egypt',
      'Our Heritage',
      'Careers & Jobs',
      'Press & Media',
      'Store Locations',
      'Corporate Sales',
      'Investor Relations',
      'Blog',
      'Privacy Policy',
      'Terms of Service'
    ]
  },
  {
    title: 'My Account',
    links: [
      'Sign In / Register',
      'Account Dashboard',
      'Order History',
      'Wishlist & Favorites',
      'Account Settings',
      'Email Preferences',
      'Loyalty Rewards',
      'Gift Cards'
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
    <footer className="bg-gray-900 text-gray-300" data-testid="footer">
      {/* Newsletter Signup */}
      <div className="border-b border-gray-700 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Join the Healthcare Community
          </h3>
          <p className="text-sm mb-4 text-gray-300">
            Get exclusive deals, new arrivals, and healthcare industry updates
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
              data-testid="footer-email-input"
            />
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-l-none border-red-600 hover:border-red-700"
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
                <h4 className="font-semibold text-white mb-4" data-testid={`footer-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => {
                    // Map specific links to their routes
                    let href = '#';
                    if (link === 'Blog') href = '/blog';
                    if (link === 'Privacy Policy') href = '/privacy-policy';
                    if (link === 'Terms of Service') href = '/terms-of-service';
                    if (link === 'Sign In / Register') href = '/auth';
                    if (link === 'Account Dashboard') href = '/account';
                    
                    return (
                      <li key={link}>
                        {href === '#' ? (
                          <button
                            onClick={() => console.log(`Footer link clicked: ${link}`)}
                            className="text-sm text-gray-300 hover:text-white hover:text-red-400 transition-colors text-left"
                            data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {link}
                          </button>
                        ) : (
                          <a
                            href={href}
                            className="text-sm text-gray-300 hover:text-white hover:text-red-400 transition-colors"
                            data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {link}
                          </a>
                        )}
                      </li>
                    );
                  })}
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
              © 2024 DEV Egypt. All rights reserved.
            </div>
            <div className="flex space-x-4 text-xs">
              <a 
                href="/privacy-policy"
                className="hover:text-foreground transition-colors"
                data-testid="privacy-policy-footer"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service"
                className="hover:text-foreground transition-colors"
                data-testid="terms-footer"
              >
                Terms of Service
              </a>
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