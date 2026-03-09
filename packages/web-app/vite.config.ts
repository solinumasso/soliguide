import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import legacy from '@vitejs/plugin-legacy';
import { sentrySvelteKit } from '@sentry/sveltekit';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      autoInstrument: {
        load: true,
        serverLoad: false
      },
      sourceMapsUploadOptions: {
        org: 'solinum',
        project: 'web-app'
      }
    }),
    sveltekit(),
    legacy({
      modernPolyfills: true,
      // Two outputs not supported by sveltekit
      // see https://github.com/sveltejs/kit/issues/9515#issuecomment-2081152895
      renderLegacyChunks: false
    })
  ],
  server: {
    fs: {
      allow: ['..']
    }
  }
});
