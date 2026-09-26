import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Vitest 3 resolves modules with the SSR conditions, which do not include
  // "svelte": needed for packages exposing only a "svelte" export
  ssr: {
    resolve: {
      conditions: ['svelte'],
      externalConditions: ['svelte']
    }
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
      include: ['src/**/*']
    },
    include: ['src/**/*.spec.ts']
  }
});
