'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { keepTogether } from '@/lib/text';

/**
 * The one place the blueprint-line motif appears: a 1px architectural dimension line
 * (a run with 45-degree end ticks and extension marks), used as a quiet divider.
 */
function BlueprintLine() {
  return (
    <svg
      className="my-[clamp(3rem,7vw,6rem)] h-6 w-full text-ink/40"
      viewBox="0 0 1000 24"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 12H1000"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 2v20M999 2v20"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-5 18 7 6M993 18l12-12"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Six phase blocks in alternating 7/5 splits, with a scroll-linked progress rail down the
 * left margin: 4px ink-at-10% track, accent fill tied to real scroll progress through the
 * section, and a marker per phase that fills once the visitor scrolls past it.
 */
export function PhaseSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [markers, setMarkers] = useState<number[]>([]);
  const [passed, setPassed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  // Marker positions as fractions of the section height, at each block's top.
  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const h = section.offsetHeight;
      setMarkers(blockRefs.current.map((b) => (b ? (b.offsetTop + 8) / h : 0)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPassed(markers.filter((m) => v >= m).length);
  });

  const phases = copy.process.phases;

  return (
    <div ref={sectionRef} className="relative pl-10 md:pl-20" data-testid="phase-sequence">
      {/* Rail */}
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-ink/10 md:left-4" aria-hidden="true">
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
            style={{ scaleY: fill }}
          />
        )}
        {markers.map((m, i) => (
          <span
            key={i}
            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-accent transition-colors duration-300 ease-brand ${
              i < passed ? 'bg-accent' : 'bg-bone'
            }`}
            style={{ top: `${m * 100}%` }}
            data-testid="rail-marker"
            data-passed={i < passed}
          />
        ))}
      </div>

      <ol>
        {phases.map((phase, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <li key={phase.title}>
              {i > 0 && <BlueprintLine />}
              <article
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0"
              >
                <Reveal className={`md:col-span-7 ${imageLeft ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-tile">
                    <SmartImage
                      src={phase.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
                <Reveal
                  className={`md:col-span-5 ${imageLeft ? 'md:order-2' : 'md:order-1'}`}
                  delay={0.1}
                >
                  <p className="label text-ink/70">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 font-serif text-statement font-normal">
                    {keepTogether(phase.title)}
                  </h3>
                  <p className="mt-5 max-w-text text-body">{keepTogether(phase.body)}</p>
                </Reveal>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
