export type Pt = readonly [number, number];

/**
 * A closed, gently irregular ring: the building block of the decorative topographic
 * contours. The wobble is a fixed sum of sines, so the same seed always draws the same line.
 */
export function contourRing([cx, cy]: Pt, r: number, seed: number, stretch = 1): string {
  let d = '';
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const k =
      1 +
      0.09 * Math.sin(3 * t + seed) +
      0.05 * Math.sin(5 * t + seed * 1.7) +
      0.03 * Math.sin(8 * t + seed * 2.3);
    const x = cx + Math.cos(t) * r * k * stretch;
    const y = cy + Math.sin(t) * r * k;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d + 'Z';
}
