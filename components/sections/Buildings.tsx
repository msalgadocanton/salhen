"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useAmbientMotion } from "@/components/motion/useAmbientMotion";
import { buildingCapabilities, type BuildingZone } from "@/data/content";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";

const audiences = ["Administradores de condominios", "Comités de administración", "Empresas administradoras"];

const SLABS = Array.from({ length: 10 }, (_, i) => 80 + i * 40);

// Trazado del corte al entrar en pantalla: cada línea se dibuja con un leve desfase.
// Con movimiento reducido el dibujo aparece completo de inmediato.
function useDrawVariants(instant: boolean) {
  return useMemo(() => {
    const draw: Variants = {
      hidden: { pathLength: 0, opacity: 0 },
      show: (i: number = 0) => ({
        pathLength: 1,
        opacity: 1,
        transition: instant
          ? { duration: 0 }
          : { pathLength: { duration: 1.2, delay: i * 0.06, ease: [0.25, 1, 0.5, 1] }, opacity: { duration: 0.01, delay: i * 0.06 } },
      }),
    };
    const fadeIn: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: instant ? { duration: 0 } : { duration: 0.6, delay: 1 } } };
    return { draw, fadeIn };
  }, [instant]);
}

// Zona destacada: entra con un destello y queda en un relleno suave.
function Zone({ zone, active, ...rect }: { zone: BuildingZone; active: BuildingZone; x: number; y: number; width: number; height: number }) {
  const on = active === zone || active === "all";
  return (
    <motion.rect
      {...rect}
      fill="var(--color-lime)"
      stroke="var(--color-lime)"
      strokeWidth="1.25"
      initial={false}
      animate={on ? { fillOpacity: [0.5, 0.22], strokeOpacity: 1 } : { fillOpacity: 0, strokeOpacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}

// Andamio colgante que sube y baja por la línea de vida de la fachada.
const SCAFFOLD_Y = [318, 120, 250, 318];

function BuildingSection({ active }: { active: BuildingZone }) {
  const ambient = useAmbientMotion();
  const { draw, fadeIn } = useDrawVariants(useReducedMotion() === true);
  const loop ={ duration: 14, times: [0, 0.4, 0.7, 1], ease: "easeInOut" as const, repeat: Infinity, delay: 1.5 };

  return (
    <svg
      viewBox="0 18 440 524"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto h-auto w-full max-w-sm lg:absolute lg:inset-0 lg:h-full lg:max-w-none"
      role="img"
      aria-labelledby="corte-titulo"
    >
      <title id="corte-titulo">Corte esquemático de un edificio con las zonas de intervención destacadas</title>

      {/* Zonas */}
      <Zone zone="roof" active={active} x={48} y={40} width={324} height={44} />
      <Zone zone="facade" active={active} x={352} y={84} width={40} height={356} />
      <Zone zone="shaft" active={active} x={194} y={84} width={40} height={416} />
      <Zone zone="ground" active={active} x={56} y={440} width={300} height={60} />

      <motion.g
        fill="none"
        stroke="var(--color-mist)"
        strokeWidth="1.1"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Terreno, envolvente y antepecho */}
        <motion.path variants={draw} custom={0} d="M10 500 H430" strokeWidth="1.4" />
        <motion.path variants={draw} custom={1} d="M60 500 V80 H360 V500" />
        <motion.path variants={draw} custom={2} d="M54 80 V58 H366 V80" />
        <motion.path variants={draw} custom={3} d="M120 58 v-22 h70 v22" />
        {/* Losas y muros interiores */}
        {SLABS.map((y, i) => (
          <motion.path key={y} variants={draw} custom={4 + i * 0.5} d={`M60 ${y} H360`} strokeWidth="0.7" />
        ))}
        {/* Shaft eléctrico */}
        <motion.path variants={draw} custom={6} d="M200 80 V500 M228 80 V500" strokeWidth="0.7" />
        {/* Canaleta y bajada */}
        <motion.path variants={draw} custom={7} d="M54 80 h-10 v6 h10 M44 86 V500" strokeWidth="0.8" />

        {/* Detalles: aparecen cuando el trazado principal ya está dibujado */}
        <motion.g variants={fadeIn}>
          <path d="M130 80 V440 M290 80 V440" strokeWidth="0.6" strokeDasharray="3 4" />
          {SLABS.slice(0, 9).map((y) => (
            <rect key={`t${y}`} x="205" y={y + 14} width="18" height="12" strokeWidth="0.7" />
          ))}
          {/* Luminarias de pasillo */}
          {SLABS.slice(0, 9).map((y) => (
            <path key={`l${y}`} d={`M160 ${y + 1} v5 M170 ${y + 1} v5 M260 ${y + 1} v5`} strokeWidth="0.7" />
          ))}
          {/* Acceso y portón */}
          <path d="M150 500 v-40 h40 v40 M300 500 v-34 h50 v34" strokeWidth="0.9" />
          <path d="M304 470 h42 M304 478 h42 M304 486 h42 M304 494 h42" strokeWidth="0.5" />
          {/* Trabajo en altura: línea de vida y andamio colgante */}
          <path d="M366 58 h22" strokeWidth="0.8" />
          <motion.line
            x1={388}
            y1={58}
            x2={388}
            y2={318}
            strokeWidth="0.8"
            animate={ambient ? { y2: SCAFFOLD_Y } : undefined}
            transition={loop}
          />
          <motion.rect
            x={372}
            y={318}
            width={32}
            height={12}
            stroke="var(--color-lime)"
            strokeWidth="1.1"
            // attrY anima el atributo y del rect; "y" en Motion sería una traslación adicional.
            animate={ambient ? { attrY: SCAFFOLD_Y } : undefined}
            transition={loop}
          />
        </motion.g>
      </motion.g>
      <g stroke="var(--color-graphite-line)" strokeWidth="0.8">
        {Array.from({ length: 21 }, (_, i) => (
          <path key={i} d={`M${16 + i * 20} 514 l12 -12`} />
        ))}
      </g>
      <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-mist)" letterSpacing="0.08em">
        <text x="56" y="30">CUBIERTA</text>
        <text x="64" y="534">ACCESO · ÁREAS COMUNES</text>
        <text x="236" y="76">SHAFT</text>
      </g>
    </svg>
  );
}

export function Buildings() {
  const [activeId, setActiveId] = useState(buildingCapabilities[0].id);
  const active = buildingCapabilities.find((c) => c.id === activeId) ?? buildingCapabilities[0];

  return (
    // Pensada para verse completa en una pantalla de escritorio: dos columnas simétricas, el corte
    // ocupa la altura de la columna de texto y la franja inferior cierra la lámina.
    <section id="edificios" aria-labelledby="edificios-titulo" className="on-dark blueprint-dark relative bg-graphite py-20 text-paper lg:py-16">
      <div className="shell grid-12 gap-y-12 lg:gap-y-10">
        <div className="col-span-4 flex flex-col gap-7 lg:col-span-6">
          <SectionHead
            dark
            index="03"
            eyebrow="Edificios y condominios"
            title={
              <span id="edificios-titulo">
                Un solo aliado técnico para la mantención de <span className="text-lime">tu edificio.</span>
              </span>
            }
          />
          <p className="prose-measure text-mist">
            Coordinamos trabajos de distintas especialidades desde un mismo punto de contacto. La administración pide, SALHEN
            organiza, supervisa y entrega cada trabajo documentado.
          </p>

          <div>
            <p className="label mb-3 text-mist">Elige una capacidad para ver dónde interviene</p>
            <ul className="border-t border-graphite-line">
              {buildingCapabilities.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <li key={c.id} className="border-b border-graphite-line">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveId(c.id)}
                      onMouseEnter={() => setActiveId(c.id)}
                      onFocus={() => setActiveId(c.id)}
                      className={`flex min-h-11 w-full items-center justify-between gap-4 py-2 text-left font-display text-[1.2rem] font-medium uppercase tracking-wide transition-colors ${
                        isActive ? "text-lime" : "text-paper hover:text-lime"
                      }`}
                    >
                      {c.label}
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 transition-[background-color,transform] duration-300 ${isActive ? "scale-100 bg-lime" : "scale-50 bg-graphite-line"}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-5 lg:col-span-6">
          <div className="relative lg:min-h-[16rem] lg:flex-1">
            <BuildingSection active={active.zone} />
          </div>
          <div className="min-h-24 border-l-2 border-lime pl-5" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="label text-lime">{active.label}</p>
                  <p className="mt-2 text-[0.95rem] text-mist">{active.text}</p>
                </motion.div>
              </AnimatePresence>
          </div>
        </div>

        <div className="col-span-4 grid grid-cols-1 items-center gap-8 border-t border-graphite-line pt-8 lg:col-span-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <p className="label mb-3 text-mist">Trabajamos con</p>
            <ul className="flex flex-col gap-0.5 text-[0.95rem] text-paper">
              {audiences.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <p className="text-[0.95rem] text-mist lg:col-span-4">
            SALHEN no administra edificios. Trabajamos junto a la administración y el comité como proveedor técnico de
            mantención y reparaciones.
          </p>
          <div className="lg:col-span-4 lg:justify-self-end">
            <ButtonLink href="/?tipo=edificio#cotizar" variant="lime">
              Solicitar evaluación para mi edificio
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
