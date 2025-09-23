import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO = ({
  title = "DEV Egypt - Professional Medical Uniforms",
  description = "DEV Egypt provides high-quality medical uniforms including scrubs, lab coats, shoes, and accessories for healthcare professionals.",
  keywords = "medical uniforms, scrubs, lab coats, nursing uniforms, healthcare apparel, medical clothing",
  image = "/images/og-image.jpg",
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const [location] = useLocation();
  const currentUrl = url || `${window.location.origin}${location}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", author || "DEV Egypt");
    
    // Update Open Graph tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", image);
    updateMetaTag("og:url", currentUrl);
    updateMetaTag("og:type", type);
    
    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    
    // Update article tags if applicable
    if (type === "article") {
      if (author) updateMetaTag("article:author", author);
      if (publishedTime) updateMetaTag("article:published_time", publishedTime);
      if (modifiedTime) updateMetaTag("article:modified_time", modifiedTime);
    }
    
    // Update canonical URL
    updateCanonicalUrl(currentUrl);
  }, [title, description, keywords, image, currentUrl, type, author, publishedTime, modifiedTime]);

  const updateMetaTag = (name: string, content: string | undefined) => {
    if (!content) return;
    
    let metaTag = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);
    
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") || name.startsWith("article:") ? "property" : "name", name);
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute("content", content);
  };

  const updateCanonicalUrl = (url: string) => {
    let canonicalLink = document.querySelector("link[rel='canonical']");
    
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute("href", url);
  };

  return null;
};

export default SEO;