import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Page Header */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 1, 2023</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="lead">
            At DEV Egypt, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make purchases from us.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>Name, email address, phone number, and mailing address</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Order history and preferences</li>
            <li>Account credentials (username and password)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide customer support</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Improve our website and services</li>
            <li>Send promotional offers (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Data Protection</h2>
          <p>We implement industry-standard security measures to protect your data, including:</p>
          <ul>
            <li>Encrypted data transmission (SSL/TLS)</li>
            <li>Secure payment processing</li>
            <li>Regular security audits</li>
            <li>Restricted access to personal information</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.</p>

          <h2>Third-Party Services</h2>
          <p>We may share information with trusted third parties for:</p>
          <ul>
            <li>Payment processing</li>
            <li>Order fulfillment and shipping</li>
            <li>Email marketing (Mailchimp, etc.)</li>
            <li>Analytics (Google Analytics, etc.)</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our website.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p>
            <strong>Email:</strong> privacy@uniformadvantageclone.com<br />
            <strong>Phone:</strong> 1-800-555-0123<br />
            <strong>Mail:</strong> Privacy Officer, DEV Egypt, 123 Medical Drive, Healthcare City, HC 12345
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}