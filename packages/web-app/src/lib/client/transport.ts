import { get, writable, type Writable } from 'svelte/store';
import type { Fetch, Fetcher } from './types';
import { getErrorValue } from '$lib/ts';

/**
 * Generic error formatting
 */
const handleError = (error: unknown): { status?: number; message: string } => {
  const errorValue = getErrorValue(error);

  if (typeof errorValue === 'string') {
    return { message: errorValue };
  }

  return {
    status: errorValue?.status,
    message: errorValue?.statusText || errorValue?.message || ''
  };
};

/**
 * For testing only. Simulates window.fetch and
 * allows to fill with data or error to return
 */
export const fakeFetch = () => {
  interface State {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stubs: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
  }

  const state: Writable<State> = writable({ stubs: [], error: null });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedWith = (data: any): void => {
    state.update((old) => ({ ...old, stubs: data }));
  };

  const setError = (error: unknown): void => {
    state.update((old) => ({ ...old, error }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  const fetcher: Fetcher<any> = (_url?: string, _options?: RequestInit) => {
    const { stubs: currentStubs, error: currentError } = get(state);
    if (currentError) {
      throw handleError(currentError);
    }
    return Promise.resolve(currentStubs);
  };

  return {
    feedWith,
    setError,
    fetch: fetcher
  };
};

/**
 * Sveltekit uses its own version of fetch in load functions.
 * This version is like the regular JS fetch, but works with SSR
 */
export const wrapSveltekitFetch = <T extends Response>(
  sveltekitFetch = fetch as Fetch<T>
): Fetcher<T> => {
  return (url, options) => {
    return new Promise((resolve, reject) => {
      sveltekitFetch(url, options)
        .then((response: T) => {
          if (response.ok) {
            response
              .json()
              .then(resolve)
              .catch((err) => reject(handleError(err)));
          } else {
            reject(handleError(response));
          }
        })
        .catch((err: Error) => reject(handleError(err)));
    });
  };
};

export default <T>(url: string, options?: RequestInit): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then(resolve)
            .catch((err) => reject(handleError(err)));
        } else {
          reject(handleError(response));
        }
      })
      .catch((err) => reject(handleError(err)));
  });
};
