"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { navigation } from "@/data/content";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > 480 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      menuButton.current?.focus();
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed inset-x-0 top-0 z-40 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-2 lg:pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] transition-[background-color,border-color] duration-300 ${
          solid || open ? "border-b border-line bg-paper/95 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="shell grid h-18 grid-cols-[1fr_auto] items-center gap-6 xl:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="relative z-50 shrink-0 justify-self-start" aria-label="SALHEN, ir al inicio" onClick={() => setOpen(false)}>
            <Logo className="h-8 sm:h-10" priority />
          </Link>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-[0.95rem] text-ink-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-lime after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="hidden sm:block">
              <ButtonLink href="/#cotizar" variant="lime" className="min-h-11 px-5 text-[0.95rem]">
                Solicitar cotización
              </ButtonLink>
            </div>
            <button
              ref={menuButton}
              type="button"
              className="relative z-50 flex min-h-11 items-center gap-3 px-1 xl:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="label text-ink">{open ? "Cerrar" : "Menú"}</span>
              <span aria-hidden="true" className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            {/* Fondo atenuado: tocarlo cierra el menú */}
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-30 bg-ink/45 backdrop-blur-[2px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel compacto bajo la cabecera: enlaces en una grilla simétrica de 2 × 3 */}
            <motion.div
              id="menu-movil"
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
              className="blueprint fixed inset-x-4 z-40 max-h-[calc(100dvh-7rem)] overflow-y-auto border border-ink/80 bg-paper p-4 shadow-[0_24px_48px_-20px_rgb(0_0_0/0.5)] sm:inset-x-auto sm:right-6 sm:w-[26rem] xl:hidden"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 5.75rem)" }}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              <nav aria-label="Menú móvil" className="flex flex-col gap-4">
                <ul className="grid grid-cols-2 gap-2">
                  {navigation.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.035, duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex h-full min-h-[4.25rem] flex-col justify-between gap-1 border border-line bg-paper/90 px-3 py-2.5 transition-colors hover:border-ink active:bg-lime"
                      >
                        <span className="label text-[0.65rem] text-olive-ink">0{i + 1}</span>
                        <span className="font-display text-[1.05rem] font-semibold uppercase leading-tight tracking-wide text-ink">
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-col gap-3"
                >
                  <ButtonLink href="/#cotizar" variant="lime" onClick={() => setOpen(false)} className="w-full justify-center">
                    Solicitar cotización
                  </ButtonLink>
                  <p className="label text-center text-[0.65rem] text-ink-2">Cobertura · {siteConfig.coverage.join(" · ")}</p>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
