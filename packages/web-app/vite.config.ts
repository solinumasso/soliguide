import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import legacy from '@vitejs/plugin-legacy';
import { sentrySvelteKit } from '@sentry/sveltekit';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sentrySvelteKit({
      autoInstrument: { load: true, serverLoad: false },
      sourceMapsUploadOptions: { org: 'solinum', project: 'web-app' }
    }),
    sveltekit(),
    legacy({
      modernPolyfills: true,
      renderLegacyChunks: false
    })
  ],
  server: { fs: { allow: ['..'] } }
});
