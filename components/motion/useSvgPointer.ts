"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";

// Sigue el puntero (solo mouse) sobre un SVG y entrega su posición en coordenadas del viewBox,
// más un desplazamiento normalizado (-1..1) para efectos de profundidad. Sin efecto en táctil
// para no interferir con el scroll.
export function useSvgPointer(enabled: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const on = useMotionValue(0);

  const soft = { stiffness: 120, damping: 20, mass: 0.6 };
  const tight = { stiffness: 700, damping: 45 };

  const onPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      const svg = ref.current;
      if (!enabled || !svg || e.pointerType !== "mouse") return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      x.set(p.x);
      y.set(p.y);
      const r = svg.getBoundingClientRect();
      nx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      ny.set(((e.clientY - r.top) / r.height) * 2 - 1);
      on.set(1);
    },
    [enabled, x, y, nx, ny, on],
  );

  const onPointerLeave = useCallback(() => {
    nx.set(0);
    ny.set(0);
    on.set(0);
  }, [nx, ny, on]);

  return {
    ref,
    handlers: enabled ? { onPointerMove, onPointerLeave } : {},
    x: useSpring(x, tight),
    y: useSpring(y, tight),
    nx: useSpring(nx, soft),
    ny: useSpring(ny, soft),
    on: useSpring(on, { stiffness: 300, damping: 30 }),
  };
}
