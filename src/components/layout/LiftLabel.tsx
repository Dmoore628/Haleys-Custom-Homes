/** Each letter lifts 2px on hover or focus, staggered 40ms, 150ms ease-out per letter. */
export function LiftLabel({ text }: { text: string }) {
  return (
    <span aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span key={`${ch}-${i}`} className="lift-letter" style={{ ['--i' as string]: i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
