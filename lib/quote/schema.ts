// Reglas de validación compartidas entre el formulario (cliente) y la API (servidor).
import { services } from "@/data/services";
import { siteConfig } from "@/lib/site";

export const clientTypes = [
  { value: "edificio", label: "Edificio / Condominio" },
  { value: "empresa", label: "Empresa / Inmobiliaria" },
  { value: "hogar", label: "Casa particular" },
] as const;

export const serviceOptions = [
  ...services.map((s) => ({ value: s.code, label: s.name })),
  { value: "varios", label: "Varias especialidades / no lo sé" },
];

export const comunaOptions = [...siteConfig.coverage, "Otra comuna"];

export const PHOTO_LIMITS = {
  maxFiles: 5,
  maxBytes: 8 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

export const MIN_FILL_MS = 3000;

export type QuoteFields = {
  nombre: string;
  organizacion: string;
  correo: string;
  telefono: string;
  tipoCliente: string;
  servicio: string;
  comuna: string;
  direccion: string;
  descripcion: string;
  fechaVisita: string;
  consentimiento: boolean;
};

export type FieldErrors = Partial<Record<keyof QuoteFields | "fotos", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function validateQuote(f: QuoteFields, photos: { size: number; type: string }[] = []): FieldErrors {
  const e: FieldErrors = {};
  if (f.nombre.trim().length < 2) e.nombre = "Escribe tu nombre.";
  if (!EMAIL_RE.test(f.correo.trim())) e.correo = "Escribe un correo válido, por ejemplo nombre@dominio.cl.";
  const digits = normalizePhone(f.telefono).replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 12) e.telefono = "Escribe un teléfono de 8 a 12 dígitos, por ejemplo +56 9 1234 5678.";
  if (!clientTypes.some((c) => c.value === f.tipoCliente)) e.tipoCliente = "Elige el tipo de propiedad.";
  if (!serviceOptions.some((s) => s.value === f.servicio)) e.servicio = "Elige el tipo de servicio.";
  if (!comunaOptions.includes(f.comuna)) e.comuna = "Elige la comuna.";
  if (f.descripcion.trim().length < 20) e.descripcion = "Describe el requerimiento en al menos 20 caracteres.";
  if (f.descripcion.length > 3000) e.descripcion = "La descripción admite hasta 3.000 caracteres.";
  if (f.fechaVisita) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${f.fechaVisita}T00:00:00`);
    if (Number.isNaN(chosen.getTime()) || chosen < today) e.fechaVisita = "Elige una fecha a partir de hoy.";
  } else {
    e.fechaVisita = "Elige una fecha preferida para la visita.";
  }
  if (!f.consentimiento) e.consentimiento = "Necesitamos tu autorización para usar estos datos y responder la solicitud.";

  if (photos.length > PHOTO_LIMITS.maxFiles) {
    e.fotos = `Puedes adjuntar hasta ${PHOTO_LIMITS.maxFiles} fotografías.`;
  } else if (photos.some((p) => p.size > PHOTO_LIMITS.maxBytes)) {
    e.fotos = "Cada fotografía puede pesar hasta 8 MB.";
  } else if (photos.some((p) => p.type && !PHOTO_LIMITS.types.includes(p.type))) {
    e.fotos = "Adjunta fotografías en formato JPG, PNG, WEBP o HEIC.";
  }
  return e;
}
