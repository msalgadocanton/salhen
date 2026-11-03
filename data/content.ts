// Contenido editorial de la página de inicio, separado de los componentes.

export const navigation = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Edificios", href: "/#edificios" },
  { label: "Empresas", href: "/#empresas" },
  { label: "Hogares", href: "/#hogares" },
  { label: "Pasaporte técnico", href: "/#pasaporte" },
  { label: "Proceso", href: "/#proceso" },
] as const;

export const pillars = [
  {
    title: "Coordinación centralizada",
    text: "Un mismo interlocutor para todas las especialidades de tu propiedad. Tú hablas con SALHEN y nosotros coordinamos al resto.",
  },
  {
    title: "Especialistas calificados",
    text: "Trabajamos con una red de contratistas especializados que ejecutan bajo la marca y los estándares de SALHEN.",
  },
  {
    title: "Supervisión de cada trabajo",
    text: "Revisamos el avance y el cierre de cada intervención antes de darla por terminada.",
  },
  {
    title: "Respaldo documentado",
    text: "Fotografías antes y después, informe del trabajo y condiciones de garantía por escrito.",
  },
];

export type BuildingZone = "roof" | "facade" | "shaft" | "ground" | "all" | null;

export const buildingCapabilities: { id: string; label: string; zone: BuildingZone; text: string }[] = [
  {
    id: "programada",
    label: "Mantención programada",
    zone: "all",
    text: "Un calendario de revisiones para todo el edificio, acordado con la administración y el comité.",
  },
  {
    id: "techumbres",
    label: "Techumbres e impermeabilización",
    zone: "roof",
    text: "Cubiertas, canaletas, bajadas de aguas lluvias, sellos y terrazas, antes y después de la temporada de lluvias.",
  },
  {
    id: "altura",
    label: "Trabajos en altura",
    zone: "facade",
    text: "Fachadas, sellos de ventanas y pintura exterior ejecutados por personal especializado en trabajo en altura.",
  },
  {
    id: "electricidad",
    label: "Electricidad",
    zone: "shaft",
    text: "Tableros, circuitos e iluminación de pasillos, escaleras, estacionamientos y áreas comunes.",
  },
  {
    id: "reparaciones",
    label: "Reparaciones generales",
    zone: "ground",
    text: "Accesos, portones, puertas, cerraduras, pavimentos y elementos de uso diario de la comunidad.",
  },
  {
    id: "respaldo",
    label: "Informes, documentación y garantías",
    zone: null,
    text: "Cada intervención se cierra con registro fotográfico, informe y condiciones de garantía para la administración.",
  },
];

export const processSteps = [
  { title: "Solicitas una evaluación", text: "Nos cuentas qué necesita tu propiedad por el formulario o por WhatsApp. Puedes adjuntar fotografías." },
  { title: "Revisamos el requerimiento", text: "Analizamos la información y, cuando corresponde, coordinamos una visita técnica." },
  { title: "Coordinamos especialistas", text: "Asignamos a los especialistas adecuados para cada parte del trabajo." },
  { title: "Presentamos una cotización", text: "Recibes una propuesta por escrito con alcance, plazos y condiciones." },
  { title: "Ejecutamos y supervisamos", text: "Los trabajos se realizan con supervisión de SALHEN durante su desarrollo y al cierre." },
  { title: "Documentamos y entregamos", text: "Entregamos fotografías antes y después y un informe del trabajo realizado." },
  { title: "Respaldamos el trabajo", text: "La intervención queda cubierta según las condiciones de garantía acordadas en la cotización." },
];

export type PassportItem = { title: string; text: string; status: "hoy" | "desarrollo" };

export const passportItems: PassportItem[] = [
  { title: "Registro fotográfico", text: "Fotografías antes y después de cada intervención.", status: "hoy" },
  { title: "Documentación técnica", text: "Informe del trabajo con el alcance ejecutado y los materiales.", status: "hoy" },
  { title: "Garantías", text: "Condiciones de garantía por escrito, asociadas a cada trabajo.", status: "hoy" },
  { title: "Ficha de propiedad", text: "Datos técnicos de cada inmueble reunidos en un solo lugar.", status: "desarrollo" },
  { title: "Historial de intervenciones", text: "Consulta en línea de todos los trabajos realizados en la propiedad.", status: "desarrollo" },
  { title: "Recomendaciones de mantención", text: "Avisos de revisiones preventivas según el estado de cada elemento.", status: "desarrollo" },
];

export const businessAudiences = [
  "Inmobiliarias",
  "Empresas con múltiples inmuebles",
  "Oficinas",
  "Centros comerciales",
  "Administradores de propiedades",
  "Empresas con instalaciones propias",
];

export const businessPoints = [
  { title: "Un solo proveedor técnico", text: "Centralizamos trabajos de distintas especialidades en todas tus propiedades del sector oriente." },
  { title: "Mantenciones programadas", text: "Planificamos revisiones periódicas para anticipar fallas y ordenar el presupuesto." },
  { title: "Registro por inmueble", text: "Cada trabajo queda documentado con fotografías, informe y garantía." },
];

export const homePoints = [
  { title: "Atención programada", text: "Coordinamos la visita en el horario que te acomode." },
  { title: "Cotizaciones claras", text: "Alcance, plazo y valor por escrito antes de empezar." },
  { title: "Especialistas", text: "Cada trabajo lo ejecuta quien conoce el oficio." },
  { title: "Coordinación", text: "Si tu casa necesita varias especialidades, las coordinamos nosotros." },
  { title: "Respaldo", text: "Fotografías, informe y garantía de lo realizado." },
];
