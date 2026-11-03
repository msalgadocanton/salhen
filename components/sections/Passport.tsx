import { passportItems } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

function Bar({ w, tone = "bg-ink/12" }: { w: string; tone?: string }) {
  return <span aria-hidden="true" className={`block h-2.5 ${tone}`} style={{ width: w }} />;
}

function Field({ label, w }: { label: string; w: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="label text-[0.65rem] text-ink-2">{label}</span>
      <Bar w={w} />
    </div>
  );
}

function StatusChip({ status }: { status: "hoy" | "desarrollo" }) {
  return status === "hoy" ? (
    <span className="label inline-flex items-center gap-1.5 bg-ink px-2 py-1 text-[0.65rem] text-lime">
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-lime" />
      Hoy
    </span>
  ) : (
    <span className="label inline-flex items-center gap-1.5 border border-dashed border-ink/50 px-2 py-1 text-[0.65rem] text-ink-2">
      En desarrollo
    </span>
  );
}

// Representación conceptual del futuro sistema. No muestra datos reales ni simula una plataforma operativa.
function PassportMockup() {
  return (
    <figure className="relative">
      <div className="relative border border-ink bg-paper shadow-[10px_10px_0_0_var(--color-lime)]" aria-hidden="true">
        <div className="flex items-center justify-between gap-4 border-b border-ink bg-ink px-5 py-2.5 text-paper">
          <span className="font-display text-[1.15rem] font-semibold uppercase tracking-[0.12em]">Pasaporte técnico</span>
          <span className="label text-[0.65rem] text-lime">SALHEN</span>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">
          <div>
            <p className="label mb-4 flex items-center justify-between text-olive-ink">
              Ficha de propiedad <StatusChip status="desarrollo" />
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Field label="Tipo" w="70%" />
              <Field label="Comuna" w="55%" />
              <Field label="Elementos" w="40%" />
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <p className="label mb-3 flex items-center justify-between text-olive-ink">
              Historial de intervenciones <StatusChip status="desarrollo" />
            </p>
            <ul className="divide-y divide-line">
              {[
                { code: "S-02", w: "62%" },
                { code: "S-01", w: "48%" },
                { code: "S-05", w: "56%" },
              ].map((row) => (
                <li key={row.code} className="grid grid-cols-[3rem_minmax(0,1fr)_4.5rem] items-center gap-3 py-2.5">
                  <span className="label text-[0.7rem] text-olive-ink">{row.code}</span>
                  <Bar w={row.w} />
                  <span className="label justify-self-end text-[0.6rem] text-ink-2">Garantía</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-5">
            <p className="label mb-3 flex items-center justify-between text-olive-ink">
              Registro fotográfico <StatusChip status="hoy" />
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["Antes", "Después"].map((t) => (
                <div
                  key={t}
                  className="flex aspect-[16/9] max-w-full items-end border border-ink/30 p-2"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-ink) 9%, transparent) 0 1px, transparent 1px 9px)",
                  }}
                >
                  <span className="label bg-paper px-1.5 py-0.5 text-[0.62rem]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-[4.25rem] right-6 rotate-[-7deg] border-2 border-olive bg-paper/90 px-3 py-1.5 text-olive sm:right-10">
          <span className="font-display text-[1rem] font-bold uppercase tracking-[0.14em]">Concepto · en desarrollo</span>
        </div>
      </div>
      <figcaption className="label mt-6 text-ink-2">
        Representación conceptual. La plataforma digital está en desarrollo y no tiene acceso de clientes todavía.
      </figcaption>
    </figure>
  );
}

export function Passport() {
  const now = passportItems.filter((i) => i.status === "hoy");
  const next = passportItems.filter((i) => i.status === "desarrollo");

  return (
    <section id="pasaporte" aria-labelledby="pasaporte-titulo" className="bg-paper-2 py-20 lg:py-16">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <SectionHead
            index="06"
            eyebrow="Pasaporte técnico SALHEN"
            title={
              <span id="pasaporte-titulo">
                Cada trabajo cuenta. <span className="text-olive">Cada detalle queda registrado.</span>
              </span>
            }
          />
          <p className="prose-measure text-ink-2">
            Estamos construyendo un modelo de mantención documentada: que cada propiedad tenga su historial técnico, con lo que
            se hizo, cuándo, quién lo ejecutó y bajo qué garantía.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-4 flex items-center gap-3">
                <StatusChip status="hoy" />
                <span className="label text-ink">Se entrega en cada trabajo</span>
              </p>
              <ul className="flex flex-col gap-3">
                {now.map((i) => (
                  <li key={i.title} className="border-t-2 border-lime pt-2.5">
                    <h3 className="text-[1.15rem] font-semibold uppercase">{i.title}</h3>
                    <p className="mt-1 text-[0.9rem] text-ink-2">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 flex items-center gap-3">
                <StatusChip status="desarrollo" />
                <span className="label text-ink-2">Próximas etapas</span>
              </p>
              <ul className="flex flex-col gap-3">
                {next.map((i) => (
                  <li key={i.title} className="border-t-2 border-dashed border-ink/50 pt-2.5">
                    <h3 className="text-[1.15rem] font-semibold uppercase text-ink-2">{i.title}</h3>
                    <p className="mt-1 text-[0.9rem] text-ink-2">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Reveal className="col-span-4 lg:col-span-6 lg:self-center" y={40}>
          <PassportMockup />
        </Reveal>
      </div>
    </section>
  );
}
