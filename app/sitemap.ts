import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Se ampliará con las páginas de servicios y segmentos a medida que se publiquen.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteConfig.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
