import type { LayoutServerLoad } from './$types';

/**
 * The theme is resolved once per request in `hooks.server.ts` from the public
 * hostname. Exposing it as layout data makes it available to every component
 * and to every child load function, without any module level mutable state.
 */
export const load: LayoutServerLoad = ({ locals }) => ({ theme: locals.theme });
