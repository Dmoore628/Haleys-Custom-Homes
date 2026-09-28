'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useId, useRef, useState, type CSSProperties } from 'react';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  CONTINENTAL_DIVIDE,
  I25,
  I70,
  LENS_AT,
  LENS_R,
  MOUNTAINS,
  PAD_X,
  PAD_Y,
  STATE_H,
  STATE_W,
  VIEW_H,
  VIEW_W,
  arcPath,
  lensTangents,
  polyPath,
  project,
  projectLens,
  smoothPath,
  unitsPerMile,
  type LngLat,
  type XY,
} from '@/lib/coloradoGeo';

const INK = '#1A1815';
const ACCENT = '#7A6250';
const BONE = '#EFE9DE';
const METRO = 'Denver Metro';
const OFFICE = 'office';

const { office, serviceAreas } = siteConfig;
const { contact } = copy;

type Area = (typeof serviceAreas)[number];
const ll = (a: { lng: number; lat: number }): LngLat => [a.lng, a.lat];

// Regions in the order the hero names them.
const regions = ['Denver Metro', 'Boulder', 'Vail', 'Aspen'] as const;
const metro = serviceAreas.filter((a) => a.region === METRO);
const outlying = regions
  .filter((r) => r !== METRO)
  .map((r) => serviceAreas.find((a) => a.region === r) as Area);

const officeXY = project(ll(office));
const metroXY = project([
  metro.reduce((s, a) => s + a.lng, 0) / metro.length,
  metro.reduce((s, a) => s + a.lat, 0) / metro.length,
]);
const METRO_RING = 15;

/** Where each HTML label sits relative to its point. */
const PLACEMENT: Record<string, 'left' | 'right' | 'above' | 'below'> = {
  Boulder: 'left',
  Vail: 'below',
  Aspen: 'below',
  Denver: 'right',
  'Cherry Hills Village': 'above',
  'Greenwood Village': 'below',
  Centennial: 'right',
  [OFFICE]: 'right',
};

const pct = ([x, y]: XY): CSSProperties => ({
  left: `${(x / VIEW_W) * 100}%`,
  top: `${(y / VIEW_H) * 100}%`,
});

const OFFSET: Record<string, string> = {
  left: 'translate(calc(-100% - 0.8em), -50%)',
  right: 'translate(0.8em, -50%)',
  above: 'translate(-50%, calc(-100% - 0.7em))',
  below: 'translate(-50%, 0.7em)',
};

function coords([lng, lat]: LngLat) {
  return `${lat.toFixed(2)}° N  ${Math.abs(lng).toFixed(2)}° W`;
}

/**
 * The service area, drawn from first principles as an editorial map of Colorado: the state's
 * unmistakable rectangle, a dot field that thickens over the Rockies, the Continental Divide,
 * I-70 and I-25 as hairlines, and arcs from the Greenwood Village office out to Boulder, Vail
 * and Aspen. The Denver Metro communities are too close to separate at state scale, so a
 * magnifier lens shows them.
 *
 * On first scroll into view it assembles in one choreographed pass (outline, terrain, roads,
 * divide, office, arcs, lens, labels) and resolves to a static map. Two quiet loops remain: a
 * pulse at the office and a glint travelling each arc. Hovering or focusing a place in the
 * legend or on the map highlights it and shows its coordinates. Reduced motion renders the
 * finished state with no loops.
 */
export function ServiceMap({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const play = reduced || inView;
  const [active, setActive] = useState<string | null>(null);
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;

  const activeArea = serviceAreas.find((a) => a.name === active);
  const activeRegion = active === OFFICE ? null : (activeArea?.region ?? active);
  const isLit = (region: string) => !active || activeRegion === region;
  const readout =
    active === OFFICE || !active
      ? coords(ll(office))
      : activeArea
        ? coords(ll(activeArea))
        : active === METRO
          ? coords([
              metro.reduce((s, a) => s + a.lng, 0) / metro.length,
              metro.reduce((s, a) => s + a.lat, 0) / metro.length,
            ])
          : '';
  const readoutName = !active || active === OFFICE ? contact.officeLabel : active;

  /** Framer props that draw a stroke in from nothing, then leave it static. */
  const draw = (delay: number, duration: number, opacity = 1) => ({
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity } : undefined,
    transition: reduced
      ? { duration: 0 }
      : {
          pathLength: { delay, duration, ease: EASE },
          opacity: { delay, duration: 0.2 },
        },
  });
  /** Opacity only, so it never overrides an element's own positioning transform. */
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: play ? { opacity: 1 } : undefined,
    transition: reduced ? { duration: 0 } : { delay, duration: 0.7, ease: EASE },
  });
  const pop = (delay: number) => ({
    initial: reduced ? false : { scale: 0, opacity: 0 },
    animate: play ? { scale: 1, opacity: 1 } : undefined,
    transition: reduced ? { duration: 0 } : { delay, duration: 0.6, ease: EASE },
    style: { transformBox: 'fill-box', transformOrigin: 'center' } as CSSProperties,
  });

  const T = { outline: 0, dots: 0.15, roads: 0.5, divide: 0.7, office: 1.0, arcs: 1.3, lens: 1.7 };
  const arcDelay = (i: number) => T.arcs + i * 0.18;
  const arcEnd = (i: number) => arcDelay(i) + 0.85;
  const lensIn = T.lens + 0.45;
  const labelsIn = 2.5;

  const x0 = PAD_X;
  const y0 = PAD_Y;
  const x1 = PAD_X + STATE_W;
  const y1 = PAD_Y + STATE_H;
  const tangents = lensTangents(metroXY, METRO_RING);
  const scaleLen = 50 * unitsPerMile;
  const Heading = headingLevel;

  const hover = (name: string | null) => ({
    onMouseEnter: () => setActive(name),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(name),
    onBlur: () => setActive(null),
  });

  return (
    // Re-mounted once the reduced-motion preference is known (after hydration), so the
    // drawing then renders finished from its first frame instead of from the start state.
    <div
      ref={ref}
      key={reduced ? 'still' : 'motion'}
      data-testid="service-map"
      className="@container"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
        <Heading id="service-area-heading" className="label">
          {contact.serviceAreaHeading}
        </Heading>
        <p
          className="label flex min-w-0 items-baseline gap-3 text-ink/70"
          aria-live="polite"
          data-testid="map-readout"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={readoutName}
              className="flex items-baseline gap-3 whitespace-nowrap"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <span className="hidden text-ink @md:inline">{readoutName}</span>
              <span className="tabular-nums tracking-[0.06em]">{readout}</span>
            </motion.span>
          </AnimatePresence>
        </p>
      </div>

      <div className="relative mt-4 w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label={contact.mapLabel}
        >
          <defs>
            <pattern id={id('plains')} width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="5.5" cy="5.5" r="1" fill={INK} opacity="0.16" />
            </pattern>
            <pattern id={id('peaks')} width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="5.5" cy="5.5" r="1.45" fill={INK} opacity="0.34" />
            </pattern>
            <pattern id={id('metro')} width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="3.5" cy="3.5" r="0.8" fill={INK} opacity="0.2" />
            </pattern>
            <clipPath id={id('state')}>
              <rect x={x0} y={y0} width={STATE_W} height={STATE_H} />
            </clipPath>
            <clipPath id={id('lens')}>
              <circle cx={LENS_AT[0]} cy={LENS_AT[1]} r={LENS_R} />
            </clipPath>
            {/* The terrain is uncovered by a circle growing out from the office. */}
            <mask id={id('reveal')} maskUnits="userSpaceOnUse">
              <motion.circle
                cx={officeXY[0]}
                cy={officeXY[1]}
                fill="white"
                initial={reduced ? false : { r: 0 }}
                animate={play ? { r: VIEW_W * 1.2 } : undefined}
                transition={{ delay: T.dots, duration: 2.2, ease: EASE }}
              />
            </mask>
            <mask id={id('divide')} maskUnits="userSpaceOnUse">
              <motion.path
                d={smoothPath(CONTINENTAL_DIVIDE.map(project))}
                stroke="white"
                strokeWidth="8"
                fill="none"
                {...draw(T.divide, 2)}
              />
            </mask>
          </defs>

          {/* Terrain: plains and mountains as dot fields of two densities. */}
          <g clipPath={`url(#${id('state')})`} mask={`url(#${id('reveal')})`}>
            <rect x={x0} y={y0} width={STATE_W} height={STATE_H} fill={`url(#${id('plains')})`} />
            <path d={polyPath(MOUNTAINS.map(project))} fill={BONE} stroke="none" />
            <path d={polyPath(MOUNTAINS.map(project))} fill={`url(#${id('peaks')})`} />
          </g>

          {/* Graticule ticks at each whole degree, outside the border. */}
          <motion.g stroke={INK} strokeWidth="1" {...fade(T.outline + 0.8)}>
            {Array.from({ length: 8 }, (_, i) => {
              const [x] = project([-109 + i, 41]);
              return (
                <g key={`lng${i}`} opacity="0.35">
                  <line x1={x} x2={x} y1={y0 - 10} y2={y0 - 4} />
                  <line x1={x} x2={x} y1={y1 + 4} y2={y1 + 10} />
                </g>
              );
            })}
            {Array.from({ length: 5 }, (_, i) => {
              const [, y] = project([-109, 37 + i]);
              return (
                <g key={`lat${i}`} opacity="0.35">
                  <line y1={y} y2={y} x1={x0 - 10} x2={x0 - 4} />
                  <line y1={y} y2={y} x1={x1 + 4} x2={x1 + 10} />
                </g>
              );
            })}
          </motion.g>

          {/* The state outline. */}
          <motion.rect
            x={x0}
            y={y0}
            width={STATE_W}
            height={STATE_H}
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            {...draw(T.outline, 1.6)}
          />

          {/* Interstates, as hairlines. */}
          {[I70, I25].map((road, i) => (
            <motion.path
              key={i}
              d={smoothPath(road.map(project))}
              fill="none"
              stroke={INK}
              strokeWidth="1"
              strokeLinecap="round"
              clipPath={`url(#${id('state')})`}
              {...draw(T.roads + i * 0.15, 1.6, 0.28)}
            />
          ))}

          {/* The Continental Divide, dashed, drawn in through a mask. */}
          <path
            d={smoothPath(CONTINENTAL_DIVIDE.map(project))}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.25"
            strokeDasharray="1 5"
            strokeLinecap="round"
            mask={`url(#${id('divide')})`}
            opacity="0.9"
          />

          {/* Arcs from the office to each outlying region, with a looping glint. */}
          {outlying.map((area, i) => {
            const d = arcPath(officeXY, project(ll(area)), -0.16);
            const lit = isLit(area.region);
            return (
              <motion.g
                key={area.name}
                initial={false}
                animate={{ opacity: lit ? 1 : 0.25 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <motion.path
                  d={d}
                  fill="none"
                  stroke={ACCENT}
                  strokeLinecap="round"
                  strokeWidth={active && lit ? 2 : 1.25}
                  className="transition-[stroke-width] duration-300"
                  {...draw(arcDelay(i), 0.9)}
                />
                {!reduced && (
                  <path
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="map-glint"
                    style={{ animationDelay: `${3.2 + i * 1.1}s` }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* Outlying region markers: a point that morphs into a ring when active. */}
          {outlying.map((area, i) => {
            const [x, y] = project(ll(area));
            const on = active !== null && activeRegion === area.region;
            return (
              <motion.g key={area.name} {...pop(arcEnd(i))}>
                <motion.circle
                  cx={x}
                  cy={y}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="1.25"
                  initial={false}
                  animate={{ r: on ? 11 : 4, opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  stroke={BONE}
                  strokeWidth="1.5"
                  initial={false}
                  animate={{ r: on ? 5 : 4.5, fill: on ? ACCENT : INK }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </motion.g>
            );
          })}

          {/* Denver Metro at state scale: a dashed ring, joined to the lens by tangents. */}
          <motion.g
            initial={false}
            animate={{ opacity: isLit(METRO) ? 1 : 0.35 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.circle
              cx={metroXY[0]}
              cy={metroXY[1]}
              r={METRO_RING}
              fill="none"
              stroke={active && isLit(METRO) ? ACCENT : INK}
              strokeWidth="1"
              className="transition-[stroke] duration-300"
              {...draw(T.lens, 0.7, 0.8)}
            />
          </motion.g>
          {tangents.map(([a, b], i) => (
            <motion.path
              key={i}
              d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`}
              stroke={INK}
              strokeWidth="1"
              strokeDasharray="2 4"
              fill="none"
              opacity="0.5"
              {...fade(T.lens + 0.2)}
            />
          ))}

          {/* The lens. */}
          <motion.g {...fade(lensIn)}>
            <circle cx={LENS_AT[0]} cy={LENS_AT[1]} r={LENS_R} fill={BONE} />
            <circle cx={LENS_AT[0]} cy={LENS_AT[1]} r={LENS_R} fill={`url(#${id('metro')})`} />
          </motion.g>
          <motion.circle
            cx={LENS_AT[0]}
            cy={LENS_AT[1]}
            r={LENS_R}
            fill="none"
            stroke={INK}
            strokeWidth="1.25"
            {...draw(lensIn, 1.1)}
            transform={`rotate(-90 ${LENS_AT[0]} ${LENS_AT[1]})`}
          />
          <g clipPath={`url(#${id('lens')})`}>
            {/* I-25 through the lens, for orientation. */}
            <motion.path
              d={smoothPath(I25.slice(2, 6).map(projectLens))}
              fill="none"
              stroke={INK}
              strokeWidth="1"
              {...draw(lensIn + 0.4, 1, 0.22)}
            />
            {metro.map((area, i) => {
              const [x, y] = projectLens(ll(area));
              const on = active === area.name || (active === METRO && !activeArea);
              return (
                <motion.g key={area.name} {...pop(lensIn + 0.5 + i * 0.1)}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1.25"
                    initial={false}
                    animate={{ r: on ? 10 : 3.5, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    stroke={BONE}
                    strokeWidth="1.5"
                    initial={false}
                    animate={{ r: 4, fill: on ? ACCENT : INK }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </motion.g>
              );
            })}
          </g>

          {/* The office: a diamond at state scale (with its pulse) and in the lens. */}
          {[officeXY, projectLens(ll(office))].map(([x, y], i) => (
            <motion.g key={i} {...pop(i === 0 ? T.office : lensIn + 0.9)}>
              {!reduced && (
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="1"
                  className="map-pulse"
                  style={{ animationDelay: `${T.office + 0.6 + i * 0.9}s` }}
                />
              )}
              <motion.rect
                x={x - 5}
                y={y - 5}
                width="10"
                height="10"
                stroke={BONE}
                strokeWidth="1.5"
                transform={`rotate(45 ${x} ${y})`}
                initial={false}
                animate={{ fill: active === OFFICE ? ACCENT : INK }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </motion.g>
          ))}

          {/* North arrow and a 50-mile scale bar, bottom left inside the state. */}
          <motion.g {...fade(labelsIn)} stroke={INK} fill="none">
            <path
              d={`M${x0 + 30} ${y1 - 58} L${x0 + 36} ${y1 - 42} L${x0 + 30} ${y1 - 46} L${x0 + 24} ${y1 - 42} Z`}
              fill={INK}
              stroke="none"
            />
            <line x1={x0 + 24} x2={x0 + 24 + scaleLen} y1={y1 - 22} y2={y1 - 22} strokeWidth="1" />
            {[0, 0.5, 1].map((t) => (
              <line
                key={t}
                x1={x0 + 24 + scaleLen * t}
                x2={x0 + 24 + scaleLen * t}
                y1={y1 - 26}
                y2={y1 - 18}
                strokeWidth="1"
              />
            ))}
          </motion.g>
        </svg>

        {/* HTML labels, positioned over the SVG so type stays crisp and sized for reading. */}
        <div className="pointer-events-none absolute inset-0 text-ink" aria-hidden="true">
          {/* Neighboring states and the state name. */}
          <motion.div {...fade(labelsIn + 0.1)} className="hidden @lg:block">
            {(
              [
                ['Wyoming', [x0 + STATE_W * 0.3, y0 - 24]],
                ['Nebraska', [x0 + STATE_W * 0.8, y0 - 24]],
                ['New Mexico', [x0 + STATE_W * 0.3, y1 + 24]],
                ['Oklahoma', [x1 - 40, y1 + 24]],
              ] as [string, XY][]
            ).map(([name, p]) => (
              <span
                key={name}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(9px,1.35cqw,11px)] uppercase tracking-[0.28em] text-ink/45"
                style={pct(p)}
              >
                {name}
              </span>
            ))}
            {(
              [
                ['Utah', [x0 - 26, y0 + STATE_H * 0.45]],
                ['Kansas', [x1 + 26, y0 + STATE_H * 0.55]],
              ] as [string, XY][]
            ).map(([name, p]) => (
              <span
                key={name}
                className="absolute -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[clamp(9px,1.35cqw,11px)] uppercase tracking-[0.28em] text-ink/45"
                style={pct(p)}
              >
                {name}
              </span>
            ))}
          </motion.div>
          <motion.span
            {...fade(labelsIn)}
            className="absolute -translate-y-1/2 font-serif text-[clamp(1.25rem,5.2cqw,2.5rem)] italic leading-none text-ink/30"
            style={pct([x0 + 64, y0 + STATE_H * 0.2])}
          >
            Colorado
          </motion.span>
          <motion.span
            {...fade(labelsIn + 0.2)}
            className="absolute hidden whitespace-nowrap font-serif text-[clamp(10px,1.5cqw,13px)] italic text-accent @lg:block"
            style={{ ...pct(project([-106.95, 37.97])), transform: 'translate(-110%, -50%)' }}
          >
            Continental Divide
          </motion.span>
          {(
            [
              ['I-70', project([-103.4, 39.3]), 'translate(-50%, -140%)'],
              ['I-25', project([-104.55, 37.45]), 'translate(calc(-100% - 0.6em), -50%)'],
            ] as [string, XY, string][]
          ).map(([name, p, t]) => (
            <motion.span
              key={name}
              {...fade(labelsIn + 0.2)}
              className="absolute hidden text-[clamp(9px,1.3cqw,11px)] tracking-[0.12em] text-ink/55 @lg:block"
              style={{ ...pct(p), transform: t }}
            >
              {name}
            </motion.span>
          ))}
          <motion.span
            {...fade(labelsIn)}
            className="absolute hidden text-[clamp(9px,1.3cqw,11px)] tracking-[0.12em] text-ink/60 @md:block"
            style={{ ...pct([x0 + 30, y1 - 60]), transform: 'translate(-50%, -110%)' }}
          >
            N
          </motion.span>
          <motion.span
            {...fade(labelsIn)}
            className="absolute hidden whitespace-nowrap text-[clamp(9px,1.3cqw,11px)] tracking-[0.12em] text-ink/60 @md:block"
            style={{ ...pct([x0 + 24 + scaleLen + 14, y1 - 22]), transform: 'translate(0, -50%)' }}
          >
            50 mi
          </motion.span>

          {/* Outlying region names, interactive. */}
          {outlying.map((area, i) => (
            <motion.button
              type="button"
              tabIndex={-1}
              key={area.name}
              {...fade(arcEnd(i) + 0.15)}
              {...hover(area.name)}
              className={`label pointer-events-auto absolute whitespace-nowrap text-[clamp(10px,1.5cqw,12px)] transition-colors duration-300 ease-brand ${
                active && activeRegion === area.region ? 'text-accent' : 'text-ink'
              }`}
              style={{ ...pct(project(ll(area))), transform: OFFSET[PLACEMENT[area.name]] }}
            >
              {area.name}
            </motion.button>
          ))}

          {/* Lens title and the metro communities (named on the map when there is room). */}
          <motion.button
            type="button"
            tabIndex={-1}
            {...fade(lensIn + 0.3)}
            {...hover(METRO)}
            className={`label pointer-events-auto absolute whitespace-nowrap text-[clamp(10px,1.5cqw,12px)] transition-colors duration-300 ease-brand ${
              active && activeRegion === METRO ? 'text-accent' : 'text-ink'
            }`}
            style={{
              ...pct([LENS_AT[0], LENS_AT[1] + LENS_R * 0.8]),
              transform: 'translate(-50%, -50%)',
            }}
          >
            {METRO}
          </motion.button>
          <div className="hidden @xl:block">
            {[
              ...metro.map((a) => ({ key: a.name, label: a.name, at: ll(a) })),
              {
                key: OFFICE,
                label: contact.officeLabel,
                at: ll(office),
              },
            ].map((p, i) => (
              <motion.button
                type="button"
                tabIndex={-1}
                key={p.key}
                {...fade(lensIn + 0.7 + i * 0.08)}
                {...hover(p.key)}
                className={`pointer-events-auto absolute whitespace-nowrap text-[clamp(9px,1.35cqw,11.5px)] tracking-[0.04em] transition-colors duration-300 ease-brand ${
                  active === p.key || (active === METRO && p.key !== OFFICE)
                    ? 'text-accent'
                    : p.key === OFFICE
                      ? 'font-medium text-ink'
                      : 'text-ink/80'
                }`}
                style={{ ...pct(projectLens(p.at)), transform: OFFSET[PLACEMENT[p.key]] }}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend: the accessible list of places, and the map's main control. */}
      <ul className="mt-6 grid grid-cols-1 border-t border-ink/15 @xl:grid-cols-3 @xl:gap-x-8">
        <li className="border-b border-ink/10 @xl:col-span-3">
          <button
            type="button"
            {...hover(OFFICE)}
            aria-pressed={active === OFFICE}
            className="group flex w-full items-start gap-3 py-3 text-left"
          >
            <span
              aria-hidden="true"
              className={`mt-[0.3em] h-2 w-2 shrink-0 rotate-45 transition-colors duration-300 ${
                active === OFFICE ? 'bg-accent' : 'bg-ink'
              }`}
            />
            <span>
              <span
                className={`label block transition-colors duration-300 ${active === OFFICE ? 'text-accent' : ''}`}
              >
                {contact.officeLabel}
              </span>
              <span className="mt-1 block text-[0.9375rem] leading-snug text-ink/70">
                {office.address}
              </span>
            </span>
          </button>
        </li>
        {regions.map((region) => {
          const members = serviceAreas.filter((a) => a.region === region);
          const on = active !== null && activeRegion === region;
          return (
            <li
              key={region}
              className={`border-b border-ink/10 py-3 ${region === METRO ? '@xl:col-span-3' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-[0.35em] h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                    on ? 'bg-accent' : 'bg-ink'
                  }`}
                />
                <div className="min-w-0">
                  <button
                    type="button"
                    {...hover(region)}
                    aria-pressed={active === region}
                    className={`label text-left transition-colors duration-300 ${
                      active === region || (on && members.length === 1) ? 'text-accent' : ''
                    }`}
                  >
                    {region}
                  </button>
                  {members.length > 1 && (
                    <ul className="mt-1 flex flex-wrap gap-x-1 text-[0.9375rem] leading-snug text-ink/70">
                      {members.map((m, i) => (
                        <li key={m.name}>
                          <button
                            type="button"
                            {...hover(m.name)}
                            aria-pressed={active === m.name}
                            className={`transition-colors duration-300 ${
                              active === m.name || active === METRO ? 'text-accent' : ''
                            }`}
                          >
                            {m.name}
                          </button>
                          {i < members.length - 1 && <span aria-hidden="true">,</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
