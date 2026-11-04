import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { services } from "@/data/services";
import { SectionHead } from "@/components/ui/SectionHead";

const segmentLabel = { edificio: "Edificio / Condominio", empresa: "Empresa", hogar: "Casa particular" } as const;

function ProjectEntry({ p }: { p: Project }) {
  const service = services.find((s) => s.code === p.serviceCode);
  return (
    <article className="grid grid-cols-1 gap-6 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-6">
      <div className="grid grid-cols-2 gap-3 lg:col-span-6">
        {[p.images.before, p.images.after].map((img, i) =>
          img ? (
            <figure key={i} className="relative aspect-[4/3] max-w-full overflow-hidden bg-paper-2">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
              <figcaption className="label absolute left-2 top-2 bg-paper px-1.5 py-0.5">{i === 0 ? "Antes" : "Después"}</figcaption>
            </figure>
          ) : null,
        )}
      </div>
      <div className="flex flex-col gap-4 lg:col-span-6">
        <p className="label text-olive-ink">
          {p.serviceCode} · {service?.name} · {p.comuna} · {p.date}
        </p>
        <h3 className="text-[1.5rem] font-semibold uppercase">{p.title}</h3>
        <p className="text-ink-2">{p.description}</p>
        <p className="border-l-4 border-lime pl-4 text-ink">{p.result}</p>
        <p className="label text-ink-2">{segmentLabel[p.segment]}</p>
      </div>
    </article>
  );
}

// Estado previo a la publicación de proyectos: muestra la estructura de la ficha, sin casos ficticios.
function EmptyState() {
  const fields = ["Tipo de trabajo", "Comuna", "Fecha", "Descripción", "Resultado"];
  return (
    <div className="grid grid-cols-1 gap-10 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-6">
      <div className="grid grid-cols-2 gap-3 lg:col-span-6">
        {["Antes", "Después"].map((t) => (
          <div key={t} className="flex aspect-[4/3] max-w-full flex-col justify-between border border-dashed border-ink/40 p-3">
            <span className="label">{t}</span>
            <span className="label text-[0.65rem] text-ink-2">Fotografía real del trabajo</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-6 lg:col-span-6">
        <p className="text-ink">
          Estamos preparando la publicación de trabajos con fotografías reales, comuna y resultado. No usamos imágenes de
          referencia ni casos ficticios.
        </p>
        <dl className="divide-y divide-line border-y border-line">
          {fields.map((f) => (
            <div key={f} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="label text-ink-2">{f}</dt>
              <dd aria-hidden="true" className="h-2 w-1/3 bg-ink/10" />
            </div>
          ))}
        </dl>
        <p className="label text-ink-2">Cada proyecto publicado incluirá estos datos</p>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="bg-paper-2 py-14 sm:py-20 lg:py-16">
      <div className="shell flex flex-col gap-10">
        <SectionHead index="08" eyebrow="Portafolio" title={<span id="proyectos-titulo">Proyectos realizados</span>} />
        {projects.length > 0 ? (
          <div className="flex flex-col gap-16">
            {projects.map((p) => (
              <ProjectEntry key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
