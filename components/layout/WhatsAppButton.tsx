"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { whatsappHref } from "@/lib/site";

// Intercomunicador esférico de WhatsApp. Cae desde arriba con rebote hasta la esquina inferior
// derecha, flota levemente, emite ondas de "llamada" y tiene un anillo LED que gira. Al aterrizar
// muestra un globo "¿Hablamos?" unos segundos; en escritorio el globo reaparece al pasar el mouse.
// Es una entrada corta y pedida explícitamente como efecto, por eso corre también con movimiento
// reducido (reducedMotion="never").
//
// Solo se muestra si NEXT_PUBLIC_WHATSAPP_NUMBER está configurado. En desarrollo, sin número, se
// muestra igual con un enlace genérico de WhatsApp (elige el contacto) para poder revisarlo.

const MESSAGE = "Hola SALHEN, quiero solicitar una evaluación.";
const DROP_DELAY = 1.2;

// Rejilla de parlante: puntos en anillo alrededor del ícono
const GRILLE = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return { x: 50 + Math.cos(a) * 38, y: 50 + Math.sin(a) * 38, i };
});

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"
      />
    </svg>
  );
}

export function WhatsAppButton() {
  const href =
    whatsappHref(MESSAGE) ??
    (process.env.NODE_ENV === "development" ? `https://wa.me/?text=${encodeURIComponent(MESSAGE)}` : null);

  const [landed, setLanded] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [hover, setHover] = useState(false);

  // Globo de bienvenida: aparece al aterrizar y se oculta solo.
  useEffect(() => {
    if (!landed) return;
    setBubble(true);
    const id = setTimeout(() => setBubble(false), 5000);
    return () => clearTimeout(id);
  }, [landed]);

  if (!href) return null;
  const showBubble = bubble || hover;

  return (
    <MotionConfig reducedMotion="never">
      <div
        className="pointer-events-none fixed z-30"
        style={{
          right: "max(1.25rem, env(safe-area-inset-right, 0px))",
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Sombra en el piso: crece cuando la esfera se acerca */}
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-[50%] bg-ink/35 blur-[3px] sm:w-14"
          initial={{ scaleX: 0.2, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 10, mass: 1.1, delay: DROP_DELAY }}
        />

        {/* Caída con rebote */}
        <motion.div
          initial={{ y: "-110vh" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 10, mass: 1.1, delay: DROP_DELAY }}
          onAnimationComplete={() => setLanded(true)}
        >
          {/* Flotación suave una vez en su lugar */}
          <motion.div
            animate={landed ? { y: [0, -5, 0] } : { y: 0 }}
            transition={landed ? { duration: 3.4, ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir a SALHEN por WhatsApp (se abre en una pestaña nueva)"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
              onPointerLeave={() => setHover(false)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
              className="group pointer-events-auto relative block h-16 w-16 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:h-[4.5rem] sm:w-[4.5rem]"
            >
              {/* Globo "¿Hablamos?" */}
              <AnimatePresence>
                {showBubble && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute right-[calc(100%+0.85rem)] top-1/2 flex -translate-y-1/2 max-sm:hidden items-center gap-2.5 whitespace-nowrap border border-ink/80 bg-paper py-2 pl-3 pr-4 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.55)]"
                    initial={{ opacity: 0, x: 12, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-lime"
                        animate={{ scale: [1, 2.4], opacity: [0.8, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <span className="relative h-2 w-2 rounded-full bg-olive" />
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span className="font-display text-[1rem] font-semibold uppercase tracking-wide text-ink">¿Hablamos?</span>
                      <span className="label text-[0.65rem] text-ink-2">WhatsApp · en línea</span>
                    </span>
                    {/* Pico del globo */}
                    <span className="absolute -right-[7px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-ink/80 bg-paper" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Ondas de llamada */}
              {landed &&
                [0, 1].map((k) => (
                  <motion.span
                    key={k}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-lime"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.85], opacity: [0.7, 0] }}
                    transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, repeatDelay: 2.2, delay: k * 0.45 }}
                  />
                ))}

              {/* Anillo LED que gira */}
              <motion.span
                aria-hidden="true"
                className="absolute -inset-[3px] rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, var(--color-lime) 0deg, transparent 80deg, transparent 280deg, var(--color-lime) 360deg)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: hover ? 1.2 : 3.6, ease: "linear", repeat: Infinity }}
              />

              {/* Esfera */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-full shadow-[0_14px_28px_-10px_rgb(0_0_0/0.6),inset_0_-6px_12px_rgb(0_0_0/0.55),inset_0_3px_6px_rgb(255_255_255/0.12)]"
                style={{ background: "radial-gradient(circle at 32% 26%, #5a6052 0%, #2a2d27 38%, #141612 72%, #070806 100%)" }}
                animate={{ scale: hover ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >
                {/* Rejilla del parlante */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                  {GRILLE.map((g) => (
                    <motion.circle
                      key={g.i}
                      cx={g.x}
                      cy={g.y}
                      r={2.6}
                      fill="var(--color-lime)"
                      initial={{ opacity: 0.35 }}
                      animate={hover ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.35 }}
                      transition={hover ? { duration: 0.6, repeat: Infinity, delay: (g.i % 6) * 0.08 } : { duration: 0.3 }}
                    />
                  ))}
                </svg>
                {/* Brillo especular */}
                <span className="absolute left-[18%] top-[12%] h-[28%] w-[40%] rounded-full bg-white/15 blur-[2px]" />
                {/* Ícono */}
                <span className="absolute inset-0 flex items-center justify-center text-lime">
                  <WhatsAppGlyph className="h-7 w-7 drop-shadow-[0_0_6px_rgb(204_214_37/0.6)] sm:h-8 sm:w-8" />
                </span>
              </motion.span>

              {/* LED de estado */}
              <motion.span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-paper bg-lime"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
