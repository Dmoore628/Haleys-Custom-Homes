'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { currentYear, withYear } from '@/lib/year';

const YearContext = createContext<number>(currentYear());

/**
 * The current year, for every dated line on the site. Pages are prerendered, so the server
 * passes the year it rendered with (hydration then matches exactly), and the browser moves it
 * on to the visitor's current year straight after, so a page built last December still reads
 * this year in January.
 */
export function YearProvider({ rendered, children }: { rendered: number; children: ReactNode }) {
  const [year, setYear] = useState(rendered);
  useEffect(() => {
    const now = currentYear();
    if (now !== rendered) setYear(now);
  }, [rendered]);
  return <YearContext.Provider value={year}>{children}</YearContext.Provider>;
}

export const useYear = () => useContext(YearContext);

/** Copy with its `{year}` and `{years}` tokens filled with the current year. */
export function YearText({ text }: { text: string }) {
  return <>{withYear(text, useYear())}</>;
}
