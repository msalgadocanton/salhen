import { exclusions, services } from "@/data/services";
import { SectionHead } from "@/components/ui/SectionHead";

// Índice técnico de servicios. <details> mantiene la apertura accesible por teclado sin JS.
export function ServicesIndex() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="bg-paper-2 py-20 lg:py-16">
      <div className="shell">
        <div className="grid-12 mb-10 gap-y-6">
          <SectionHead
            index="02"
            eyebrow="Servicios"
            className="col-span-4 lg:col-span-6"
            title={<span id="servicios-titulo">Ocho especialidades, una misma coordinación</span>}
          />
          <p className="col-span-4 max-w-md self-end text-ink-2 lg:col-span-6 lg:justify-self-end">
            Cada servicio se cotiza por separado o como parte de un plan de mantención. Abre cada especialidad para ver el
            alcance.
          </p>
        </div>

        <ol className="border-t-2 border-ink">
          {services.map((s) => (
            <li key={s.code} className="border-b border-ink/20">
              <details className="group">
                <summary className="relative grid cursor-pointer list-none grid-cols-[3.5rem_minmax(0,1fr)_2rem] items-center gap-x-4 py-3 transition-colors duration-300 before:absolute before:inset-y-0 before:-left-4 before:-right-4 before:-z-0 before:origin-bottom before:scale-y-0 before:bg-paper before:transition-transform before:duration-500 before:ease-[var(--ease-out-quart)] hover:before:scale-y-100 group-open:before:scale-y-100 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_2rem] lg:gap-x-6 [&::-webkit-details-marker]:hidden">
                  <span className="label relative text-olive-ink">{s.code}</span>
                  <h3 className="relative text-[clamp(1.25rem,2vw,1.6rem)] font-semibold uppercase leading-none transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:translate-x-2">
                    {s.name}
                  </h3>
                  <p className="relative col-start-2 mt-2 hidden text-[0.95rem] text-ink-2 sm:block lg:col-start-3 lg:row-start-1 lg:mt-0">
                    {s.summary}
                  </p>
                  <span
                    aria-hidden="true"
                    className="relative col-start-3 row-start-1 flex h-8 w-8 items-center justify-center justify-self-end border border-ink/30 transition-[transform,background-color,border-color] duration-300 group-hover:border-ink group-hover:bg-lime group-open:rotate-45 group-open:border-ink group-open:bg-lime lg:col-start-4"
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 0v12M0 6h12" />
                    </svg>
                  </span>
                </summary>
                <div className="grid grid-cols-1 gap-6 bg-paper px-0 pb-8 pt-2 sm:-mx-4 sm:px-4 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_2rem] lg:gap-x-6">
                  <p className="text-ink-2 sm:hidden">{s.summary}</p>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-1.5 text-[0.95rem] sm:grid-cols-2 lg:col-span-2 lg:col-start-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex gap-3 text-ink">
                        <span aria-hidden="true" className="mt-[0.55em] h-2 w-2 shrink-0 bg-lime ring-1 ring-ink/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.note && (
                    <p className="label self-start border-l-4 border-lime pl-4 normal-case tracking-normal text-ink-2 lg:col-start-3 lg:row-start-2 lg:mt-2 lg:text-[0.8rem]">
                      {s.note}
                    </p>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
          <p className="label shrink-0 text-ink">Fuera de nuestro alcance</p>
          <p className="text-[0.95rem] text-ink-2 lg:text-right">{exclusions.join(" · ")}.</p>
        </div>
      </div>
    </section>
  );
}
