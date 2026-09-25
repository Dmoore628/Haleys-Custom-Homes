'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import copy from '@content/copy.config';
import { EASE, pointerToPercent } from '@/lib/animation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Phase widths (percent of the typical timeline) and the idle gaps between them.
 * Proportions are illustrative: the two sides differ only by the removed idle gaps, the
 * mechanism the Accelerated Precision Building System targets. Real duration figures are
 * pending from Haley and shown as bracketed placeholders, never invented.
 */
const PHASE_WIDTHS = [18, 14, 22, 16, 12];
const TYPICAL_GAPS = [4, 5, 6, 3];

type Side = 'typical' | 'haley';

function layout(side: Side, phases: readonly string[]) {
  const typical = side === 'typical';
  let cursor = 0;
  return phases.map((label, i) => {
    const left = cursor;
    cursor += PHASE_WIDTHS[i] + (typical ? (TYPICAL_GAPS[i] ?? 0) : 0);
    return { label, left, width: PHASE_WIDTHS[i] };
  });
}

function Timeline({ side, phases }: { side: Side; phases: readonly string[] }) {
  const typical = side === 'typical';
  return (
    <div className="relative h-14 w-full md:h-16">
      {layout(side, phases).map((s) => (
        <div
          key={s.label}
          className={`label absolute inset-y-0 flex items-center justify-center overflow-hidden whitespace-nowrap px-1 ${
            typical ? 'border border-ink/30 text-ink' : 'bg-ink text-bone'
          }`}
          style={{ left: `${s.left}%`, width: `${s.width}%` }}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}

/** Phone layout: one row per phase, the bar offset by its start, so labels never truncate. */
function StackedTimeline({ side, phases }: { side: Side; phases: readonly string[] }) {
  const typical = side === 'typical';
  return (
    <ul className="flex flex-col gap-2">
      {layout(side, phases).map((s) => (
        <li key={s.label} className="flex items-center gap-3">
          <span className="label w-20 shrink-0">{s.label}</span>
          <span className="relative h-4 flex-1">
            <span
              className={`absolute inset-y-0 ${typical ? 'border border-ink/30' : 'bg-ink'}`}
              style={{ left: `${s.left}%`, width: `${s.width}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Layer({
  side,
  className = '',
  stacked = false,
}: {
  side: Side;
  className?: string;
  stacked?: boolean;
}) {
  const { slider } = copy;
  const typical = side === 'typical' && !stacked;
  return (
    <div className={`flex h-full flex-col justify-center gap-5 px-5 py-8 md:px-8 ${className}`}>
      <p className={`label ${typical ? 'text-right' : ''}`}>
        {side === 'typical' ? slider.typicalLabel : slider.haleyLabel}
      </p>
      {stacked ? (
        <StackedTimeline side={side} phases={slider.phases} />
      ) : (
        <Timeline side={side} phases={slider.phases} />
      )}
      <p className={`label ${stacked ? '' : 'max-w-[60%]'} ${typical ? 'ml-auto text-right' : ''}`}>
        {side === 'typical' ? slider.typicalDuration : slider.haleyDuration}
      </p>
    </div>
  );
}

function HandleMark() {
  // Functional drag mark: a simple two-directional arrow, single-weight line, bone on ink.
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
      <path
        d="M1 6h18M5 2 1 6l4 4M15 2l4 4-4 4"
        stroke="#EFE9DE"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DragSlider({ tall }: { tall: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // centered on load
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(pointerToPercent(clientX, rect.left, rect.width));
  }, []);

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      if (dragging.current) moveTo(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [moveTo]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    moveTo(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={trackRef}
      className={`relative w-full select-none overflow-hidden bg-bone ${tall ? 'h-72 md:h-80' : 'h-56 md:h-64'}`}
      data-testid="comparison-slider"
    >
      {/* Right of the handle: Typical Build. */}
      <Layer side="typical" className="absolute inset-0 bg-ink/[0.03]" />
      {/* Left of the handle: Haley's Process. Dragging right reveals more of it. */}
      <div
        className="absolute inset-0 bg-bone"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        data-testid="haley-layer"
      >
        <Layer side="haley" />
      </div>

      <div
        className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={copy.slider.dragLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${copy.slider.haleyLabel}`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full bg-ink"
        style={{ left: `${pos}%` }}
        data-cursor="expand"
        data-testid="slider-handle"
      >
        <HandleMark />
      </div>
    </div>
  );
}

function ToggleSlider() {
  const [side, setSide] = useState<Side>('typical');
  const { slider } = copy;
  return (
    <div data-testid="comparison-toggle">
      <div className="mb-4 flex gap-6" role="group" aria-label="Compare timelines">
        {(['typical', 'haley'] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={side === s}
            onClick={() => setSide(s)}
            className={`label border-b-2 py-2 ${side === s ? 'border-accent' : 'border-transparent'}`}
          >
            {s === 'typical' ? slider.typicalLabel : slider.haleyLabel}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setSide((s) => (s === 'typical' ? 'haley' : 'typical'))}
        className="relative block h-80 w-full overflow-hidden bg-ink/[0.03] text-left"
        aria-label={`Showing ${side === 'typical' ? slider.typicalLabel : slider.haleyLabel}. Tap to switch.`}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={side}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Layer side={side} stacked />
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
}

/** Drag on desktop; tap-to-toggle below 768px, where dragging a thin line with a thumb is unreliable. */
export function ComparisonSlider({ tall = false }: { tall?: boolean }) {
  const desktop = useMediaQuery('(min-width: 768px)', true);
  return desktop ? <DragSlider tall={tall} /> : <ToggleSlider />;
}
