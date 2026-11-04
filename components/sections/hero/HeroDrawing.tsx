"use client";

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useAmbientMotion } from "@/components/motion/useAmbientMotion";
import { useSvgPointer } from "@/components/motion/useSvgPointer";
import { Crosshair } from "@/components/motion/Crosshair";
import { heroMarkers } from "./heroMarkers";
import { serviceEffects } from "./heroEffects";
import { COLS, FLOORS, FLOOR_H, GROUND, LEFT, LEVEL_M, RIGHT, TOP } from "./heroGeometry";

// Elevación técnica de un edificio con marcadores de especialidad.
// Es una ilustración de referencia, no la representación de un proyecto real.
// Animación: el trazado se dibuja al cargar (CSS). Luego cada servicio seleccionado (active) se
// representa sobre el edificio: pintura que cubre la fachada, circuitos que se energizan, membrana
// sobre la cubierta, etc. (ver heroEffects). Con mouse, una mira técnica sigue al puntero, el piso
// bajo él se ilumina y las capas se desplazan con profundidad; al hacer scroll, edificio y
// marcadores suben a distinta velocidad. Con movimiento reducido no hay profundidad ni mira, y el
// efecto del servicio corre una sola vez.

const d = (delay: number): CSSProperties => ({ ["--delay" as string]: `${delay}s` });

// Piso bajo el puntero: banda que salta de losa en losa, con el número de piso al costado.
const floorIndex = (y: number) => Math.min(FLOORS, Math.max(0, Math.floor((y - TOP) / FLOOR_H)));
const floorLabel = (y: number) => {
  const piso = FLOORS + 1 - floorIndex(y);
  return piso === 1 ? "PISO 1 · ACCESO" : `PISO ${piso}`;
};

function FloorHighlight({ x, y, on }: { x: MotionValue<number>; y: MotionValue<number>; on: MotionValue<number> }) {
  const bandY = useTransform(y, (v) => TOP + floorIndex(v) * FLOOR_H);
  const opacity = useTransform([x, y, on], ([px, py, o]: number[]) =>
    px >= LEFT && px <= RIGHT && py >= TOP && py <= GROUND ? o * 0.9 : 0,
  );
  const label = useTransform(y, floorLabel);
  const textY = useTransform(bandY, (v) => v + 25);
  return (
    <motion.g aria-hidden="true" style={{ opacity }} pointerEvents="none">
      <motion.rect x={LEFT} y={bandY} width={RIGHT - LEFT} height={FLOOR_H} fill="var(--color-lime)" fillOpacity="0.35" />
      <motion.rect x={LEFT - 5} y={bandY} width={5} height={FLOOR_H} fill="var(--color-olive)" />
      <motion.text
        x={RIGHT + 12}
        y={textY}
        fontFamily="var(--font-mono)"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.08em"
        fill="var(--color-olive-ink)"
      >
        {label}
      </motion.text>
    </motion.g>
  );
}

// Desplazamiento de una capa según el mouse (depth) y según el scroll (scrollRange).
function useLayer(enabled: boolean, nx: MotionValue<number>, ny: MotionValue<number>, depth: number, scroll: MotionValue<number>, scrollRange: number) {
  const x = useTransform(nx, (v) => (enabled ? v * depth : 0));
  const y = useTransform([ny, scroll], ([v, s]: number[]) => (enabled ? v * depth * 0.6 + s * scrollRange : 0));
  return { x, y };
}

const readout = (px: number, py: number) => {
  const n = ((GROUND - py) / FLOOR_H) * LEVEL_M;
  return `X ${((px / FLOOR_H) * LEVEL_M).toFixed(2)} · N ${n >= 0 ? "+" : ""}${n.toFixed(2)} m`;
};

// Capa de efecto del servicio activo, con fundido al cambiar de servicio.
// Si la persona eligió el servicio con un clic (force), el efecto se reproduce aunque tenga
// activado el movimiento reducido: es una animación que pidió explícitamente.
function EffectSlot({ active, layer, rep, force, play }: { active: string | null; layer: "ground" | "under" | "over"; rep: number; force: boolean; play: number }) {
  const render = active ? serviceEffects[active]?.[layer] : undefined;
  return (
    <MotionConfig reducedMotion={force ? "never" : "user"}>
    <AnimatePresence>
      {render && (
        <motion.g
          key={`${active}-${play}`}
          aria-hidden="true"
          pointerEvents="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {render({ rep }) as ReactNode}
        </motion.g>
      )}
    </AnimatePresence>
    </MotionConfig>
  );
}

// play cambia con cada clic en un servicio y reinicia su efecto aunque ya estuviera activo.
// En pantallas angostas los textos de los marcadores se ocultan: el encuadre se ajusta para que
// el edificio (x 150–450) quede centrado.
function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

export function HeroDrawing({ active = null, force = false, play = 0 }: { active?: string | null; force?: boolean; play?: number }) {
  const floors = Array.from({ length: FLOORS }, (_, i) => TOP + i * FLOOR_H);
  const ambient = useAmbientMotion();
  const pointer = useSvgPointer(ambient);
  // Los efectos de servicio se repiten siempre que se muestren a la fuerza (recorrido del hero).
  const rep = ambient || force ? Infinity : 0;
  const wide = useWide();

  // 0 mientras el croquis está en pantalla completa; avanza a 1 a medida que sale por arriba.
  const { scrollYProgress } = useScroll({ target: pointer.ref as unknown as RefObject<HTMLElement>, offset: ["start start", "end start"] });
  const groundLayer = useLayer(ambient, pointer.nx, pointer.ny, -4, scrollYProgress, 0);
  const buildingLayer = useLayer(ambient, pointer.nx, pointer.ny, 8, scrollYProgress, -40);
  const markerLayer = useLayer(ambient, pointer.nx, pointer.ny, 20, scrollYProgress, -110);

  return (
    <svg
      ref={pointer.ref}
      {...pointer.handlers}
      // Encuadre ajustado al dibujo: arriba la sala de máquinas, abajo la etiqueta S-01 y a la
      // derecha el texto de los marcadores, para que el croquis calce con la columna de texto.
      viewBox={wide ? "0 12 690 506" : "-10 12 620 506"}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="hero-drawing-title"
      className="h-auto w-full max-w-full overflow-visible lg:absolute lg:inset-0 lg:h-full"
    >
      <title id="hero-drawing-title">
        Ilustración técnica: elevación de un edificio con marcadores de techumbre, fachada y tablero eléctrico
      </title>

      {/* Terreno, achurado y cota: la capa más lejana */}
      <motion.g style={groundLayer}>
        <path className="draw-line" pathLength={1} style={d(0.1)} d={`M20 ${GROUND} H620`} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
        <g stroke="var(--color-stone)" strokeWidth="0.75">
          {Array.from({ length: 30 }, (_, i) => (
            <path key={i} className="draw-line" pathLength={1} style={d(0.6 + i * 0.01)} d={`M${28 + i * 20} ${GROUND + 14} l12 -12`} />
          ))}
        </g>
        <g stroke="var(--color-stone)" strokeWidth="0.75" fill="none">
          <path className="draw-line" pathLength={1} style={d(1.2)} d={`M112 ${TOP - 10} V${GROUND} M106 ${TOP - 10} h12 M106 ${GROUND} h12`} />
        </g>
        <g fill="var(--color-ink-2)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.06em">
          <text x="48" y={TOP - 14}>CUBIERTA</text>
          <text x="72" y={GROUND - 6}>± 0.00</text>
        </g>
        <EffectSlot active={active} layer="ground" rep={rep} force={force} play={play} />
      </motion.g>

      {/* Edificio */}
      <motion.g style={buildingLayer}>
        <EffectSlot active={active} layer="under" rep={rep} force={force} play={play} />
        {ambient && <FloorHighlight x={pointer.x} y={pointer.y} on={pointer.on} />}

        <g fill="none" stroke="var(--color-ink)" strokeWidth="1.25" strokeLinecap="square">
          {/* Volumen principal, antepecho y sala de máquinas */}
          <rect className="draw-line" pathLength={1} x={LEFT} y={TOP} width={RIGHT - LEFT} height={GROUND - TOP} />
          <path className="draw-line" pathLength={1} style={d(0.2)} d={`M${LEFT - 6} ${TOP} h${RIGHT - LEFT + 12} v-10 h-${RIGHT - LEFT + 12} z`} />
          <rect className="draw-line" pathLength={1} style={d(0.35)} x={196} y={26} width={74} height={34} />
          <path className="draw-line" pathLength={1} style={d(0.45)} d="M208 26 v-10 h22 v10 M362 60 v-16 h40 v16" />

          {/* Losas */}
          {floors.slice(1).map((y, i) => (
            <path key={y} className="draw-line" pathLength={1} style={d(0.3 + i * 0.05)} d={`M${LEFT} ${y} H${RIGHT}`} strokeWidth="0.75" />
          ))}

          {/* Ventanas */}
          {floors.map((y, fi) =>
            Array.from({ length: COLS }, (_, ci) => (
              <rect
                key={`${fi}-${ci}`}
                className="draw-line"
                pathLength={1}
                style={d(0.5 + fi * 0.06 + ci * 0.02)}
                x={LEFT + 24 + ci * 52}
                y={y + 10}
                width={42}
                height={22}
                strokeWidth="0.75"
              />
            )),
          )}

          {/* Primer piso y acceso */}
          <path className="draw-line" pathLength={1} style={d(0.9)} d={`M${LEFT} ${GROUND - 40} H${RIGHT}`} />
          <path className="draw-line" pathLength={1} style={d(1)} d={`M278 ${GROUND} v-32 h44 v32 M300 ${GROUND} v-32`} strokeWidth="0.9" />
          <path className="draw-line" pathLength={1} style={d(1.05)} d={`M172 ${GROUND - 30} h28 v22 h-28 z`} strokeWidth="0.9" />
          <path className="draw-line" pathLength={1} style={d(1.05)} d={`M350 ${GROUND - 30} h76 v22 h-76 z M388 ${GROUND - 30} v22`} strokeWidth="0.75" />
        </g>

        <EffectSlot active={active} layer="over" rep={rep} force={force} play={play} />
      </motion.g>

      {/* Marcadores de especialidad: la capa más cercana. El del servicio activo queda destacado. */}
      <motion.g style={markerLayer}>
        {heroMarkers.map((m) => {
          const dim = active !== null && active !== m.code;
          return (
            <motion.g key={m.code} initial={false} animate={{ opacity: dim ? 0.3 : 1 }} transition={{ duration: 0.4 }}>
              <circle cx={m.x} cy={m.y} r="7" fill="var(--color-lime)" className="marker-ring" style={d(m.delay + 0.4)} />
              <path
                className="draw-line"
                pathLength={1}
                style={d(m.delay)}
                d={`M${m.x} ${m.y} L${m.lx < m.x ? m.lx + 150 : m.lx - 8} ${m.ly + 4}`}
                stroke="var(--color-olive)"
                strokeWidth="1"
                fill="none"
              />
              <motion.circle
                cx={m.x}
                cy={m.y}
                fill="var(--color-lime)"
                stroke="var(--color-ink)"
                strokeWidth="1.25"
                initial={{ r: 5.5 }}
                animate={{ r: active === m.code ? 8.5 : 5.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <g className="hidden sm:block" fontFamily="var(--font-mono)">
                <text x={m.lx} y={m.ly} fontSize="12" fontWeight="600" fill="var(--color-olive-ink)" letterSpacing="0.08em">
                  {m.code}
                </text>
                <text x={m.lx} y={m.ly + 16} fontSize="11" fill="var(--color-ink-2)">
                  {m.label}
                </text>
              </g>
            </motion.g>
          );
        })}
      </motion.g>

      {ambient && (
        <Crosshair
          x={pointer.x}
          y={pointer.y}
          on={pointer.on}
          box={{ x: 0, y: 12, w: 690, h: 506 }}
          color="var(--color-olive)"
          textColor="var(--color-olive-ink)"
          readout={readout}
        />
      )}
    </svg>
  );
}
