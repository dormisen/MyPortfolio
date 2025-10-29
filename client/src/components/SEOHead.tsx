import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title = "Rida Iquen - Creative Designer & Full-Stack Developer",
  description = "Portfolio of Rida Iquen, a creative designer and full-stack developer specializing in modern web applications, UI/UX design, and innovative digital solutions.",
  keywords = "portfolio, web developer, full-stack developer, UI/UX designer, React, Node.js, JavaScript, TypeScript, creative designer",
  image = "/assets/logoorigin.png",
  url = "https://ridaportfolio.com",
  type = "website"
}: SEOHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string, sizes?: string) => {
      let el = document.head.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (sizes) el.setAttribute('sizes', sizes);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Basic
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('author', 'Rida Iquen');
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:type', type, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:site_name', 'Rida Iquen Portfolio', 'property');

    // Twitter
    setMeta('twitter:card', 'summary_large_image', 'property');
    setMeta('twitter:url', url, 'property');
    setMeta('twitter:title', title, 'property');
    setMeta('twitter:description', description, 'property');
    setMeta('twitter:image', image, 'property');
    setMeta('twitter:creator', '@ridaportfolio', 'property');

    // Theme
    setMeta('theme-color', '#06b6d4');
    setMeta('msapplication-TileColor', '#06b6d4');

    // Canonical + Icons
    const canonicalId = 'app-canonical-link';
    let canonical = document.getElementById(canonicalId) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.id = canonicalId;
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    setLink('icon', '/favicon-32x32.png', '32x32');
    setLink('icon', '/favicon-16x16.png', '16x16');
    setLink('apple-touch-icon', '/apple-touch-icon.png', '180x180');
    setLink('manifest', '/site.webmanifest');

    // Structured data
    const ldId = 'app-ld-json';
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = ldId;
      document.head.appendChild(ld);
    }
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Rida Iquen",
      jobTitle: "Creative Designer & Full-Stack Developer",
      description,
      url,
      image,
      sameAs: [
        "https://github.com/ridaportfolio",
        "https://linkedin.com/in/ridaportfolio",
        "https://twitter.com/ridaportfolio"
      ],
      knowsAbout: [
        "Web Development",
        "UI/UX Design",
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "Full-Stack Development"
      ],
      alumniOf: "University",
      worksFor: { "@type": "Organization", name: "Freelance" }
    });
  }, [title, description, keywords, image, url, type]);

  return null;
}
