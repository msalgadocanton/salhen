// Archivos oficiales del logotipo (GRÁFICA SALHEN › 0.1-LOGO), recortados al contenido sin
// alterar proporciones ni colores. Ver public/brand/LEEME.md.
export const logos = {
  // Cabecera y fondos claros
  horizontal: { src: "/brand/salhen-logo-horizontal.png", width: 921, height: 263 },
  // Imagen para compartir y piezas verticales sobre fondo claro
  vertical: { src: "/brand/salhen-logo-vertical.png", width: 577, height: 747 },
  // Fondos oscuros (footer)
  verticalBlanco: { src: "/brand/salhen-logo-vertical-blanco.png", width: 577, height: 747 },
  // Usos monocromos
  verticalNegro: { src: "/brand/salhen-logo-vertical-negro.png", width: 577, height: 747 },
  // Favicon e íconos
  isotipo: { src: "/brand/salhen-isotipo.png", width: 636, height: 519 },
} as const;

export type LogoVariant = keyof typeof logos;
