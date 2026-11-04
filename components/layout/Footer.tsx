import Link from "next/link";
import { navigation } from "@/data/content";
import { exclusions, services } from "@/data/services";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { email, phone } = siteConfig.contact;
  return (
    <footer className="on-dark bg-graphite text-mist">
      <div className="shell grid-12 gap-y-10 py-14 sm:gap-y-14 sm:py-20">
        <div className="col-span-4 flex flex-col gap-6 lg:col-span-4">
          <Logo variant="verticalBlanco" className="h-32 self-start" />
          <p className="max-w-xs text-[0.95rem] leading-relaxed">
            Mantención, reparación y soluciones constructivas para edificios, empresas y hogares.
          </p>
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-lime">Mantención con respaldo</p>
        </div>

        <nav aria-label="Servicios" className="col-span-2 lg:col-span-3">
          <h2 className="label mb-5 text-paper">Servicios</h2>
          <ul className="flex flex-col gap-2.5 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.code}>
                <Link href="/#servicios" className="transition-colors hover:text-paper">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Secciones" className="col-span-2 lg:col-span-2">
          <h2 className="label mb-5 text-paper">SALHEN</h2>
          <ul className="flex flex-col gap-2.5 text-[0.95rem]">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-paper">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#cotizar" className="transition-colors hover:text-paper">
                Cotización
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-span-4 flex flex-col gap-8 lg:col-span-3">
          <div>
            <h2 className="label mb-4 text-paper">Cobertura inicial</h2>
            <p className="text-[0.95rem] leading-relaxed">
              Sector oriente de Santiago: {siteConfig.coverage.join(", ")}.
            </p>
          </div>
          {(email || phone) && (
            <div>
              <h2 className="label mb-4 text-paper">Contacto</h2>
              <ul className="flex flex-col gap-1.5 text-[0.95rem]">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-paper">{email}</a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-paper">{phone}</a>
                  </li>
                )}
              </ul>
            </div>
          )}
          <div>
            <h2 className="label mb-4 text-paper">No realizamos</h2>
            <p className="text-[0.9rem] leading-relaxed">{exclusions.join(" · ")}.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-graphite-line">
        <div className="shell flex flex-col gap-2 pb-24 pt-6 text-[0.85rem] sm:flex-row sm:justify-between sm:py-6">
          <p>© {new Date().getFullYear()} SALHEN. Santiago, Chile.</p>
          <p>Los trabajos son ejecutados por especialistas de la red SALHEN.</p>
        </div>
      </div>
    </footer>
  );
}
