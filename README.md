# SALHEN · Sitio corporativo

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Motion 12.

## Desarrollo

Node está instalado en `C:\Users\msalg\AppData\Local\Programs\node-v24.22.1-win-x64`, fuera del PATH.
En PowerShell:

```powershell
$env:Path = "C:\Users\msalg\AppData\Local\Programs\node-v24.22.1-win-x64;$env:Path"
npm install
copy .env.example .env.local   # y completar valores
npm run dev                     # http://localhost:3000
npm run build                   # compilación de producción
```

## Estructura

```
app/                    Rutas, metadata, sitemap, robots y API (/api/cotizacion)
components/layout/      Header, menú móvil, Footer, Logo, botón WhatsApp
components/sections/    Secciones de la página de inicio
components/forms/       Formulario de cotización
components/ui/          Botones, cabeceras de sección, Reveal
components/motion/      Configuración de animaciones (respeta prefers-reduced-motion)
data/                   Contenido: servicios, textos, proyectos
lib/                    Configuración del sitio, SEO, logo, validación y entrega de cotizaciones
styles/globals.css      Design system: colores, tipografía, retícula
public/brand/           Logotipo oficial (ver LEEME.md)
```

El contenido vive en `data/` y no dentro de los componentes. Para editar textos o servicios,
modifica esos archivos.

## Estado de esta versión

| Elemento                          | Estado |
|-----------------------------------|--------|
| Página de inicio completa         | Lista |
| Formulario de cotización          | Listo en interfaz, validación y API. **Falta configurar el destino** (`QUOTE_WEBHOOK_URL`) |
| Logotipo oficial                  | **Falta copiar los archivos** a `public/brand/` |
| Datos de contacto y WhatsApp      | **Faltan**: definir en `.env.local`. Si faltan, no se muestran |
| Proyectos realizados              | Estructura lista (`data/projects.ts`). Sin proyectos hasta tener material real |
| Páginas internas (servicios, segmentos, nosotros, contacto) | Pendiente, fase E. Los slugs ya están en `data/services.ts` |
| Política de privacidad            | Pendiente. El formulario cita la Ley 19.628. Revisar también la Ley 21.719 |
| Portal / Pasaporte técnico        | Fuera de alcance. Solo hay una representación conceptual, marcada como tal |

## Formulario de cotización

`POST /api/cotizacion` (multipart/form-data):

1. Antispam: campo trampa oculto y tiempo mínimo de llenado de 3 s.
2. Valida con las mismas reglas que el navegador (`lib/quote/schema.ts`).
3. Reenvía datos y fotografías a `QUOTE_WEBHOOK_URL` (`lib/quote/deliver.ts`). Las fotos no se
   guardan en el servidor ni en `/public`.
4. Sin `QUOTE_WEBHOOK_URL` responde `503 not_configured` y el formulario muestra
   "La solicitud no se envió". Nunca simula un envío exitoso.

Para conectar un CRM, apunta `QUOTE_WEBHOOK_URL` a su webhook de entrada o a un flujo de Make,
n8n o Zapier que cree el lead y guarde las fotos en un almacenamiento privado. También se puede
reemplazar `deliverQuote()` por una integración directa.

Mejoras recomendadas antes de producción: Cloudflare Turnstile como segunda capa antispam y un
límite de solicitudes por IP en el proxy o hosting.

## Tipografía y color

- Colores oficiales del manual corporativo: `#93ac25`, `#ccd625`, `#687c19`, `#5f5f5f`, `#8c8987`.
- La tipografía del manual es Agency FB, que no tiene licencia web libre. Se usa **Saira Condensed**
  como equivalente, junto con IBM Plex Sans y Plex Mono. Si SALHEN tiene licencia web de Agency FB,
  se puede reemplazar en `app/layout.tsx`.

Ver `docs/DESPLIEGUE.md` para el hosting.
