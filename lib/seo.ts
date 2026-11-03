import { services } from "@/data/services";
import { logos } from "@/lib/brand";
import { siteConfig } from "@/lib/site";

// Datos estructurados de la empresa. Teléfono y correo solo se incluyen si están configurados.
export function organizationJsonLd() {
  const { email, phone } = siteConfig.contact;
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#empresa`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${logos.vertical.src}`,
    image: `${siteConfig.url}${logos.vertical.src}`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: "CL",
    },
    areaServed: siteConfig.coverage.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "AdministrativeArea", name: siteConfig.region },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de mantención y reparación",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.summary },
      })),
    },
  };
}
