import { useLocation } from 'wouter';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';
import { Calendar, User, Clock } from 'lucide-react';

// Mock blog post data
const blogPost = {
  id: 1,
  title: "The Evolution of Medical Uniforms: From Basic to Fashion-Forward",
  author: "Dr. Emily Roberts",
  date: "2023-05-15",
  readTime: "5 min read",
  category: "Industry Trends",
  content: `
    <p>The medical uniform has undergone a remarkable transformation over the past century. What began as simple, functional garments designed purely for practicality have evolved into sophisticated pieces that blend style, comfort, and professionalism.</p>
    
    <h2>Early Days of Medical Wear</h2>
    <p>In the early 1900s, medical professionals wore whatever clothing they deemed appropriate for work. White coats became standard for doctors as a symbol of cleanliness and scientific rigor, while nurses often wore long dresses with aprons.</p>
    
    <h2>The Birth of Modern Scrubs</h2>
    <p>The 1940s marked a pivotal moment in medical uniform history. The first surgical scrubs were introduced as a way to maintain sterility in operating rooms. These early scrubs were simple, loose-fitting garments made from cotton, typically in green or blue to reduce eye strain during long surgeries.</p>
    
    <h2>Material Revolution</h2>
    <p>The 1970s and 1980s brought synthetic fabrics to medical wear. Polyester and later polyester-cotton blends offered better durability, easier cleaning, and improved comfort. These materials also allowed for the introduction of anti-microbial treatments that helped reduce the spread of pathogens.</p>
    
    <h2>The Fashion Factor</h2>
    <p>Beginning in the 1990s, medical uniforms started to embrace fashion elements. Scrubs began featuring colorful prints, varied necklines, and different cuts. This shift not only improved morale among healthcare workers but also helped patients feel more comfortable by reducing the clinical, intimidating atmosphere.</p>
    
    <h2>Today's Innovation</h2>
    <p>Modern medical uniforms incorporate cutting-edge technology:</p>
    <ul>
      <li>Moisture-wicking fabrics that keep wearers cool and dry</li>
      <li>Anti-microbial treatments that reduce odor and bacteria</li>
      <li>Stain-resistant materials that maintain their appearance</li>
      <li>Ergonomic designs that provide maximum mobility</li>
      <li>UV protection for outdoor healthcare settings</li>
    </ul>
    
    <h2>The Future of Medical Wear</h2>
    <p>As we look to the future, several trends are emerging:</p>
    <ul>
      <li><strong>Sustainability:</strong> Eco-friendly materials and manufacturing processes</li>
      <li><strong>Smart Fabrics:</strong> Integration of technology for health monitoring</li>
      <li><strong>Customization:</strong> Personalized fits and styles for individual comfort</li>
      <li><strong>Inclusivity:</strong> Expanded sizing ranges and adaptive designs</li>
    </ul>
    
    <p>The evolution of medical uniforms reflects broader changes in healthcare – a shift from purely functional to holistic, considering not just sterility and durability but also comfort, confidence, and even style. As the healthcare industry continues to evolve, we can expect medical wear to continue innovating alongside it.</p>
  `
};

export default function BlogPost() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => setLocation('/')} className="text-gray-600 hover:text-black">
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button onClick={() => setLocation('/blog')} className="text-gray-600 hover:text-black">
              Blog
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">{blogPost.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">{blogPost.category}</span>
              <span>{blogPost.readTime}</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">{blogPost.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blogPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </header>

          <div className="bg-gray-200 border-2 border-dashed w-full h-96 mb-8 rounded-lg" />

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </article>

        {/* Related Posts */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <span className="text-sm text-primary">Product Guide</span>
                <h3 className="font-bold text-lg mt-2 mb-3">Top 10 Features to Look for in Anti-Microbial Scrubs</h3>
                <p className="text-muted-foreground text-sm">Not all scrubs are created equal. Here's what to consider when choosing the best anti-microbial scrubs for your profession.</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <span className="text-sm text-primary">Sizing & Fit</span>
                <h3 className="font-bold text-lg mt-2 mb-3">How to Choose the Perfect Fit: A Complete Scrub Sizing Guide</h3>
                <p className="text-muted-foreground text-sm">Finding the right scrub fit can be challenging. Our comprehensive guide helps you choose the perfect size for comfort and mobility.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}