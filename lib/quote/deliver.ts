// Entrega de solicitudes de cotización a un sistema externo (CRM o webhook).
// Las fotografías se reenvían en memoria: nunca se escriben en /public ni en disco.
import type { QuoteFields } from "./schema";

export type DeliveryResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "not_configured" | "upstream_error" };

export function isDeliveryConfigured() {
  return Boolean(process.env.QUOTE_WEBHOOK_URL?.trim());
}

function makeReference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SOL-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function deliverQuote(fields: QuoteFields, photos: File[]): Promise<DeliveryResult> {
  const url = process.env.QUOTE_WEBHOOK_URL?.trim();
  if (!url) return { ok: false, reason: "not_configured" };

  const reference = makeReference();
  const body = new FormData();
  body.set("referencia", reference);
  body.set("recibido", new Date().toISOString());
  body.set("origen", "sitio-web");
  for (const [key, value] of Object.entries(fields)) body.set(key, String(value));
  photos.forEach((photo, i) => body.append("fotos", photo, photo.name || `foto-${i + 1}`));

  const headers: Record<string, string> = {};
  const token = process.env.QUOTE_WEBHOOK_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { method: "POST", body, headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { ok: false, reason: "upstream_error" };
    return { ok: true, reference };
  } catch {
    return { ok: false, reason: "upstream_error" };
  }
}
