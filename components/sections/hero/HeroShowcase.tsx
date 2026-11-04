"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/data/services";
import { HeroDrawing } from "./HeroDrawing";
import { CYCLE } from "./heroGeometry";

// Croquis del hero con selector de servicios: cada servicio se representa sobre el edificio.
// Los servicios avanzan solos cada CYCLE segundos (2 s); al elegir uno queda fijo hasta 8 s sin
// interacción. Por decisión de diseño este recorrido corre también con movimiento reducido
// (la mira y la profundidad con el mouse sí lo respetan).

const ORDER = ["S-05", "S-01", "S-02", "S-04", "S-03", "S-06", "S-07", "S-08"];
const items = ORDER.map((code) => services.find((s) => s.code === code)).filter((s): s is (typeof services)[number] => Boolean(s));

const START_DELAY = 2600; // deja terminar el trazado inicial del dibujo
const RESUME_AFTER = 8000;

export function HeroShowcase({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [auto, setAuto] = useState(true);
  const [play, setPlay] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(id);
  }, []);

  const running = started && auto;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), CYCLE * 1000);
    return () => clearTimeout(id);
  }, [running, index]);

  useEffect(() => {
    if (auto) return;
    const id = setTimeout(() => setAuto(true), RESUME_AFTER);
    return () => clearTimeout(id);
  }, [auto, index]);

  const current = items[index];
  const pick = (i: number) => {
    setStarted(true);
    setIndex(i);
    setAuto(false);
    setPlay((p) => p + 1);
  };

  return (
    <>
      <div className="grid-12 gap-y-12">
        {children}
        <div className="relative col-span-4 lg:col-span-6">
          <HeroDrawing active={started ? current.code : null} force play={play} />
        </div>
      </div>

      <div className="mt-10 border-t border-line pt-5">
        <div className="label mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="text-ink-2">Elige un servicio para verlo en el edificio</p>
          <p className="text-stone">Ilustración técnica de referencia</p>
        </div>
        <div role="group" aria-label="Servicios" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {items.map((s, i) => {
            const isActive = started && i === index;
            return (
              <button
                key={s.code}
                type="button"
                aria-pressed={isActive}
                onClick={() => pick(i)}
                className={`label relative flex min-h-14 flex-col items-start justify-center gap-0.5 overflow-hidden border px-3 py-2 text-left transition-colors duration-200 ${
                  isActive ? "border-ink bg-lime text-ink" : "border-line bg-paper/80 text-ink-2 hover:border-ink hover:text-ink"
                }`}
              >
                <span className={`whitespace-nowrap text-[0.68rem] ${isActive ? "text-ink" : "text-olive-ink"}`}>{s.code}</span>
                <span className="whitespace-nowrap font-semibold">{s.short}</span>
                {isActive && running && (
                  <motion.span
                    key={index}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-ink"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 min-h-[3.25rem] border-l-4 border-lime pl-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.code}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p className="label text-olive-ink">
                {current.code} · {current.name}
              </p>
              <p className="mt-1 text-[0.95rem] leading-snug text-ink-2">{current.summary}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
