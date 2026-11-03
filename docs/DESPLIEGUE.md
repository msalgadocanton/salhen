# Despliegue

## Qué necesita el sitio

- La página de inicio, `sitemap.xml` y `robots.txt` se generan como **estáticos**.
- `/api/cotizacion` es una función de servidor (Node.js). Recibe archivos y llama al webhook con un secreto.

Por eso una **exportación estática pura** (`output: "export"`) no alcanza: el formulario quedaría
sin backend. No asumas que un hosting compartido tradicional (cPanel con PHP) ejecuta Next.js.

## Opciones

| Opción | Ventajas | A considerar |
|--------|----------|--------------|
| **Vercel** (recomendada para empezar) | Soporte nativo de Next.js, CDN, HTTPS, despliegue desde Git | Límite de tamaño de cuerpo en funciones (~4,5 MB en planes estándar): bajar el máximo de fotos o subirlas directo a un almacenamiento |
| Netlify / Cloudflare (con adaptador OpenNext) | CDN global | Requiere adaptador y pruebas propias |
| Hosting Node.js o VPS (`npm run build` + `npm start` detrás de Nginx) | Control total, sin límite estricto de cuerpo | Mantener Node, PM2/systemd, certificados y actualizaciones |
| Estático + servicio de formularios externo | Funciona en cualquier hosting | Hay que reescribir el envío hacia ese servicio. Se pierde la validación en servidor propia |

## Pasos (Vercel o Node)

1. Definir variables de entorno: `NEXT_PUBLIC_SITE_URL`, `QUOTE_WEBHOOK_URL`, `QUOTE_WEBHOOK_TOKEN`
   y los datos de contacto públicos.
2. `npm run build` debe terminar sin errores.
3. Verificar `/robots.txt` y `/sitemap.xml` con el dominio final.
4. Enviar una solicitud de prueba y confirmar que llega al CRM o webhook.
5. Registrar el sitio en Google Search Console y enviar el sitemap.

No publicar sin autorización de SALHEN.
