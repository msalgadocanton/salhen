import { NextResponse } from "next/server";
import { MIN_FILL_MS, validateQuote, type QuoteFields } from "@/lib/quote/schema";
import { deliverQuote, isDeliveryConfigured } from "@/lib/quote/deliver";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 45 * 1024 * 1024;

function text(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Antispam: campo trampa oculto y tiempo mínimo de llenado.
  const startedAt = Number(text(form, "_t"));
  if (text(form, "sitio_web") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ error: "rejected" }, { status: 400 });
  }

  const fields: QuoteFields = {
    nombre: text(form, "nombre"),
    organizacion: text(form, "organizacion"),
    correo: text(form, "correo"),
    telefono: text(form, "telefono"),
    tipoCliente: text(form, "tipoCliente"),
    servicio: text(form, "servicio"),
    comuna: text(form, "comuna"),
    direccion: text(form, "direccion"),
    descripcion: text(form, "descripcion"),
    fechaVisita: text(form, "fechaVisita"),
    consentimiento: text(form, "consentimiento") === "si",
  };
  const photos = form.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  const errors = validateQuote(fields, photos);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "validation", fields: errors }, { status: 422 });
  }

  if (!isDeliveryConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const result = await deliverQuote(fields, photos);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: result.reason === "not_configured" ? 503 : 502 });
  }
  return NextResponse.json({ ok: true, reference: result.reference });
}
