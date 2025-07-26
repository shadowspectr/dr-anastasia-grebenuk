import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'WebSite' | 'MedicalBusiness' | 'Service';
  data?: any;
}

export const StructuredData = ({ type = 'WebSite', data }: StructuredDataProps) => {
  useEffect(() => {
    const getStructuredData = () => {
      const baseData = {
        "@context": "https://schema.org",
        "@type": type,
      };

      switch (type) {
        case 'WebSite':
          return {
            ...baseData,
            "name": "Dr. Anastasia Grebenuk - Косметология",
            "url": "https://cosmetolog-dn-ru.lovable.app",
            "description": "Профессиональные косметологические услуги в Донецке",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://cosmetolog-dn-ru.lovable.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          };

        case 'MedicalBusiness':
          return {
            ...baseData,
            "name": "Dr. Anastasia Grebenuk",
            "description": "Врач-косметолог с медицинским образованием",
            "url": "https://cosmetolog-dn-ru.lovable.app",
            "telephone": "+7 949 342 0216",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "пр. Ильича 109А",
              "addressLocality": "Донецк",
              "addressCountry": "UA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "48.002870",
              "longitude": "37.864529"
            },
            "openingHours": "Tu,Th,Fr 09:00-18:00",
            "priceRange": "$$",
            "medicalSpecialty": "Косметология",
            "serviceArea": {
              "@type": "City",
              "name": "Донецк"
            }
          };

        case 'Service':
          return {
            ...baseData,
            "serviceType": "Косметологические услуги",
            "provider": {
              "@type": "MedicalBusiness",
              "name": "Dr. Anastasia Grebenuk"
            },
            "areaServed": {
              "@type": "City",
              "name": "Донецк"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Косметологические процедуры",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Контурная пластика"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Биоревитализация"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Мезотерапия"
                  }
                }
              ]
            }
          };

        default:
          return baseData;
      }
    };

    const structuredData = data || getStructuredData();

    // Удаляем существующий script с тем же типом
    const existingScript = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Создаем новый script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-type', type);
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
};