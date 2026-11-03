"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  PHOTO_LIMITS,
  clientTypes,
  comunaOptions,
  serviceOptions,
  validateQuote,
  type FieldErrors,
  type QuoteFields,
} from "@/lib/quote/schema";
import { whatsappHref } from "@/lib/site";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "not_configured" | "failed";

const initial: QuoteFields = {
  nombre: "",
  organizacion: "",
  correo: "",
  telefono: "",
  tipoCliente: "",
  servicio: "",
  comuna: "",
  direccion: "",
  descripcion: "",
  fechaVisita: "",
  consentimiento: false,
};

const fieldOrder: (keyof FieldErrors)[] = [
  "nombre", "correo", "telefono", "tipoCliente", "servicio", "comuna", "descripcion", "fechaVisita", "fotos", "consentimiento",
];

const fieldLabels: Record<keyof FieldErrors, string> = {
  nombre: "Nombre", organizacion: "Empresa o comunidad", correo: "Correo", telefono: "Teléfono", tipoCliente: "Tipo de propiedad",
  servicio: "Tipo de servicio", comuna: "Comuna", direccion: "Dirección", descripcion: "Descripción", fechaVisita: "Fecha preferida",
  fotos: "Fotografías", consentimiento: "Autorización de datos",
};

const inputBase =
  "block min-h-12 w-full border bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-2/60 transition-colors focus:border-olive focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-olive";

function inputClass(error?: string) {
  return `${inputBase} ${error ? "border-danger" : "border-ink/30 hover:border-ink/60"}`;
}

function FieldShell({ id, label, optional, error, hint, children }: { id: string; label: string; optional?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="label flex items-baseline justify-between gap-3 text-ink">
        {label}
        {optional && <span className="normal-case tracking-normal text-ink-2">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.85rem] text-ink-2">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 text-[0.9rem] text-danger">
          <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-danger" />
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

function formatBytes(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

// Lee ?tipo=edificio|empresa|hogar de los CTA de cada segmento.
function ClientTypeFromUrl({ onType }: { onType: (t: string) => void }) {
  const params = useSearchParams();
  const tipo = params.get("tipo");
  useEffect(() => {
    if (tipo && clientTypes.some((c) => c.value === tipo)) onType(tipo);
  }, [tipo, onType]);
  return null;
}

export function QuoteForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [values, setValues] = useState<QuoteFields>(initial);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const startedAt = useRef<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const d = new Date();
    setMinDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  const applyClientType = useCallback((t: string) => setValues((v) => ({ ...v, tipoCliente: t })), []);

  const set = <K extends keyof QuoteFields>(key: K, value: QuoteFields[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onText = (key: keyof QuoteFields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    set(key, e.target.value as never);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...photos, ...Array.from(list)].slice(0, PHOTO_LIMITS.maxFiles + 1);
    setPhotos(next);
    const fotoError = validateQuote({ ...values, consentimiento: true }, next).fotos;
    setErrors((e) => ({ ...e, fotos: fotoError }));
  };

  const removePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    setErrors((e) => ({ ...e, fotos: validateQuote({ ...values, consentimiento: true }, next).fotos }));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateQuote(values, photos);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    const body = new FormData();
    for (const [key, value] of Object.entries(values)) {
      body.set(key, key === "consentimiento" ? (value ? "si" : "no") : String(value));
    }
    photos.forEach((p) => body.append("fotos", p, p.name));
    body.set("_t", String(startedAt.current));
    body.set("sitio_web", (formRef.current?.elements.namedItem("sitio_web") as HTMLInputElement | null)?.value ?? "");

    try {
      const res = await fetch("/api/cotizacion", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; error?: string; fields?: FieldErrors };
      if (res.ok && data.ok) {
        setReference(data.reference ?? null);
        setStatus("success");
      } else if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      } else if (data.error === "not_configured") {
        setStatus("not_configured");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const errorList = fieldOrder.filter((k) => errors[k]);
  const wa = whatsappHref("Hola SALHEN, quiero solicitar una cotización.");

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col gap-6 border border-ink bg-paper p-8 focus:outline-none sm:p-10">
        <p className="label text-olive-ink">Solicitud recibida</p>
        <h3 className="text-[2.4rem] font-semibold uppercase">Gracias, {values.nombre.split(" ")[0]}.</h3>
        <p className="text-ink-2">
          Recibimos tu solicitud y te contactaremos para coordinar la evaluación.
          {reference && (
            <>
              {" "}Número de referencia: <strong className="font-mono text-ink">{reference}</strong>.
            </>
          )}
        </p>
        <div>
          <Button
            variant="ghost"
            onClick={() => {
              setValues(initial);
              setPhotos([]);
              setReference(null);
              setStatus("idle");
              startedAt.current = Date.now();
            }}
          >
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-8" aria-describedby={`${uid}-required`}>
      <Suspense fallback={null}>
        <ClientTypeFromUrl onType={applyClientType} />
      </Suspense>

      <p id={`${uid}-required`} className="text-[0.9rem] text-ink-2">
        Todos los campos son obligatorios salvo los marcados como opcionales.
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-l-4 border-danger bg-danger-soft p-5 focus:outline-none">
          <p className="font-semibold text-ink">Revisa {errorList.length === 1 ? "este campo" : `estos ${errorList.length} campos`}:</p>
          <ul className="mt-2 flex flex-col gap-1">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="text-danger underline underline-offset-2">
                  {fieldLabels[k]}: {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="flex flex-col gap-3">
        <legend id={id("tipoCliente")} tabIndex={-1} className="label mb-3 text-ink">Tipo de propiedad</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {clientTypes.map((c) => (
            <label key={c.value} className="group relative flex min-h-14 cursor-pointer items-center gap-3 border border-ink/30 bg-paper px-4 py-3 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-olive">
              <input
                type="radio"
                name="tipoCliente"
                value={c.value}
                checked={values.tipoCliente === c.value}
                onChange={() => set("tipoCliente", c.value)}
                className="peer sr-only"
                aria-describedby={errors.tipoCliente ? `${id("tipoCliente")}-error` : undefined}
              />
              <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center border border-current">
                <span className="h-2 w-2 bg-lime opacity-0 transition-opacity peer-checked:opacity-100 group-has-[:checked]:opacity-100" />
              </span>
              <span className="font-display text-[1.1rem] font-medium uppercase leading-tight tracking-wide">{c.label}</span>
            </label>
          ))}
        </div>
        {errors.tipoCliente && (
          <p id={`${id("tipoCliente")}-error`} className="flex items-start gap-2 text-[0.9rem] text-danger">
            <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-danger" />
            {errors.tipoCliente}
          </p>
        )}
      </fieldset>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldShell id={id("nombre")} label="Nombre" error={errors.nombre}>
          <input id={id("nombre")} name="nombre" autoComplete="name" value={values.nombre} onChange={onText("nombre")}
            className={inputClass(errors.nombre)} aria-invalid={!!errors.nombre} aria-describedby={describedBy(id("nombre"), errors.nombre)} />
        </FieldShell>
        <FieldShell id={id("organizacion")} label="Empresa o comunidad" optional>
          <input id={id("organizacion")} name="organizacion" autoComplete="organization" value={values.organizacion} onChange={onText("organizacion")}
            className={inputClass()} />
        </FieldShell>
        <FieldShell id={id("correo")} label="Correo" error={errors.correo}>
          <input id={id("correo")} name="correo" type="email" inputMode="email" autoComplete="email" value={values.correo} onChange={onText("correo")}
            className={inputClass(errors.correo)} aria-invalid={!!errors.correo} aria-describedby={describedBy(id("correo"), errors.correo)} />
        </FieldShell>
        <FieldShell id={id("telefono")} label="Teléfono" error={errors.telefono} hint="Ejemplo: +56 9 1234 5678">
          <input id={id("telefono")} name="telefono" type="tel" inputMode="tel" autoComplete="tel" value={values.telefono} onChange={onText("telefono")}
            className={inputClass(errors.telefono)} aria-invalid={!!errors.telefono} aria-describedby={describedBy(id("telefono"), errors.telefono, "x")} />
        </FieldShell>
        <FieldShell id={id("servicio")} label="Tipo de servicio" error={errors.servicio}>
          <select id={id("servicio")} name="servicio" value={values.servicio} onChange={onText("servicio")}
            className={`${inputClass(errors.servicio)} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%231a1c18' stroke-width='1.5'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")" }}
            aria-invalid={!!errors.servicio} aria-describedby={describedBy(id("servicio"), errors.servicio)}>
            <option value="" disabled>Elige una especialidad</option>
            {serviceOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell id={id("comuna")} label="Comuna" error={errors.comuna}>
          <select id={id("comuna")} name="comuna" value={values.comuna} onChange={onText("comuna")}
            className={`${inputClass(errors.comuna)} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%231a1c18' stroke-width='1.5'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")" }}
            aria-invalid={!!errors.comuna} aria-describedby={describedBy(id("comuna"), errors.comuna)}>
            <option value="" disabled>Elige la comuna</option>
            {comunaOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FieldShell>
        <FieldShell id={id("direccion")} label="Dirección aproximada" optional hint="Calle y número o un punto de referencia.">
          <input id={id("direccion")} name="direccion" autoComplete="street-address" value={values.direccion} onChange={onText("direccion")}
            className={inputClass()} aria-describedby={`${id("direccion")}-hint`} />
        </FieldShell>
        <FieldShell id={id("fechaVisita")} label="Fecha preferida de visita" error={errors.fechaVisita} hint="Te confirmaremos la fecha según disponibilidad.">
          <input id={id("fechaVisita")} name="fechaVisita" type="date" min={minDate || undefined} value={values.fechaVisita} onChange={onText("fechaVisita")}
            className={inputClass(errors.fechaVisita)} aria-invalid={!!errors.fechaVisita} aria-describedby={describedBy(id("fechaVisita"), errors.fechaVisita, "x")} />
        </FieldShell>
      </div>

      <FieldShell id={id("descripcion")} label="Descripción del requerimiento" error={errors.descripcion}
        hint="Qué ocurre, dónde y desde cuándo. Mientras más detalle, más precisa la evaluación.">
        <textarea id={id("descripcion")} name="descripcion" rows={5} maxLength={3000} value={values.descripcion} onChange={onText("descripcion")}
          className={`${inputClass(errors.descripcion)} resize-y`} aria-invalid={!!errors.descripcion}
          aria-describedby={describedBy(id("descripcion"), errors.descripcion, "x")} />
      </FieldShell>

      <div className="flex flex-col gap-3">
        <p className="label flex items-baseline justify-between gap-3 text-ink">
          Fotografías <span className="normal-case tracking-normal text-ink-2">Opcional</span>
        </p>
        <input id={id("fotos")} type="file" accept={PHOTO_LIMITS.types.join(",")} multiple className="peer sr-only"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          aria-describedby={errors.fotos ? `${id("fotos")}-error` : `${id("fotos")}-hint`} />
        <label htmlFor={id("fotos")}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive ${
            dragging ? "border-olive bg-lime/15" : errors.fotos ? "border-danger" : "border-ink/40 hover:border-ink hover:bg-paper"
          }`}>
          <span className="font-display text-[1.2rem] font-semibold uppercase tracking-wide">Adjuntar fotografías</span>
          <span id={`${id("fotos")}-hint`} className="text-[0.85rem] text-ink-2">
            Hasta {PHOTO_LIMITS.maxFiles} imágenes JPG, PNG, WEBP o HEIC de máximo 8 MB. Arrastra aquí o toca para elegir.
          </span>
        </label>
        {errors.fotos && (
          <p id={`${id("fotos")}-error`} className="flex items-start gap-2 text-[0.9rem] text-danger">
            <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-danger" />
            {errors.fotos}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="flex flex-col divide-y divide-line border-y border-line" aria-label="Fotografías seleccionadas">
            {photos.map((p, i) => (
              <li key={`${p.name}-${i}`} className="flex items-center justify-between gap-4 py-2">
                <span className="min-w-0 truncate text-[0.95rem]">{p.name}</span>
                <span className="flex shrink-0 items-center gap-4">
                  <span className="label text-ink-2">{formatBytes(p.size)}</span>
                  <button type="button" onClick={() => removePhoto(i)} className="label min-h-10 px-2 text-danger underline underline-offset-2">
                    Quitar<span className="sr-only"> {p.name}</span>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Campo trampa para bots: oculto para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("sitio_web")}>No completar</label>
        <input id={id("sitio_web")} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input id={id("consentimiento")} type="checkbox" checked={values.consentimiento} onChange={(e) => set("consentimiento", e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-olive" aria-invalid={!!errors.consentimiento}
            aria-describedby={errors.consentimiento ? `${id("consentimiento")}-error` : undefined} />
          <span className="text-[0.95rem] text-ink-2">
            Autorizo a SALHEN a usar estos datos y fotografías solo para evaluar y responder esta solicitud, conforme a la Ley N.º 19.628
            sobre protección de la vida privada. Las fotografías no se publican.
          </span>
        </label>
        {errors.consentimiento && (
          <p id={`${id("consentimiento")}-error`} className="flex items-start gap-2 pl-8 text-[0.9rem] text-danger">
            {errors.consentimiento}
          </p>
        )}
      </div>

      <AnimatePresence>
        {(status === "not_configured" || status === "failed") && (
          <motion.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-l-4 border-danger bg-danger-soft p-5 focus:outline-none"
          >
            {status === "not_configured" ? (
              <>
                <p className="font-semibold text-ink">La solicitud no se envió.</p>
                <p className="mt-1 text-ink-2">
                  El envío en línea todavía no está habilitado en este sitio.
                  {wa ? " Puedes escribirnos por WhatsApp mientras tanto." : " Tus datos siguen en el formulario."}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-ink">No pudimos enviar la solicitud.</p>
                <p className="mt-1 text-ink-2">Revisa tu conexión e inténtalo de nuevo. Tus datos siguen en el formulario.</p>
              </>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-olive-ink underline underline-offset-2">
                Escribir por WhatsApp
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" variant="lime" disabled={status === "submitting"} arrow={status !== "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin border-2 border-ink/30 border-t-ink" style={{ borderRadius: "50%" }} />
              Enviando solicitud
            </>
          ) : (
            "Enviar solicitud de cotización"
          )}
        </Button>
        <p className="text-[0.85rem] text-ink-2" aria-live="polite">
          {status === "submitting" ? "Enviando, no cierres esta página." : ""}
        </p>
      </div>
    </form>
  );
}
