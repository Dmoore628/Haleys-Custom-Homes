'use client';

import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { EASE } from '@/lib/animation';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Deterministic pseudo-random wobble so every render draws the same "hand". */
function wobble(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

type Line = { x1: number; x2: number; y: number };

/**
 * A strikethrough drawn like a pen stroke: one slightly irregular path per rendered line of
 * text (so it follows wrapping at any width), drawing left to right line after line over
 * `duration`. The text underneath never fades or changes color.
 */
export function HandStrike({
  children,
  struck,
  instant,
  delay = 0,
  duration = 0.2,
  seed = 7,
}: {
  children: ReactNode;
  struck: boolean;
  instant: boolean;
  delay?: number;
  duration?: number;
  seed?: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useIsoLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const text = textRef.current;
      if (!wrap || !text) return;
      const base = wrap.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(text);
      const rects = Array.from(range.getClientRects());
      const byLine = new Map<number, Line>();
      for (const r of rects) {
        if (r.width < 1) continue;
        const key = Math.round(r.top);
        const y = r.top - base.top + r.height * 0.56;
        const prev = byLine.get(key);
        byLine.set(key, {
          x1: Math.min(prev?.x1 ?? Infinity, r.left - base.left),
          x2: Math.max(prev?.x2 ?? -Infinity, r.right - base.left),
          y,
        });
      }
      setLines(Array.from(byLine.values()).sort((a, b) => a.y - b.y));
      setSize({ w: base.width, h: base.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    // Fonts settling can change line breaks.
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const rand = wobble(seed);
  const paths = lines.map((l) => {
    const step = 22;
    const n = Math.max(2, Math.round((l.x2 - l.x1) / step));
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = l.x1 - 1 + ((l.x2 - l.x1 + 2) * i) / n;
      const y = l.y + rand() * 1.1 + (i / n) * 0.6; // slight drift, like a hand pulling right
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  });
  const per = duration / Math.max(1, paths.length);

  return (
    <span ref={wrapRef} className="relative block">
      <span ref={textRef}>{children}</span>
      {size.w > 0 && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={size.w}
          height={size.h}
          style={{ width: size.w, height: size.h }}
          data-testid="hand-strike"
          data-struck={struck}
        >
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(26, 24, 21, 0.4)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: struck ? 1 : 0, opacity: struck ? 1 : 0 }}
              transition={
                instant
                  ? { duration: 0 }
                  : {
                      duration: per,
                      delay: delay + i * per,
                      ease: EASE,
                      opacity: { duration: 0.01, delay: delay + i * per },
                    }
              }
            />
          ))}
        </svg>
      )}
    </span>
  );
}
