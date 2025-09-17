import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 1, 2023</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="lead">
            Welcome to DEV Egypt. These Terms of Service govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms.
          </p>

          <h2>1. Use of Service</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
          <ul>
            <li>Use our services in any way that violates applicable laws</li>
            <li>Interfere with the operation of our services</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use our services to transmit harmful content</li>
          </ul>

          <h2>2. Account Registration</h2>
          <p>To access certain features, you may need to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h2>3. Orders and Payments</h2>
          <p>When placing an order:</p>
          <ul>
            <li>All orders are subject to acceptance and availability</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to refuse or cancel orders</li>
            <li>Payment must be made in full at the time of purchase</li>
            <li>Taxes and shipping fees will be added to your order</li>
          </ul>

          <h2>4. Shipping and Delivery</h2>
          <p>Shipping policies include:</p>
          <ul>
            <li>Shipping times are estimates and not guaranteed</li>
            <li>Risk of loss transfers to you upon delivery</li>
            <li>We are not responsible for customs delays or duties</li>
            <li>Some items may have specific shipping restrictions</li>
          </ul>

          <h2>5. Returns and Refunds</h2>
          <p>Our return policy includes:</p>
          <ul>
            <li>Returns accepted within 30 days of purchase</li>
            <li>Items must be unworn and in original packaging</li>
            <li>Return shipping costs are the customer's responsibility</li>
            <li>Refunds processed within 7-14 business days</li>
            <li>Final sale items are not eligible for return</li>
          </ul>

          <h2>6. Product Information</h2>
          <p>We strive to provide accurate product information, but:</p>
          <ul>
            <li>Product descriptions and images are for reference only</li>
            <li>Colors may vary due to monitor differences</li>
            <li>Specifications are subject to change without notice</li>
            <li>We are not liable for manufacturer errors</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul>
            <li>We are not liable for indirect or consequential damages</li>
            <li>Our total liability is limited to the purchase price</li>
            <li>We make no warranties beyond those stated in these terms</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <p>All content on our website is protected by intellectual property laws:</p>
          <ul>
            <li>Content may not be reproduced without permission</li>
            <li>Trademarks and logos are the property of their owners</li>
            <li>User-generated content remains the user's property</li>
          </ul>

          <h2>9. Governing Law</h2>
          <p>These Terms are governed by the laws of [Your State/Country], without regard to conflict of law principles.</p>

          <h2>10. Changes to Terms</h2>
          <p>We may modify these Terms at any time. Changes are effective immediately upon posting to our website.</p>

          <h2>11. Contact Information</h2>
          <p>For questions about these Terms, please contact us at:</p>
          <p>
            <strong>Email:</strong> terms@uniformadvantageclone.com<br />
            <strong>Phone:</strong> 1-800-555-0123<br />
            <strong>Mail:</strong> Legal Department, DEV Egypt, 123 Medical Drive, Healthcare City, HC 12345
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}