import { QuoteForm } from "@/components/forms/QuoteForm";
import { SectionHead } from "@/components/ui/SectionHead";
import { siteConfig, whatsappHref } from "@/lib/site";

export function QuoteSection() {
  const wa = whatsappHref("Hola SALHEN, quiero solicitar una evaluación.");
  return (
    <section id="cotizar" aria-labelledby="cotizar-titulo" className="py-20 lg:py-16">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <div className="lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-7">
            <SectionHead
              index="09"
              eyebrow="Cotización"
              title={<span id="cotizar-titulo">Cuéntanos qué necesita tu propiedad</span>}
            />
            <div className="mt-8 flex flex-col gap-6 lg:mt-0">
              <p className="text-ink-2">
                Revisamos cada solicitud y, cuando corresponde, coordinamos una visita técnica antes de cotizar.
              </p>
              <dl className="divide-y divide-line border-y border-line">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="label text-ink-2">Cobertura</dt>
                  <dd className="text-right text-[0.95rem]">Sector oriente de {siteConfig.city}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="label text-ink-2">Atención</dt>
                  <dd className="text-right text-[0.95rem]">Trabajos programados</dd>
                </div>
              </dl>
              {wa && (
                <p className="text-[0.95rem] text-ink-2">
                  ¿Prefieres conversar?{" "}
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-olive-ink underline underline-offset-2">
                    Escríbenos por WhatsApp
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative col-span-4 lg:col-span-6">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
