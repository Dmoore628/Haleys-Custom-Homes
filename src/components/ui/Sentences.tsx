/** Splits text into sentences at a full stop, question or exclamation mark followed by a space. */
export function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

/**
 * A multi-sentence headline set one sentence per line, so a line never breaks mid-thought
 * ("...a year. Every / one built..."). Each sentence also wraps balanced within itself.
 */
export function Sentences({ text }: { text: string }) {
  const sentences = splitSentences(text);
  if (sentences.length < 2) return <>{text}</>;
  return (
    <>
      {sentences.map((s, i) => (
        <span key={i} className="block [text-wrap:balance]">
          {s}
          {i < sentences.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}
