"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Animaciones decorativas en bucle: solo después del montaje (el HTML del servidor y el del
// cliente coinciden) y nunca si el usuario pidió reducir el movimiento.
export function useAmbientMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}
