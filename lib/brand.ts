// Archivos oficiales del logotipo (entregados por el cliente el 03-11-2026), con el fondo blanco
// quitado y recortados al contenido sin alterar proporciones ni colores. Ver public/brand/LEEME.md.
export const logos = {
  // Cabecera y menú móvil (fondos claros)
  horizontal: { src: "/brand/salhen-logo-horizontal-v2.png", width: 1355, height: 300 },
  // Fondos oscuros, formato horizontal
  horizontalBlanco: { src: "/brand/salhen-logo-horizontal-blanco-v2.png", width: 1355, height: 300 },
  // Logo de la empresa en datos estructurados y piezas verticales sobre fondo claro
  vertical: { src: "/brand/salhen-logo-vertical-v2.png", width: 1042, height: 700 },
  // Footer (fondo grafito)
  verticalBlanco: { src: "/brand/salhen-logo-vertical-blanco-v2.png", width: 1042, height: 700 },
  // Isotipo: base del favicon e íconos; usos donde el nombre ya está presente
  isotipo: { src: "/brand/salhen-isotipo-v2.png", width: 496, height: 600 },
  isotipoBlanco: { src: "/brand/salhen-isotipo-blanco-v2.png", width: 496, height: 600 },
} as const;

export type LogoVariant = keyof typeof logos;
