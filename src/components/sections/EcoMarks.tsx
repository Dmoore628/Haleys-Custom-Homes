import { MarkImage } from '@/components/ui/MarkImage';

/** The programs Haley builds to: Energy Star, EPA Indoor airPLUS, Boulder County BuildSmart. */
const MARKS = [
  { src: '/images/awards/energy-star.svg', alt: 'ENERGY STAR' },
  { src: '/images/eco/epa-indoor-airplus.png', alt: 'EPA Indoor airPLUS' },
  { src: '/images/eco/boulder-county-buildsmart.png', alt: 'Boulder County BuildSmart' },
];

export function EcoMarks({
  className = '',
  base = 'clamp(52px, 5vw, 68px)',
}: {
  className?: string;
  base?: string;
}) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}
      data-testid="eco-marks"
    >
      {MARKS.map((m) => (
        <li key={m.src}>
          <MarkImage src={m.src} alt={m.alt} base={base} />
        </li>
      ))}
    </ul>
  );
}
