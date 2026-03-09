import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    sveltekit(),
    legacy({
      modernPolyfills: true,
      // Two outputs not supported by sveltekit
      // see https://github.com/sveltejs/kit/issues/9515#issuecomment-2081152895
      renderLegacyChunks: false
    })
  ],
  test: {
    include: ['src/**/*.spec.ts']
  }
});
