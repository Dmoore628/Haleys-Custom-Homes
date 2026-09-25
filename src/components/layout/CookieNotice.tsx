'use client';

import { useEffect, useState } from 'react';
import copy from '@content/copy.config';
import { Button } from '@/components/ui/Button';

const KEY = 'hch-cookie-consent';

/** Minimal single-tier bottom bar. Appears once per visitor, dismisses permanently. */
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(window.localStorage.getItem(KEY) !== 'dismissed');
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, 'dismissed');
    } catch {
      // Storage blocked: dismiss for this visit only.
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="section-x fixed inset-x-0 bottom-0 z-[65] flex flex-col items-start gap-4 bg-ink py-4 text-bone md:flex-row md:items-center md:justify-between"
    >
      <p className="text-body">{copy.cookie.body}</p>
      <Button variant="ghost" surface="dark" onClick={dismiss} className="px-6 py-3">
        {copy.cookie.button}
      </Button>
    </div>
  );
}
