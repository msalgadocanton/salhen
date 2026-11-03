// Proyectos realizados. Solo se publican trabajos reales con material verificado.
// Las imágenes se guardan en /public/proyectos/<slug>/ y se referencian aquí.

export type ClientSegment = "edificio" | "empresa" | "hogar";

export type Project = {
  slug: string;
  title: string;
  serviceCode: string; // código de data/services.ts, p. ej. "S-02"
  segment: ClientSegment;
  comuna: string;
  date: string; // AAAA-MM
  description: string;
  result: string;
  images: {
    before?: { src: string; alt: string };
    after?: { src: string; alt: string };
    gallery?: { src: string; alt: string }[];
  };
};

export const projects: Project[] = [];
