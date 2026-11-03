export type Service = {
  code: string;
  slug: string;
  name: string;
  short: string;
  summary: string;
  items: string[];
  note?: string;
};

// Catálogo oficial de servicios. El slug queda reservado para las páginas individuales.
export const services: Service[] = [
  {
    code: "S-01",
    slug: "electricidad-e-instalaciones",
    name: "Electricidad e instalaciones",
    short: "Electricidad",
    summary:
      "Instalaciones nuevas, reparaciones, tableros e iluminación de áreas comunes y exteriores, con mantención preventiva programada.",
    items: [
      "Instalaciones eléctricas nuevas",
      "Reparación de instalaciones",
      "Tableros eléctricos",
      "Renovación de circuitos",
      "Iluminación de áreas comunes",
      "Instalación de luminarias",
      "Iluminación exterior",
      "Sensores y automatismos básicos",
      "Mantención eléctrica preventiva",
      "Trabajos eléctricos en altura",
    ],
    note:
      "Los trabajos que lo requieren son ejecutados por especialistas con la autorización SEC correspondiente al tipo de instalación.",
  },
  {
    code: "S-02",
    slug: "techumbres-e-impermeabilizacion",
    name: "Techumbres e impermeabilización",
    short: "Techumbres",
    summary:
      "Reparación y mantención de cubiertas, sellado de filtraciones, canaletas, bajadas de aguas lluvias y terrazas.",
    items: [
      "Reparación de techumbres",
      "Mantención preventiva",
      "Sellado de filtraciones",
      "Impermeabilización",
      "Reparación de canaletas",
      "Bajadas de aguas lluvias",
      "Reparación de cubiertas",
      "Sellado de juntas",
      "Reparación de terrazas",
      "Trabajos en altura",
    ],
  },
  {
    code: "S-03",
    slug: "soldadura-y-estructuras-metalicas",
    name: "Soldadura y estructuras metálicas",
    short: "Soldadura",
    summary:
      "Reparación y fabricación de portones, rejas, barandas, puertas metálicas y refuerzos estructurales menores.",
    items: [
      "Soldadura",
      "Reparación de portones",
      "Rejas",
      "Barandas",
      "Estructuras metálicas",
      "Puertas metálicas",
      "Refuerzos estructurales menores",
      "Reparación de cierres",
    ],
  },
  {
    code: "S-04",
    slug: "gasfiteria-y-reparaciones-sanitarias",
    name: "Gasfitería y reparaciones sanitarias",
    short: "Gasfitería",
    summary:
      "Filtraciones, cañerías, desagües, grifería y artefactos sanitarios en redes interiores.",
    items: [
      "Reparación de filtraciones",
      "Cañerías",
      "Desagües",
      "Grifería",
      "Artefactos sanitarios",
      "Reparación de redes interiores",
    ],
    note: "No incluye sistemas de bombeo.",
  },
  {
    code: "S-05",
    slug: "pintura-y-terminaciones",
    name: "Pintura y terminaciones",
    short: "Pintura",
    summary:
      "Pintura interior y exterior, fachadas, pasillos y áreas comunes, con reparación previa de muros y cielos.",
    items: [
      "Pintura interior",
      "Pintura exterior",
      "Fachadas",
      "Pasillos",
      "Áreas comunes",
      "Reparación de muros",
      "Cielos",
      "Terminaciones",
    ],
  },
  {
    code: "S-06",
    slug: "obras-civiles-menores",
    name: "Obras civiles menores",
    short: "Obras menores",
    summary:
      "Albañilería, pavimentos, accesos, escaleras y estacionamientos. Mejoras constructivas acotadas.",
    items: [
      "Albañilería",
      "Pavimentos",
      "Reparación de muros",
      "Reparación de accesos",
      "Escaleras",
      "Estacionamientos",
      "Mejoras constructivas",
    ],
  },
  {
    code: "S-07",
    slug: "piscinas",
    name: "Piscinas",
    short: "Piscinas",
    summary:
      "Mantención y reparación de superficies, revestimientos, sellos e impermeabilización del vaso.",
    items: [
      "Mantención de superficies",
      "Reparación de revestimientos",
      "Sellos",
      "Impermeabilización",
      "Reparaciones constructivas",
    ],
    note: "No incluye sistemas de bombeo ni filtrado.",
  },
  {
    code: "S-08",
    slug: "mantencion-general",
    name: "Mantención general",
    short: "Mantención",
    summary:
      "Puertas, cerraduras, accesos y elementos de áreas comunes. Reparaciones generales y mantenciones programadas.",
    items: [
      "Puertas",
      "Cerraduras",
      "Accesos",
      "Elementos de áreas comunes",
      "Reparaciones generales",
      "Mantenciones programadas",
    ],
  },
];

export const exclusions = [
  "Administración de edificios",
  "Mantención de ascensores",
  "Mantención de bombas y sistemas de bombeo",
  "Emergencias 24/7",
];
