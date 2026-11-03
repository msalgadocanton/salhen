"use client";

import { motion } from "motion/react";

const lines = [
  { text: "Tu propiedad.", tone: "text-ink" },
  { text: "En buenas manos.", tone: "text-olive" },
];

export function HeroTitle() {
  return (
    <h1 id="hero-heading" className="relative z-10 text-[length:var(--text-mega)] font-bold uppercase leading-[0.86] tracking-[-0.01em]">
      {lines.map((line, i) => (
        <span key={line.text} className="block overflow-hidden pb-[0.04em]">
          <motion.span
            className={`block ${line.tone}`}
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.25, 1, 0.5, 1] }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
