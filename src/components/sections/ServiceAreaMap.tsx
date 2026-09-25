import copy from '@content/copy.config';

// The Front Range service region, from Aspen in the west to Denver's eastern suburbs.
const BOUNDS = { west: -107.2, east: -104.5, north: 40.35, south: 38.95 };
const W = 320;
// Longitude degrees are ~0.77 the length of latitude degrees at 39.6N.
const H = Math.round(W * ((BOUNDS.north - BOUNDS.south) / ((BOUNDS.east - BOUNDS.west) * 0.77)));

// Approximate real positions of each service area.
const AREAS: { name: string; lat: number; lon: number }[] = [
  { name: 'Denver', lat: 39.74, lon: -104.99 },
  { name: 'Boulder', lat: 40.01, lon: -105.27 },
  { name: 'Cherry Hills Village', lat: 39.64, lon: -104.95 },
  { name: 'Greenwood Village', lat: 39.62, lon: -104.9 },
  { name: 'Centennial', lat: 39.58, lon: -104.85 },
  { name: 'Aspen', lat: 39.19, lon: -106.82 },
  { name: 'Vail', lat: 39.64, lon: -106.37 },
];

// The I-70 mountain corridor that links the Denver Metro to the mountain communities (approximate).
const CORRIDOR: [number, number][] = [
  [39.74, -104.99],
  [39.73, -105.2],
  [39.74, -105.51],
  [39.68, -105.9],
  [39.63, -106.07],
  [39.58, -106.2],
  [39.64, -106.37],
  [39.63, -106.6],
  [39.58, -106.95],
  [39.55, -107.2],
];

const x = (lon: number) => ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
const y = (lat: number) => ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;

/** Static single-stroke line art: region frame, the mountain corridor, a dot per service area. */
export function ServiceAreaMap() {
  const corridor = CORRIDOR.map(([lat, lon], i) => `${i ? 'L' : 'M'}${x(lon).toFixed(1)} ${y(lat).toFixed(1)}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="h-auto w-full max-w-[320px]"
      role="img"
      aria-label={copy.contact.mapLabel}
    >
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="#1A1815" strokeWidth="1" />
      <path d={corridor} fill="none" stroke="#1A1815" strokeWidth="1" strokeLinejoin="round" />
      {AREAS.map((a) => (
        <circle key={a.name} cx={x(a.lon)} cy={y(a.lat)} r="3" fill="#7A6250" />
      ))}
    </svg>
  );
}
