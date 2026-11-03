import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroDrawing } from "./HeroDrawing";
import { heroMarkers } from "./heroMarkers";
import { HeroTitle } from "./HeroTitle";

// Dos columnas simétricas en escritorio: el texto define la altura y el croquis la ocupa
// completa, de modo que el titular arranca a la altura de la cubierta y los botones cierran
// a la altura del terreno.
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="blueprint relative overflow-hidden pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] lg:pt-36">
      <div className="shell">
        <div className="label mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4 text-ink-2 lg:mb-14">
          <p>Mantención · Reparación · Soluciones constructivas</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 bg-lime ring-1 ring-ink/40" />
            Santiago · Sector oriente
          </p>
        </div>

        <div className="grid-12 gap-y-12">
          <div className="col-span-4 flex flex-col justify-between gap-10 lg:col-span-6">
            <HeroTitle />
            <Reveal delay={0.5} className="flex flex-col gap-7">
              <p className="max-w-[32rem] text-[1.3rem] leading-snug text-ink lg:text-[1.4rem]">
                Soluciones integrales en mantención, reparación y trabajos especializados para edificios, empresas y hogares.
              </p>
              <p className="prose-measure border-l-4 border-lime pl-5 text-ink-2">
                Coordinamos especialistas, supervisamos cada intervención y entregamos respaldo en cada proyecto.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/#cotizar" variant="lime">
                  Solicitar cotización
                </ButtonLink>
                <ButtonLink href="/#servicios" variant="ghost">
                  Explorar servicios
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="relative col-span-4 lg:col-span-6">
            <HeroDrawing />
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:hidden">
              {heroMarkers.map((m) => (
                <li key={m.code} className="label flex gap-3 text-ink-2">
                  <span className="text-olive-ink">{m.code}</span>
                  {m.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="label mt-6 text-right text-stone">Ilustración técnica de referencia</p>
      </div>

      <div className="mt-10 border-t-4 border-lime bg-paper/70">
        <div className="shell flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:gap-12">
          <p className="label shrink-0 text-olive-ink">Cobertura inicial</p>
          <ul className="grid flex-1 grid-cols-3 gap-x-4 gap-y-1 font-display text-[1.15rem] font-medium uppercase tracking-wide text-ink sm:flex sm:justify-between">
            {siteConfig.coverage.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
