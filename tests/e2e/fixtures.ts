import { test as base } from '@playwright/test';

/** The shared test fixture (a hook point for per-test setup). */
export const test = base;
export { expect } from '@playwright/test';
