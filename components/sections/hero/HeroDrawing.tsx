"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useAmbientMotion } from "@/components/motion/useAmbientMotion";
import { heroMarkers } from "./heroMarkers";

// Elevación técnica de un edificio con marcadores de especialidad.
// Es una ilustración de referencia, no la representación de un proyecto real.
// Animación: el trazado se dibuja al cargar (CSS); luego una banda de inspección recorre los pisos
// y algunas ventanas se encienden de forma escalonada (Motion). Sin animación si el usuario reduce el movimiento.

const FLOORS = 9;
const FLOOR_H = 40;
const TOP = 70;
const GROUND = TOP + FLOORS * FLOOR_H + 40; // 470
const LEFT = 150;
const RIGHT = 450;
const COLS = 5;

const d = (delay: number): CSSProperties => ({ ["--delay" as string]: `${delay}s` });


// Ventanas que se encienden: [piso, columna, retardo inicial en segundos]
const LIT_WINDOWS: [number, number, number][] = [
  [1, 3, 2.6], [3, 0, 3.4], [2, 4, 4.1], [5, 1, 3.0], [4, 2, 4.8], [6, 4, 3.8], [7, 0, 5.2], [0, 1, 4.4], [6, 2, 5.8],
];

function InspectionScan() {
  return (
    <motion.g
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [0, -(GROUND - 40 - TOP), -(GROUND - 40 - TOP)], opacity: [0, 1, 1, 0] }}
      transition={{
        y: { duration: 7, times: [0, 0.85, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5, delay: 2.4 },
        opacity: { duration: 7, times: [0, 0.08, 0.85, 1], ease: "linear", repeat: Infinity, repeatDelay: 1.5, delay: 2.4 },
      }}
    >
      <rect x={LEFT} y={GROUND - 40} width={RIGHT - LEFT} height={FLOOR_H} fill="var(--color-lime)" fillOpacity="0.16" />
      <path d={`M${LEFT - 14} ${GROUND - 40} H${RIGHT + 14}`} stroke="var(--color-lime)" strokeWidth="2" />
    </motion.g>
  );
}

export function HeroDrawing() {
  const floors = Array.from({ length: FLOORS }, (_, i) => TOP + i * FLOOR_H);
  const ambient = useAmbientMotion();

  return (
    <svg
      // Encuadre ajustado al dibujo: arriba la sala de máquinas, abajo la etiqueta S-01 y a la
      // derecha el texto de los marcadores, para que el croquis calce con la columna de texto.
      viewBox="0 12 690 506"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="hero-drawing-title"
      className="h-auto w-full max-w-full lg:absolute lg:inset-0 lg:h-full"
    >
      <title id="hero-drawing-title">
        Ilustración técnica: elevación de un edificio con marcadores de techumbre, fachada y tablero eléctrico
      </title>

      {ambient && (
        <g aria-hidden="true">
          <InspectionScan />
          {LIT_WINDOWS.map(([fi, ci, delay]) => (
            <motion.rect
              key={`${fi}-${ci}`}
              x={LEFT + 24 + ci * 52}
              y={TOP + fi * FLOOR_H + 10}
              width={42}
              height={22}
              fill="var(--color-lime)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 3.2, times: [0, 0.2, 0.75, 1], delay, repeat: Infinity, repeatDelay: 4 + ((fi + ci) % 3) * 1.5 }}
            />
          ))}
        </g>
      )}

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

        {/* Terreno */}
        <path className="draw-line" pathLength={1} style={d(0.1)} d={`M20 ${GROUND} H620`} strokeWidth="1.5" />
      </g>

      {/* Achurado de terreno */}
      <g stroke="var(--color-stone)" strokeWidth="0.75">
        {Array.from({ length: 30 }, (_, i) => (
          <path key={i} className="draw-line" pathLength={1} style={d(0.6 + i * 0.01)} d={`M${28 + i * 20} ${GROUND + 14} l12 -12`} />
        ))}
      </g>

      {/* Cota vertical */}
      <g stroke="var(--color-stone)" strokeWidth="0.75" fill="none">
        <path className="draw-line" pathLength={1} style={d(1.2)} d={`M112 ${TOP - 10} V${GROUND} M106 ${TOP - 10} h12 M106 ${GROUND} h12`} />
      </g>
      <g fill="var(--color-ink-2)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.06em">
        <text x="48" y={TOP - 14}>CUBIERTA</text>
        <text x="72" y={GROUND - 6}>± 0.00</text>
      </g>

      {/* Marcadores de especialidad */}
      {heroMarkers.map((m) => (
        <g key={m.code}>
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
          <circle cx={m.x} cy={m.y} r="5.5" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="1.25" />
          <g className="hidden sm:block" fontFamily="var(--font-mono)">
            <text x={m.lx} y={m.ly} fontSize="12" fontWeight="600" fill="var(--color-olive-ink)" letterSpacing="0.08em">
              {m.code}
            </text>
            <text x={m.lx} y={m.ly + 16} fontSize="11" fill="var(--color-ink-2)">
              {m.label}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
