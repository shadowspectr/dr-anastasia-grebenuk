import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead = ({ 
  title = "Dr. Anastasia Grebenuk - Косметолог с медицинским образованием в Донецке",
  description = "Профессиональные косметологические услуги в Донецке: контурная пластика, биоревитализация, мезотерапия, чистка лица, пилинги. Врач с медицинским образованием.",
  keywords = "косметолог Донецк, контурная пластика, биоревитализация, мезотерапия, чистка лица, пилинг, инъекции красоты, медицинская косметология",
  image = "/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png",
  url = "https://cosmetolog-dn-ru.lovable.app",
  type = "website"
}: SEOHeadProps) => {
  useEffect(() => {
    // Обновляем title
    document.title = title;
    
    // Функция для обновления или создания meta тега
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Основные SEO meta теги
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('author', 'Dr. Anastasia Grebenuk');
    
    // Open Graph
    updateMetaTag('', title, 'og:title');
    updateMetaTag('', description, 'og:description');
    updateMetaTag('', image, 'og:image');
    updateMetaTag('', url, 'og:url');
    updateMetaTag('', type, 'og:type');
    updateMetaTag('', 'ru_RU', 'og:locale');
    updateMetaTag('', 'Dr. Anastasia Grebenuk - Косметология', 'og:site_name');
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Дополнительные теги для локального бизнеса
    updateMetaTag('geo.region', 'UA-14');
    updateMetaTag('geo.placename', 'Донецк');
    updateMetaTag('geo.position', '48.002870;37.864529');
    updateMetaTag('ICBM', '48.002870, 37.864529');
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, keywords, image, url, type]);

  return null;
};