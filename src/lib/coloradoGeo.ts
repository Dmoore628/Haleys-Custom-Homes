/**
 * Geometry for the bespoke service-area map. Colorado is bounded by lines of latitude and
 * longitude (37°N to 41°N, 109.05°W to 102.05°W), so in an equirectangular projection it is an
 * exact rectangle: the most recognizable state outline there is. Everything is projected into
 * one SVG coordinate space; the map component positions its HTML labels by percentage of it.
 */

export type LngLat = readonly [number, number];
export type XY = readonly [number, number];

const W_LNG = -109.05;
const E_LNG = -102.05;
const S_LAT = 37;
const N_LAT = 41;
/** Longitude is shortened by cos(latitude) at the state's middle parallel, 39°N. */
const K = Math.cos((39 * Math.PI) / 180);

export const STATE_W = 800;
export const STATE_H = (STATE_W * (N_LAT - S_LAT)) / ((E_LNG - W_LNG) * K);
/** Margin around the state for the neighboring-state names and graticule labels. */
export const PAD_X = 56;
export const PAD_Y = 48;
export const VIEW_W = STATE_W + PAD_X * 2;
export const VIEW_H = Math.round(STATE_H + PAD_Y * 2);

export function project([lng, lat]: LngLat): XY {
  return [
    PAD_X + ((lng - W_LNG) / (E_LNG - W_LNG)) * STATE_W,
    PAD_Y + ((N_LAT - lat) / (N_LAT - S_LAT)) * STATE_H,
  ];
}

/** Statute miles in SVG units at 39°N: one degree of latitude is ~69.05 miles. */
export const unitsPerMile = STATE_H / (N_LAT - S_LAT) / 69.05;

// Detail lens: the Denver Metro communities sit within ~10 miles of each other, too close to
// separate at state scale, so a magnified circle shows them.
export const LENS_CENTER: LngLat = [-104.935, 39.66];
export const LENS_R = 155;
export const LENS_AT: XY = [PAD_X + 634, PAD_Y + 420];
const LENS_SCALE = 1000; // SVG units per degree of latitude inside the lens

export function projectLens([lng, lat]: LngLat): XY {
  return [
    LENS_AT[0] + (lng - LENS_CENTER[0]) * K * LENS_SCALE,
    LENS_AT[1] - (lat - LENS_CENTER[1]) * LENS_SCALE,
  ];
}

/** The two tangent lines from a point to the lens circle, for the magnifier connector. */
export function lensTangents(from: XY, inset = 0): [XY, XY][] {
  const [cx, cy] = LENS_AT;
  const dx = from[0] - cx;
  const dy = from[1] - cy;
  const d = Math.hypot(dx, dy);
  const base = Math.atan2(dy, dx);
  const off = Math.acos(LENS_R / d);
  const start = (a: number): XY => [from[0] - Math.cos(a) * inset, from[1] - Math.sin(a) * inset];
  return [base - off, base + off].map((a) => {
    const t: XY = [cx + LENS_R * Math.cos(a), cy + LENS_R * Math.sin(a)];
    const dir = Math.atan2(from[1] - t[1], from[0] - t[0]);
    return [start(dir), t] as [XY, XY];
  });
}

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(pts: XY[], tension = 0.5): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: XY = [
      p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2,
      p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2,
    ];
    const c2: XY = [
      p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2,
      p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2,
    ];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export const polyPath = (pts: XY[]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ' Z';

/** A gentle arc from a to b, bowed to the left of travel by `lift` of its length. */
export function arcPath(a: XY, b: XY, lift = 0.22): string {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: XY = [mx + dy * lift, my - dx * lift];
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

// Generalized geography (simplified traces; this is an editorial map, not a survey).

/** The Continental Divide's path through Colorado, north to south. */
export const CONTINENTAL_DIVIDE: LngLat[] = [
  [-106.86, 41.0],
  [-106.72, 40.72],
  [-106.68, 40.38],
  [-106.2, 40.42],
  [-105.9, 40.47],
  [-105.68, 40.33],
  [-105.64, 40.1],
  [-105.69, 39.86],
  [-105.78, 39.8],
  [-105.88, 39.66],
  [-106.06, 39.36],
  [-106.31, 39.36],
  [-106.56, 39.11],
  [-106.41, 38.83],
  [-106.33, 38.5],
  [-106.25, 38.39],
  [-106.72, 38.16],
  [-106.95, 37.97],
  [-107.3, 37.9],
  [-107.54, 37.8],
  [-107.1, 37.55],
  [-106.8, 37.48],
  [-106.6, 37.25],
  [-106.47, 37.0],
];

/** Interstate 70, Utah line to Kansas line. */
export const I70: LngLat[] = [
  [-109.05, 39.13],
  [-108.55, 39.07],
  [-108.1, 39.25],
  [-107.32, 39.55],
  [-106.82, 39.64],
  [-106.37, 39.64],
  [-106.1, 39.57],
  [-105.93, 39.68],
  [-105.51, 39.74],
  [-105.2, 39.72],
  [-104.99, 39.77],
  [-104.7, 39.74],
  [-104.2, 39.62],
  [-103.69, 39.26],
  [-103.0, 39.3],
  [-102.05, 39.3],
];

/** Interstate 25, Wyoming line to New Mexico line. */
export const I25: LngLat[] = [
  [-104.82, 41.0],
  [-104.98, 40.58],
  [-104.98, 40.1],
  [-104.99, 39.74],
  [-104.88, 39.5],
  [-104.82, 38.83],
  [-104.61, 38.25],
  [-104.68, 37.7],
  [-104.5, 37.17],
  [-104.44, 37.0],
];

/** The Rocky Mountain region, drawn with a denser dot field than the plains. */
export const MOUNTAINS: LngLat[] = [
  [-107.25, 41.0],
  [-105.3, 41.0],
  [-105.22, 40.35],
  [-105.26, 39.9],
  [-105.2, 39.5],
  [-105.02, 39.05],
  [-104.95, 38.7],
  [-105.1, 38.3],
  [-104.98, 37.8],
  [-104.9, 37.35],
  [-104.95, 37.0],
  [-108.4, 37.0],
  [-108.3, 37.6],
  [-108.0, 38.3],
  [-108.2, 39.0],
  [-107.9, 39.5],
  [-107.6, 40.0],
  [-107.4, 40.6],
];
