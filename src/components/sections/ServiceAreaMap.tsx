'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import type { Map as MapboxMap, StyleSpecification } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';

const BONE = '#EFE9DE';
const INK = '#1A1815';
const ACCENT = '#7A6250';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Pt = [number, number]; // [lng, lat]

/** Convex hull (monotone chain) of the service cities, pushed out ~15% from its centroid. */
function serviceOutline(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0)
      lower.pop();
    lower.push(q);
  }
  const upper: Pt[] = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0)
      upper.pop();
    upper.push(q);
  }
  const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
  const cx = hull.reduce((s, q) => s + q[0], 0) / hull.length;
  const cy = hull.reduce((s, q) => s + q[1], 0) / hull.length;
  const out = hull.map(([x, y]) => [cx + (x - cx) * 1.15, cy + (y - cy) * 1.15] as Pt);
  return [...out, out[0]];
}

/**
 * The site's own map style, built only from the palette tokens: bone land, ink water and
 * terrain contours at low opacity, quiet ink roads, no labels (the typographic list beside the
 * map does the naming). Uses Mapbox's vector tiles.
 */
function haleyStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      streets: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' },
      terrain: { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' },
    },
    layers: [
      { id: 'land', type: 'background', paint: { 'background-color': BONE } },
      {
        id: 'contours',
        type: 'line',
        source: 'terrain',
        'source-layer': 'contour',
        paint: { 'line-color': INK, 'line-opacity': 0.06, 'line-width': 0.6 },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'streets',
        'source-layer': 'water',
        paint: { 'fill-color': INK, 'fill-opacity': 0.14 },
      },
      {
        id: 'roads-major',
        type: 'line',
        source: 'streets',
        'source-layer': 'road',
        filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk']]],
        paint: {
          'line-color': INK,
          'line-opacity': 0.28,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.6, 12, 1.6],
        },
      },
      {
        id: 'roads-minor',
        type: 'line',
        source: 'streets',
        'source-layer': 'road',
        minzoom: 9,
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['primary', 'secondary', 'tertiary', 'street']],
        ],
        paint: { 'line-color': INK, 'line-opacity': 0.1, 'line-width': 0.6 },
      },
      {
        id: 'state-line',
        type: 'line',
        source: 'streets',
        'source-layer': 'admin',
        filter: ['==', ['get', 'admin_level'], 1],
        paint: {
          'line-color': INK,
          'line-opacity': 0.25,
          'line-width': 0.8,
          'line-dasharray': [3, 2],
        },
      },
    ],
  };
}

function markerElement(kind: 'city' | 'office') {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.className =
    kind === 'office'
      ? 'h-3 w-3 rotate-45 border border-bone bg-ink'
      : 'h-3 w-3 rounded-full border border-bone bg-accent transition-transform duration-200 ease-brand';
  return el;
}

/**
 * Contact page map (Fixes spec item 16): a real Mapbox GL map in the site's colors, centered on
 * the Greenwood Village office, one custom accent marker per service city. On load the service
 * outline draws in once. Hovering or focusing a city in the list flies the camera to it and
 * highlights that row in accent. No zoom controls, default pins or popups; only the required
 * Mapbox logo and attribution remain.
 */
export function ServiceAreaMap() {
  const { contact } = copy;
  const { office, serviceAreas } = siteConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<Map<string, HTMLElement>>(new Map());
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    const markers = markersRef.current;
    let cancelled = false;
    let raf = 0;
    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !containerRef.current) return;
      mapboxgl.accessToken = TOKEN;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: haleyStyle(),
        center: [office.lng, office.lat],
        zoom: 7.3,
        minZoom: 5,
        maxZoom: 13,
        attributionControl: false,
        scrollZoom: false, // never hijack page scroll
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        cooperativeGestures: true,
      });
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
      mapRef.current = map;

      map.on('load', () => {
        const outline = serviceOutline(serviceAreas.map((a) => [a.lng, a.lat] as Pt));
        map.addSource('outline', {
          type: 'geojson',
          lineMetrics: true,
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: outline },
          },
        });
        map.addLayer({
          id: 'outline',
          type: 'line',
          source: 'outline',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': ACCENT,
            'line-width': 1.25,
            'line-dasharray': [2, 1.5],
            'line-trim-offset': [0, reduced ? 0 : 1],
          },
        });
        // Draw the outline in once, like the site's other stroke reveals.
        if (!reduced) {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 1600);
            const eased = 1 - Math.pow(1 - t, 3);
            map.setPaintProperty('outline', 'line-trim-offset', [eased * 0.999, 1]);
            if (t < 1) raf = requestAnimationFrame(tick);
            else map.setPaintProperty('outline', 'line-trim-offset', [0, 0]);
          };
          raf = requestAnimationFrame(tick);
        }

        new mapboxgl.Marker({ element: markerElement('office') })
          .setLngLat([office.lng, office.lat])
          .addTo(map);
        for (const area of serviceAreas) {
          const el = markerElement('city');
          markers.set(area.name, el);
          new mapboxgl.Marker({ element: el }).setLngLat([area.lng, area.lat]).addTo(map);
        }
        setReady(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
    // The map is created once; props are static config.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusCity = useCallback(
    (name: string | null) => {
      setActive(name);
      markersRef.current.forEach((el, key) => {
        el.style.transform = key === name ? 'scale(1.6)' : '';
      });
      const map = mapRef.current;
      if (!map) return;
      const area = serviceAreas.find((a) => a.name === name);
      const target = area
        ? { center: [area.lng, area.lat] as Pt, zoom: 10.5 }
        : { center: [office.lng, office.lat] as Pt, zoom: 7.3 };
      if (reduced) map.jumpTo(target);
      else map.flyTo({ ...target, duration: 1400, essential: false, curve: 1.3 });
    },
    [office.lat, office.lng, reduced, serviceAreas],
  );

  return (
    <div data-testid="service-map">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-tile border border-ink/10 bg-bone md:aspect-[5/6]"
        data-ready={ready}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          role="region"
          aria-label={contact.mapLabel}
        />
        {!TOKEN && (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-label text-ink/70">
            {siteConfig.office.address}
          </p>
        )}
      </div>

      <h2 id="service-area-heading" className="label mt-10">
        {contact.serviceAreaHeading}
      </h2>
      <ul className="mt-4 flex flex-col" onMouseLeave={() => focusCity(null)}>
        {serviceAreas.map((area, i) => (
          <Reveal as="li" key={area.name} delay={i * 0.04}>
            <button
              type="button"
              onMouseEnter={() => focusCity(area.name)}
              onFocus={() => focusCity(area.name)}
              onBlur={() => focusCity(null)}
              aria-pressed={active === area.name}
              className={`label w-full py-2 text-left transition-colors duration-200 ease-brand ${
                active === area.name ? 'text-accent' : 'text-ink'
              }`}
            >
              {area.name}
            </button>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
