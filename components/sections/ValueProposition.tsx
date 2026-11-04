import { pillars } from "@/data/content";
import { services } from "@/data/services";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Logo } from "@/components/layout/Logo";

export function ValueProposition() {
  return (
    <section aria-labelledby="propuesta" className="py-20 lg:py-16">
      <div className="shell grid-12 gap-y-12 lg:gap-y-10">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <SectionHead
            index="01"
            eyebrow="Mantención con respaldo"
            title={
              <span id="propuesta">
                Un solo contacto.
                <br />
                <span className="text-olive">Múltiples soluciones.</span>
              </span>
            }
          />
          <p className="prose-measure text-ink-2">
            Mantener una propiedad exige electricistas, gasfíteres, soldadores, pintores y especialistas en altura. SALHEN
            reúne esa red bajo una sola coordinación: recibimos el requerimiento, asignamos a quien corresponde, supervisamos
            el trabajo y lo dejamos documentado.
          </p>
        </div>

        {/* Diagrama: un punto de contacto que se ramifica en las especialidades */}
        <Reveal className="col-span-4 lg:col-span-6">
          <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <div className="relative pr-4 sm:pr-6">
              <div className="border-b-4 border-lime bg-ink px-3 py-4 text-paper sm:px-4 sm:py-5">
                <p className="label text-[0.65rem] text-lime sm:text-xs">Tú hablas con</p>
                <Logo variant="verticalBlanco" className="mt-3 h-12 max-w-full sm:h-[4.5rem]" />
              </div>
              <span aria-hidden="true" className="absolute right-0 top-1/2 h-px w-4 bg-ink sm:w-6" />
            </div>
            <ul className="relative min-w-0 border-l border-ink py-1" aria-label="Especialidades coordinadas">
              {services.map((s) => (
                <li key={s.code} className="relative flex items-baseline gap-2 py-1.5 pl-5 sm:gap-3 sm:pl-6">
                  <span aria-hidden="true" className="absolute left-0 top-1/2 h-px w-3 bg-ink/40 sm:w-4" />
                  <span className="label w-9 shrink-0 text-olive-ink sm:w-10">{s.code}</span>
                  <span className="min-w-0 hyphens-auto break-words font-display text-[1.05rem] font-medium uppercase leading-tight tracking-wide sm:text-[1.2rem]">
                    {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <ul className="col-span-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          {pillars.map((p) => (
            <li key={p.title} className="flex flex-col gap-2 border-t-4 border-lime pt-4">
              <h3 className="text-[1.3rem] font-semibold uppercase">{p.title}</h3>
              <p className="text-[0.95rem] text-ink-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
