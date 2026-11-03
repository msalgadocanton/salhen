import { businessAudiences, businessPoints, homePoints } from "@/data/content";
import { services } from "@/data/services";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const homeServiceCodes = ["S-01", "S-02", "S-05", "S-03", "S-04", "S-07", "S-06"];

export function Business() {
  return (
    <section id="empresas" aria-labelledby="empresas-titulo" className="py-20 lg:py-16">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <SectionHead
            index="04"
            eyebrow="Empresas e inmobiliarias"
            title={<span id="empresas-titulo">Centralización técnica para empresas con más de un inmueble</span>}
          />
          <p className="prose-measure text-ink-2">
            Un proveedor que coordina las mantenciones programadas y las reparaciones de todas tus propiedades del sector
            oriente de Santiago, con un registro por inmueble.
          </p>
          <div>
            <p className="label mb-3 text-ink-2">Para</p>
            <ul className="flex flex-wrap gap-2">
              {businessAudiences.map((a) => (
                <li key={a} className="border border-ink/25 px-3 py-1 text-[0.9rem]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="col-span-4 flex flex-col justify-between lg:col-span-6">
          <ul className="flex flex-1 flex-col border-t-2 border-ink">
            {businessPoints.map((p) => (
              <li
                key={p.title}
                className="grid flex-1 grid-cols-[1.25rem_minmax(0,1fr)] content-center gap-x-4 gap-y-1.5 border-b border-ink/20 py-5 sm:grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-x-6"
              >
                <span aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 bg-lime ring-1 ring-ink/40" />
                <h3 className="text-[1.35rem] font-semibold uppercase">{p.title}</h3>
                <p className="col-start-2 text-[0.95rem] text-ink-2 sm:col-start-3">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="label text-ink-2">Cobertura inicial: sector oriente de Santiago</p>
            <ButtonLink href="/?tipo=empresa#cotizar">Solicitar propuesta empresarial</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Homes() {
  const homeServices = homeServiceCodes
    .map((code) => services.find((s) => s.code === code))
    .filter((s) => s !== undefined);

  return (
    <section id="hogares" aria-labelledby="hogares-titulo" className="on-dark relative overflow-hidden bg-olive-ink py-20 text-paper lg:py-16">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <SectionHead
            dark
            index="05"
            eyebrow="Casas particulares"
            title={
              <span id="hogares-titulo">
                Tu casa merece
                <br />
                <span className="text-lime">mantención profesional.</span>
              </span>
            }
          />
          <p className="prose-measure text-paper/90">
            Desde una filtración en el techo hasta la pintura de la fachada. Te visitamos, te enviamos una cotización clara y
            coordinamos a los especialistas. Pagas solo por el trabajo que necesitas, sin suscripciones mensuales.
          </p>
          <p className="font-display text-[1.15rem] font-medium uppercase leading-snug tracking-wide text-lime">
            {homeServices.map((s) => s.short).join(" · ")}
          </p>
          <div>
            <ButtonLink href="/?tipo=hogar#cotizar" variant="lime">
              Cotizar un trabajo en mi hogar
            </ButtonLink>
          </div>
        </div>

        <ul className="col-span-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:col-span-6">
          {homePoints.map((p, i) => (
            <li key={p.title} className={`border-t-4 border-lime pt-4 ${i === homePoints.length - 1 && homePoints.length % 2 ? "sm:col-span-2" : ""}`}>
              <h3 className="text-[1.3rem] font-semibold uppercase">{p.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-paper/80">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
