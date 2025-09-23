import { useEffect } from "react";

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: string;
  locale?: string;
  siteName?: string;
}

export const useSEO = ({
  title = "DEV Egypt - Professional Medical Uniforms",
  description = "DEV Egypt provides high-quality medical uniforms including scrubs, lab coats, shoes, and accessories for healthcare professionals.",
  keywords = "medical uniforms, scrubs, lab coats, nursing uniforms, healthcare apparel, medical clothing",
  image = "/images/og-image.jpg",
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  robots = "index, follow",
  locale = "en_US",
  siteName = "DEV Egypt",
}: SEOConfig = {}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", author || "DEV Egypt");
    updateMetaTag("robots", robots);
    
    // Update Open Graph tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", image);
    updateMetaTag("og:url", url || window.location.href);
    updateMetaTag("og:type", type);
    updateMetaTag("og:locale", locale);
    updateMetaTag("og:site_name", siteName);
    
    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:site", "@devegypt");
    
    // Update article tags if applicable
    if (type === "article") {
      if (author) updateMetaTag("article:author", author);
      if (publishedTime) updateMetaTag("article:published_time", publishedTime);
      if (modifiedTime) updateMetaTag("article:modified_time", modifiedTime);
    }
    
    // Update canonical URL
    updateCanonicalUrl(url || window.location.href);
    
    // Cleanup function to remove added meta tags when component unmounts
    return () => {
      removeMetaTag("description");
      removeMetaTag("keywords");
      removeMetaTag("author");
      removeMetaTag("robots");
      removeMetaTag("og:title");
      removeMetaTag("og:description");
      removeMetaTag("og:image");
      removeMetaTag("og:url");
      removeMetaTag("og:type");
      removeMetaTag("og:locale");
      removeMetaTag("og:site_name");
      removeMetaTag("twitter:card");
      removeMetaTag("twitter:title");
      removeMetaTag("twitter:description");
      removeMetaTag("twitter:image");
      removeMetaTag("twitter:site");
      removeMetaTag("article:author");
      removeMetaTag("article:published_time");
      removeMetaTag("article:modified_time");
      removeCanonicalUrl();
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, robots, locale, siteName]);

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

  const removeMetaTag = (name: string) => {
    const metaTag = document.querySelector(`meta[name="${name}"]`) || 
                    document.querySelector(`meta[property="${name}"]`);
    
    if (metaTag) {
      metaTag.remove();
    }
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

  const removeCanonicalUrl = () => {
    const canonicalLink = document.querySelector("link[rel='canonical']");
    
    if (canonicalLink) {
      canonicalLink.remove();
    }
  };
};