import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
      include: ['src/**/*']
    },
    include: ['src/**/*.spec.ts'],
    exclude: ['web-tests/**/*.spec.ts']
  }
});
