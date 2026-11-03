"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

// Aparición sutil al entrar en pantalla. MotionConfig (reducedMotion="user") la desactiva
// para quienes prefieren movimiento reducido.
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
