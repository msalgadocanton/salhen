"use client";

import type { ReactNode } from "react";
import { motion, type Easing } from "motion/react";
import {
  COLS,
  CYCLE,
  FLOORS,
  FLOOR_H,
  GROUND,
  LEFT,
  RIGHT,
  TOP,
  WIN_H,
  WIN_W,
  floorTop,
  winX,
  winY,
} from "./heroGeometry";

// Efectos por servicio sobre el croquis del hero. Cada efecto dura un ciclo (CYCLE) y se repite
// mientras el servicio está seleccionado; con movimiento reducido corre una sola vez.
// Cada servicio puede dibujar en tres capas: "ground" (se mueve con el terreno), "under" (bajo el
// trazado del edificio) y "over" (sobre él).

type Ctx = { rep: number };
type Layer = (ctx: Ctx) => ReactNode;
type Effect = { ground?: Layer; under?: Layer; over?: Layer };

const loop = (rep: number, times: number[], ease: Easing = "linear") => ({ duration: CYCLE, times, ease, repeat: rep });
const mono = { fontFamily: "var(--font-mono)", letterSpacing: "0.08em" } as const;

function Tag({ x, y, text, from, rep }: { x: number; y: number; text: string; from: number; rep: number }) {
  return (
    <motion.text
      x={x}
      y={y}
      {...mono}
      fontSize="10"
      fontWeight="600"
      fill="var(--color-olive-ink)"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0] }}
      transition={loop(rep, [0, from, from + 0.04, 0.92, 1])}
    >
      {text}
    </motion.text>
  );
}

/* S-01 · Electricidad: un punto sale del tablero, sube por la montante y va energizando cada piso. */
const RX = 221; // montante, entre la primera y la segunda columna de ventanas
const R_START = 451;
const R_END = TOP + 6;
const R_H0 = 0.04;
const R_H1 = 0.5;
const riserTime = (y: number) => R_H0 + ((R_START - y) / (R_START - R_END)) * (R_H1 - R_H0);
const riserLen = RX - 200 + (R_START - R_END);

const electric: Effect = {
  under: ({ rep }) => (
    <g>
      {Array.from({ length: FLOORS }, (_, fi) => {
        const by = floorTop(fi) + 5;
        const t = riserTime(by);
        return (
          <g key={fi}>
            {[`M${RX} ${by} H${RIGHT - 8}`, `M${RX} ${by} H${LEFT + 8}`].map((dd) => (
              <motion.path
                key={dd}
                d={dd}
                fill="none"
                stroke="var(--color-olive)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 0, 1, 1, 0] }}
                transition={loop(rep, [0, t, t + 0.08, 0.92, 1])}
              />
            ))}
            {Array.from({ length: COLS }, (_, ci) => (
              <motion.rect
                key={ci}
                x={winX(ci)}
                y={winY(fi)}
                width={WIN_W}
                height={WIN_H}
                fill="var(--color-lime)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.85, 0.85, 0] }}
                transition={loop(rep, [0, t + 0.03 + Math.abs(ci - 1) * 0.015, t + 0.08 + Math.abs(ci - 1) * 0.015, 0.92, 1])}
              />
            ))}
          </g>
        );
      })}
      <motion.rect
        x={172}
        y={440}
        width={28}
        height={22}
        fill="var(--color-lime)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 0.6, 0] }}
        transition={loop(rep, [0, 0.03, 0.15, 0.92, 1])}
      />
    </g>
  ),
  over: ({ rep }) => (
    <g>
      <motion.path
        d={`M200 ${R_START} H${RX} V${R_END}`}
        fill="none"
        stroke="var(--color-olive)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, (RX - 200) / riserLen, 1, 1, 0] }}
        transition={loop(rep, [0, R_H0, R_H1, 0.92, 1])}
      />
      {/* Chispas que recorren cada ramal al energizarse */}
      {Array.from({ length: FLOORS }, (_, fi) => {
        const by = floorTop(fi) + 5;
        const t = riserTime(by);
        return (
          <motion.circle
            key={fi}
            cy={by}
            r={2.5}
            fill="var(--color-olive-ink)"
            initial={{ cx: RX, opacity: 0 }}
            animate={{ cx: [RX, RX, RIGHT - 8, RIGHT - 8], opacity: [0, 0, 1, 0, 0] }}
            transition={{
              cx: loop(rep, [0, t, t + 0.08, 1]),
              opacity: loop(rep, [0, t, t + 0.02, t + 0.08, 1]),
            }}
          />
        );
      })}
      {/* Punto principal con halo */}
      {[
        { r: 11, fill: "var(--color-lime)", opacity: 0.45 },
        { r: 4.5, fill: "var(--color-lime)", opacity: 1 },
      ].map((c) => (
        <motion.circle
          key={c.r}
          r={c.r}
          fill={c.fill}
          stroke={c.r < 6 ? "var(--color-ink)" : "none"}
          strokeWidth="1.25"
          initial={{ cx: 200, cy: R_START, opacity: 0 }}
          animate={{ cx: [200, RX, RX, RX], cy: [R_START, R_START, R_END, R_END], opacity: [c.opacity, c.opacity, c.opacity, 0, 0] }}
          transition={{
            cx: loop(rep, [0, R_H0, R_H1, 1]),
            cy: loop(rep, [0, R_H0, R_H1, 1], "easeIn"),
            opacity: loop(rep, [0, R_H0, R_H1, R_H1 + 0.05, 1]),
          }}
        />
      ))}
      <Tag x={RX + 8} y={R_END + 12} text="CIRCUITOS OK" from={R_H1} rep={rep} />
    </g>
  ),
};

/* S-02 · Techumbres: lluvia sobre la cubierta, se tiende la membrana y el agua baja por la canaleta. */
const RAIN_X = [160, 178, 285, 305, 325, 345, 420, 440];
const ROOF_Y = 56;

const roof: Effect = {
  under: ({ rep }) => (
    <g>
      <motion.rect
        x={LEFT - 6}
        y={ROOF_Y}
        width={RIGHT - LEFT + 12}
        height={14}
        fill="var(--color-lime)"
        style={{ originX: 0 }}
        initial={{ scaleX: 0, opacity: 0.75 }}
        animate={{ scaleX: [0, 0, 1, 1, 1], opacity: [0.75, 0.75, 0.75, 0.75, 0] }}
        transition={loop(rep, [0, 0.08, 0.5, 0.92, 1])}
      />
    </g>
  ),
  over: ({ rep }) => (
    <g>
      {/* Rodillo que tiende la membrana */}
      <motion.g
        initial={{ x: LEFT - 6, opacity: 0 }}
        animate={{ x: [LEFT - 6, LEFT - 6, RIGHT + 6, RIGHT + 6], opacity: [0, 1, 1, 0, 0] }}
        transition={{ x: loop(rep, [0, 0.08, 0.5, 1], "easeInOut"), opacity: loop(rep, [0, 0.08, 0.5, 0.54, 1]) }}
      >
        <rect x={-4} y={ROOF_Y - 6} width={8} height={22} fill="var(--color-olive)" stroke="var(--color-ink)" strokeWidth="1" />
        <path d={`M0 ${ROOF_Y - 6} l-14 -16`} stroke="var(--color-ink)" strokeWidth="1.5" />
      </motion.g>
      {/* Lluvia: las gotas chocan con la cubierta */}
      {RAIN_X.map((x, i) => (
        <g key={x}>
          <motion.path
            d={`M${x} 14 v14`}
            stroke="var(--color-olive)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, ROOF_Y - 29, ROOF_Y - 29], opacity: [0, 1, 1, 0] }}
            transition={{
              y: { duration: 0.8, times: [0, 0.7, 1], ease: "easeIn", repeat: rep === 0 ? 5 : rep, delay: i * 0.11 },
              opacity: { duration: 0.8, times: [0, 0.1, 0.7, 0.71], repeat: rep === 0 ? 5 : rep, delay: i * 0.11 },
            }}
          />
          <motion.ellipse
            cx={x}
            cy={ROOF_Y}
            fill="none"
            stroke="var(--color-olive)"
            strokeWidth="1.5"
            initial={{ rx: 0, ry: 0, opacity: 0 }}
            animate={{ rx: [0, 0, 12], ry: [0, 0, 3.5], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.7, 1], repeat: rep === 0 ? 5 : rep, delay: i * 0.11 }}
          />
        </g>
      ))}
      {/* Canaleta y bajada: el agua se evacua una vez sellada la cubierta */}
      <motion.path
        d={`M${LEFT - 10} ${TOP - 4} V${GROUND}`}
        fill="none"
        stroke="var(--color-olive)"
        strokeWidth="2"
        strokeDasharray="4 8"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0], strokeDashoffset: [0, -CYCLE * 30] }}
        transition={{ opacity: loop(rep, [0, 0.5, 0.55, 0.92, 1]), strokeDashoffset: { duration: CYCLE, ease: "linear", repeat: rep } }}
      />
      <Tag x={285} y={42} text="SELLADO ✓" from={0.5} rep={rep} />
    </g>
  ),
};

/* S-03 · Soldadura: se arma una marquesina metálica sobre el acceso y el cordón avanza con chispas. */
const BEAM_Y = 436;
const BEAM_X0 = 258;
const BEAM_X1 = 342;
const SPARKS = Array.from({ length: 18 }, (_, i) => {
  const a = (-170 + (i * 160) / 17) * (Math.PI / 180);
  const v = 26 + (i % 3) * 12;
  return { dx: Math.cos(a) * v, dy: Math.sin(a) * v, fall: 18 + (i % 4) * 8, delay: (i % 6) * 0.06 };
});

const welding: Effect = {
  over: ({ rep }) => (
    <g>
      <motion.path
        d={`M${BEAM_X0} ${BEAM_Y} H${BEAM_X1} M${BEAM_X0 + 4} ${BEAM_Y} L${BEAM_X0 + 20} ${BEAM_Y - 14} M${BEAM_X1 - 4} ${BEAM_Y} L${BEAM_X1 - 20} ${BEAM_Y - 14}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={loop(rep, [0, 0.12, 0.92, 1])}
      />
      <motion.path
        d={`M${BEAM_X0} ${BEAM_Y - 2.5} H${BEAM_X1}`}
        fill="none"
        stroke="var(--color-lime)"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1, 0] }}
        transition={loop(rep, [0, 0.15, 0.75, 0.92, 1])}
      />
      <motion.g
        initial={{ x: BEAM_X0, opacity: 0 }}
        animate={{ x: [BEAM_X0, BEAM_X0, BEAM_X1, BEAM_X1], opacity: [0, 1, 1, 0, 0] }}
        transition={{ x: loop(rep, [0, 0.15, 0.75, 1]), opacity: loop(rep, [0, 0.15, 0.75, 0.78, 1]) }}
      >
        <motion.circle
          cx={0}
          cy={BEAM_Y - 2.5}
          r={22}
          fill="var(--color-lime)"
          animate={{ opacity: [0.25, 0.85, 0.4, 0.9, 0.3] }}
          transition={{ duration: 0.35, repeat: rep === 0 ? 12 : rep }}
        />
        <circle cx={0} cy={BEAM_Y - 2.5} r={4} fill="var(--color-paper)" stroke="var(--color-olive-ink)" strokeWidth="1.25" />
        {/* Soldador: careta y antorcha */}
        <path d={`M-2 ${BEAM_Y - 6} l-10 -16 h-8`} fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x={-34} y={BEAM_Y - 34} width={14} height={16} fill="var(--color-ink)" />
        <rect x={-31} y={BEAM_Y - 30} width={8} height={4} fill="var(--color-lime)" />
        {SPARKS.map((s, i) => (
          <motion.circle
            key={i}
            cx={0}
            cy={BEAM_Y - 2.5}
            r={i % 3 ? 2.4 : 3.2}
            fill={i % 2 ? "var(--color-olive)" : "var(--color-lime)"}
            stroke="var(--color-ink)"
            strokeWidth="0.4"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: [0, s.dx, s.dx * 1.3], y: [0, s.dy, s.dy + s.fall], opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, ease: "easeOut", repeat: rep === 0 ? 8 : rep, delay: s.delay }}
          />
        ))}
      </motion.g>
      <Tag x={RIGHT + 12} y={BEAM_Y + 4} text="MARQUESINA" from={0.75} rep={rep} />
    </g>
  ),
};

/* S-04 · Gasfitería: la matriz se llena, aparece una filtración en un piso y queda reparada. */
const PX = 162;
const LEAK_Y = floorTop(4) + 20;

const plumbing: Effect = {
  over: ({ rep }) => (
    <g>
      <motion.path
        d={`M${PX} ${GROUND} V${TOP + 8}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={loop(rep, [0, 0.2, 0.92, 1])}
      />
      <motion.path
        d={`M${PX} ${GROUND} V${TOP + 8}`}
        fill="none"
        stroke="var(--color-lime)"
        strokeWidth="3.5"
        strokeDasharray="6 7"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0], strokeDashoffset: [0, CYCLE * 26] }}
        transition={{ opacity: loop(rep, [0, 0.2, 0.24, 0.92, 1]), strokeDashoffset: { duration: CYCLE, ease: "linear", repeat: rep } }}
      />
      {/* Arranques en cada piso */}
      {Array.from({ length: FLOORS }, (_, fi) => {
        const t = 0.2 - (fi / FLOORS) * 0.16;
        return (
          <motion.path
            key={fi}
            d={`M${PX} ${floorTop(fi) + 30} h9 v-5`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={loop(rep, [0, t, t + 0.03, 0.92, 1])}
          />
        );
      })}
      {/* Filtración: gotas que dejan de caer cuando se instala la abrazadera */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
        transition={loop(rep, [0, 0.28, 0.3, 0.56, 0.58, 1])}
      >
        {[0, 1, 2, 3].map((k) => (
          <motion.circle
            key={k}
            cx={PX + 4}
            cy={LEAK_Y}
            r={3}
            fill="var(--color-olive)"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: [0, 6 + k * 3, 10 + k * 4], y: [0, 14, 38], opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, ease: "easeIn", repeat: rep === 0 ? 3 : rep, delay: k * 0.17 }}
          />
        ))}
        <motion.circle
          cx={PX}
          cy={LEAK_Y}
          fill="none"
          stroke="var(--color-olive)"
          strokeWidth="1.5"
          animate={{ r: [5, 18], opacity: [0.9, 0] }}
          transition={{ duration: 0.9, repeat: rep === 0 ? 3 : rep }}
        />
      </motion.g>
      <motion.rect
        x={PX - 8}
        y={LEAK_Y - 9}
        width={16}
        height={18}
        fill="var(--color-lime)"
        stroke="var(--color-ink)"
        strokeWidth="1.25"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={loop(rep, [0, 0.56, 0.6, 0.92, 1])}
      />
      <Tag x={LEFT - 92} y={LEAK_Y + 4} text="REPARADO" from={0.6} rep={rep} />
    </g>
  ),
};

/* S-05 · Pintura: un andamio colgante baja por la fachada y la deja pintada, piso a piso. */
const PAINT_T0 = 0.08;
const PAINT_T1 = 0.75;

const painting: Effect = {
  under: ({ rep }) => (
    <g>
      <defs>
        <clipPath id="hero-paint-clip">
          <motion.rect
            x={LEFT - 10}
            y={TOP}
            width={RIGHT - LEFT + 20}
            height={GROUND - TOP}
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 0, 1, 1] }}
            transition={loop(rep, [0, PAINT_T0, PAINT_T1, 1], "easeInOut")}
          />
        </clipPath>
        <pattern id="hero-paint-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V8" stroke="var(--color-olive)" strokeWidth="1" strokeOpacity="0.35" />
        </pattern>
      </defs>
      <motion.g
        clipPath="url(#hero-paint-clip)"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={loop(rep, [0, 0.92, 1])}
      >
        <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={GROUND - TOP} fill="var(--color-lime)" fillOpacity="0.55" />
        <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={GROUND - TOP} fill="url(#hero-paint-hatch)" />
        {/* Las ventanas no se pintan */}
        {Array.from({ length: FLOORS }, (_, fi) =>
          Array.from({ length: COLS }, (_, ci) => (
            <rect key={`${fi}-${ci}`} x={winX(ci)} y={winY(fi)} width={WIN_W} height={WIN_H} fill="var(--color-paper)" />
          )),
        )}
        <path d={`M278 ${GROUND} v-32 h44 v32 z`} fill="var(--color-paper)" />
      </motion.g>
    </g>
  ),
  over: ({ rep }) => {
    const ys = [TOP - 8, TOP - 8, GROUND - 8, GROUND - 8];
    const times = [0, PAINT_T0, PAINT_T1, 1];
    const fade = { opacity: [0, 1, 1, 0, 0] };
    const fadeT = loop(rep, [0, PAINT_T0, PAINT_T1, PAINT_T1 + 0.05, 1]);
    return (
      <g>
        {[LEFT + 14, RIGHT - 14].map((x) => (
          <motion.line
            key={x}
            x1={x}
            x2={x}
            y1={TOP - 10}
            stroke="var(--color-ink)"
            strokeWidth="0.9"
            initial={{ y2: TOP - 8, opacity: 0 }}
            animate={{ y2: ys, ...fade }}
            transition={{ y2: loop(rep, times, "easeInOut"), opacity: fadeT }}
          />
        ))}
        <motion.g
          initial={{ y: TOP - 8, opacity: 0 }}
          animate={{ y: ys, ...fade }}
          transition={{ y: loop(rep, times, "easeInOut"), opacity: fadeT }}
        >
          <rect x={LEFT - 8} y={0} width={RIGHT - LEFT + 16} height={7} fill="var(--color-olive)" stroke="var(--color-ink)" strokeWidth="1" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <motion.ellipse
              key={k}
              cx={LEFT + 20 + k * 52}
              cy={10}
              rx={2}
              initial={{ ry: 2 }}
              animate={{ ry: [2, 4.5, 2] }}
              transition={{ duration: 0.9, repeat: rep === 0 ? 5 : rep, delay: k * 0.13 }}
              fill="var(--color-lime)"
              stroke="var(--color-olive-ink)"
              strokeWidth="0.6"
            />
          ))}
        </motion.g>
      </g>
    );
  },
};

/* S-06 · Obras menores: se levanta una jardinera de albañilería junto al acceso. */
const BRICK_W = 26;
const BRICK_H = 12;
const BRICK_ROWS = 5;
const BRICKS = Array.from({ length: BRICK_ROWS }, (_, row) =>
  Array.from({ length: row % 2 ? 4 : 5 }, (_, k) => ({ x: 476 + (row % 2 ? BRICK_W / 2 : 0) + k * BRICK_W, y: GROUND - (row + 1) * BRICK_H })),
).flat();

const civil: Effect = {
  ground: ({ rep }) => (
    <g>
      {BRICKS.map((b, i) => {
        const t = 0.05 + (i / BRICKS.length) * 0.6;
        return (
          <motion.rect
            key={i}
            x={b.x}
            width={BRICK_W - 1.5}
            height={BRICK_H - 1.5}
            fill="var(--color-paper-2)"
            stroke="var(--color-ink)"
            strokeWidth="0.9"
            initial={{ attrY: b.y - 18, opacity: 0 }}
            animate={{ attrY: [b.y - 18, b.y - 18, b.y, b.y], opacity: [0, 0, 1, 1, 0] }}
            transition={{ attrY: loop(rep, [0, t, t + 0.04, 1], "easeIn"), opacity: loop(rep, [0, t, t + 0.02, 0.92, 1]) }}
          />
        );
      })}
      <motion.path
        d={`M470 ${GROUND - BRICK_ROWS * BRICK_H - 5} H612`}
        stroke="var(--color-olive)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1, 0] }}
        transition={loop(rep, [0, 0.66, 0.74, 0.92, 1])}
      />
      <Tag x={476} y={GROUND - BRICK_ROWS * BRICK_H - 14} text="NIVELADO ✓" from={0.74} rep={rep} />
    </g>
  ),
};

/* S-07 · Piscinas: la piscina se llena y el agua queda en movimiento. */
const POOL = { x0: 482, x1: 610, top: GROUND, bottom: GROUND + 30 };
const WAVE = Array.from({ length: 14 }, (_, i) => `q10 ${i % 2 ? 4 : -4} 20 0`).join(" ");

const pool: Effect = {
  ground: ({ rep }) => (
    <g>
      <defs>
        <clipPath id="hero-pool-clip">
          <motion.rect
            x={POOL.x0 + 1}
            width={POOL.x1 - POOL.x0 - 2}
            height={POOL.bottom - POOL.top}
            initial={{ attrY: POOL.bottom }}
            animate={{ attrY: [POOL.bottom, POOL.bottom, POOL.top + 4, POOL.top + 4] }}
            transition={loop(rep, [0, 0.1, 0.45, 1], "easeOut")}
          />
        </clipPath>
      </defs>
      <rect x={POOL.x0} y={POOL.top} width={POOL.x1 - POOL.x0} height={POOL.bottom - POOL.top + 2} fill="var(--color-paper)" />
      <motion.g clipPath="url(#hero-pool-clip)" initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={loop(rep, [0, 0.92, 1])}>
        <motion.path
          d={`M${POOL.x0 - 40} ${POOL.top + 6} ${WAVE} V${POOL.bottom} H${POOL.x0 - 40} Z`}
          fill="var(--color-lime)"
          fillOpacity="0.6"
          animate={{ x: [0, -40] }}
          transition={{ duration: 1.6, ease: "linear", repeat: rep === 0 ? 3 : rep }}
        />
      </motion.g>
      <path d={`M${POOL.x0} ${POOL.top} V${POOL.bottom} H${POOL.x1} V${POOL.top}`} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
      <path d={`M${POOL.x1 - 12} ${POOL.top - 14} v${POOL.bottom - POOL.top + 4} M${POOL.x1 - 4} ${POOL.top - 14} v18 M${POOL.x1 - 12} ${POOL.top - 6} h8`} stroke="var(--color-ink)" strokeWidth="1" />
      {[0, 1].map((k) => (
        <motion.ellipse
          key={k}
          cx={530 + k * 36}
          cy={POOL.top + 6}
          fill="none"
          stroke="var(--color-olive-ink)"
          strokeWidth="0.8"
          initial={{ rx: 0, ry: 0, opacity: 0 }}
          animate={{ rx: [0, 14], ry: [0, 3], opacity: [0.9, 0] }}
          transition={{ duration: 0.7, repeat: rep === 0 ? 3 : rep, delay: CYCLE * 0.45 + k * 0.25 }}
        />
      ))}
      <Tag x={POOL.x0} y={POOL.top - 8} text="PISCINA" from={0.1} rep={rep} />
    </g>
  ),
};

/* S-08 · Mantención general: una banda de inspección recorre los pisos y deja cada uno revisado. */
const SCAN_T1 = 0.8;
const BANDS = FLOORS + 1; // incluye el primer piso
const scanTime = (fi: number) => 0.04 + ((BANDS - 1 - fi) / (BANDS - 1)) * (SCAN_T1 - 0.04);

const maintenance: Effect = {
  under: ({ rep }) => (
    <motion.g
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [0, 0, -(GROUND - FLOOR_H - TOP), -(GROUND - FLOOR_H - TOP)], opacity: [0, 1, 1, 0, 0] }}
      transition={{ y: loop(rep, [0, 0.04, SCAN_T1, 1], "easeInOut"), opacity: loop(rep, [0, 0.04, SCAN_T1, SCAN_T1 + 0.05, 1]) }}
    >
      <rect x={LEFT} y={GROUND - FLOOR_H} width={RIGHT - LEFT} height={FLOOR_H} fill="var(--color-lime)" fillOpacity="0.4" />
      <rect x={LEFT - 18} y={GROUND - FLOOR_H - 3} width={RIGHT - LEFT + 36} height={6} fill="var(--color-lime)" fillOpacity="0.5" />
      <path d={`M${LEFT - 18} ${GROUND - FLOOR_H} H${RIGHT + 18}`} stroke="var(--color-olive)" strokeWidth="2.5" />
    </motion.g>
  ),
  over: ({ rep }) => (
    <g>
      {Array.from({ length: BANDS }, (_, fi) => {
        const t = scanTime(fi) + 0.03;
        const cy = floorTop(fi) + FLOOR_H / 2;
        return (
          <motion.path
            key={fi}
            d={`M${LEFT + 6} ${cy} l4 4 l8 -9`}
            fill="none"
            stroke="var(--color-olive-ink)"
            strokeWidth="2.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0, 1, 1, 0] }}
            transition={loop(rep, [0, t, t + 0.04, 0.92, 1])}
          />
        );
      })}
    </g>
  ),
};

export const serviceEffects: Record<string, Effect> = {
  "S-01": electric,
  "S-02": roof,
  "S-03": welding,
  "S-04": plumbing,
  "S-05": painting,
  "S-06": civil,
  "S-07": pool,
  "S-08": maintenance,
};
