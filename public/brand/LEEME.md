# Logotipo oficial SALHEN

Versión entregada por el cliente el 03-11-2026. Los originales (con fondo blanco) están en
`brand-source/nuevo-2026-11-03/`; la versión anterior del logo y de los íconos quedó respaldada en
`brand-source/anterior-2026-11-03/`.

Los PNG de esta carpeta se generaron desde esos originales: fondo blanco quitado (transparente),
recortados al contenido con 4 px de margen, sin cambiar proporciones ni colores. Las versiones
"blanco" cambian el verde oscuro por blanco y mantienen el verde lima, para fondos oscuros.

| Archivo                             | Tamaño    | Uso en el sitio                                   |
|-------------------------------------|-----------|---------------------------------------------------|
| `salhen-logo-horizontal-v2.png`        | 1355×300  | Cabecera y menú móvil (fondos claros)             |
| `salhen-logo-horizontal-blanco-v2.png` | 1355×300  | Reservado: fondos oscuros en formato horizontal   |
| `salhen-logo-vertical-v2.png`          | 1042×700  | Datos estructurados (logo de la empresa)          |
| `salhen-logo-vertical-blanco-v2.png`   | 1042×700  | Footer (fondo grafito)                            |
| `salhen-isotipo-v2.png`                | 496×600   | Base de `app/icon.png` y `app/apple-icon.png`     |
| `salhen-isotipo-blanco-v2.png`         | 496×600   | Reservado: isotipo sobre fondos oscuros           |

`app/icon.png` (512×512, transparente) y `app/apple-icon.png` (180×180, fondo blanco) llevan el
isotipo centrado. `app/opengraph-image.png` (1200×630, imagen al compartir el enlace) es el logo
vertical centrado sobre blanco.

Las dimensiones están declaradas en `lib/brand.ts`. Si se reemplaza un archivo, actualízalas ahí.
Lo ideal a futuro es una exportación SVG desde el archivo de diseño original.
