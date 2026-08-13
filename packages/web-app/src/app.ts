// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ThemeDefinition } from '$lib/theme/types';

declare global {
  // skipcq JS-0337
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace App {
    interface Locals {
      /** Resolved once per request from the public hostname, in `hooks.server.ts`. */
      theme: ThemeDefinition;
    }
  }
}

export {};
