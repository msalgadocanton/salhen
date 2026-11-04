// Medidas del croquis del hero, compartidas por el dibujo y los efectos de cada servicio.
export const FLOORS = 9; // pisos con ventanas, sobre el primer piso
export const FLOOR_H = 40;
export const TOP = 70;
export const GROUND = TOP + FLOORS * FLOOR_H + 40; // 470
export const LEFT = 150;
export const RIGHT = 450;
export const COLS = 5;
export const WIN_W = 42;
export const WIN_H = 22;
export const LEVEL_M = 2.7; // altura de piso de referencia, para la lectura en metros

export const floorTop = (fi: number) => TOP + fi * FLOOR_H;
export const winX = (ci: number) => LEFT + 24 + ci * 52;
export const winY = (fi: number) => floorTop(fi) + 10;

// Duración de un ciclo de efecto: también es el tiempo que cada servicio queda en pantalla en
// el recorrido automático.
export const CYCLE = 2;
