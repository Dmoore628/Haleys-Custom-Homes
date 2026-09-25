import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, 'content'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
