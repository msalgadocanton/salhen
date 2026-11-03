"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { processSteps } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="py-20 lg:py-16">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 lg:col-span-6">
          <div className="flex flex-col gap-7">
            <SectionHead
              index="07"
              eyebrow="Proceso SALHEN"
              title={<span id="proceso-titulo">De la solicitud al respaldo, en siete etapas</span>}
            />
            <p className="prose-measure text-ink-2">
              Un mismo procedimiento para un edificio, una oficina o una casa. Siempre sabes en qué etapa está tu trabajo y quién
              es responsable.
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative col-span-4 lg:col-span-6">
          <span aria-hidden="true" className="absolute bottom-5 left-[1.25rem] top-5 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-5 left-[calc(1.25rem-1px)] top-5 w-[3px] origin-top bg-lime"
          />
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 pb-5 last:pb-0">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center border border-ink bg-paper font-display text-[1.2rem] font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-0.5">
                <h3 className="text-[1.2rem] font-semibold uppercase">{step.title}</h3>
                <p className="mt-1 text-[0.92rem] text-ink-2">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
