// Configuración central del sitio. Los datos de contacto vienen solo de variables de
// entorno: si no están definidos, el sitio no los muestra (no se inventan).

function clean(value: string | undefined) {
  const v = value?.trim();
  return v ? v : null;
}

export const siteConfig = {
  name: "SALHEN",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "es_CL",
  tagline: "Mantención con respaldo",
  description:
    "Mantención, reparación y trabajos especializados para edificios, condominios, empresas y hogares del sector oriente de Santiago. Un solo contacto, especialistas coordinados y respaldo documentado.",
  region: "Región Metropolitana",
  city: "Santiago",
  coverage: ["Las Condes", "Vitacura", "Providencia", "Lo Barnechea", "La Reina", "Ñuñoa"],
  contact: {
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },
} as const;

export function whatsappHref(message?: string) {
  const number = siteConfig.contact.whatsapp?.replace(/\D/g, "");
  if (!number) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}
