"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

type Box = { x: number; y: number; w: number; h: number };

// Mira técnica que sigue al puntero dentro de un croquis: líneas de referencia a todo el
// encuadre, retícula central y lectura de coordenadas en mono.
export function Crosshair({
  x,
  y,
  on,
  box,
  color,
  textColor,
  readout,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  on: MotionValue<number>;
  box: Box;
  color: string;
  textColor: string;
  readout: (x: number, y: number) => string;
}) {
  const label = useTransform([x, y], ([px, py]: number[]) => readout(px, py));
  // Cerca del borde derecho la lectura pasa al lado izquierdo de la mira.
  const tx = useTransform(x, (v) => (v > box.x + box.w - 150 ? v - 142 : v + 12));
  const ty = useTransform(y, (v) => Math.max(box.y + 14, v - 12));

  return (
    <motion.g aria-hidden="true" style={{ opacity: on }} pointerEvents="none">
      <motion.line x1={x} x2={x} y1={box.y} y2={box.y + box.h} stroke={color} strokeWidth="0.6" strokeDasharray="4 4" />
      <motion.line x1={box.x} x2={box.x + box.w} y1={y} y2={y} stroke={color} strokeWidth="0.6" strokeDasharray="4 4" />
      <motion.circle cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth="1.2" />
      <motion.circle cx={x} cy={y} r={1.8} fill={color} />
      <motion.text
        x={tx}
        y={ty}
        fill={textColor}
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="0.06em"
      >
        {label}
      </motion.text>
    </motion.g>
  );
}
