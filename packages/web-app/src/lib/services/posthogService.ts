import { type PostHog, posthog } from 'posthog-js';
import { env } from '$env/dynamic/public';
import type { PosthogCaptureFunction, RequestOptionsFrontend } from './types';

const getPosthogService = () => {
  // skipcq: JS-0119
  // eslint-disable-next-line fp/no-let
  let instance: PostHog | undefined;

  /**
   * Init posthog instance
   */
  const init = (): void => {
    if (!instance && env.PUBLIC_SOLIGUIDE_POSTHOG_API_KEY && env.PUBLIC_SOLIGUIDE_POSTHOG_URL) {
      // eslint-disable-next-line fp/no-mutation
      instance = posthog.init(env.PUBLIC_SOLIGUIDE_POSTHOG_API_KEY, {
        /* eslint-disable camelcase */
        api_host: env.PUBLIC_SOLIGUIDE_POSTHOG_URL,
        person_profiles: 'always',
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        session_idle_timeout_seconds: 1800, // 30 minutes
        session_recording: {
          maskAllInputs: true,
          maskInputFn: (text, element) => {
            if (element?.dataset.record === 'true') {
              return text;
            }
            return '*'.repeat(text.trim().length);
          }
        }
      });
    }
  };

  /**
   * Return distinct user ID
   */
  const getSessionId = (): string => {
    if (!instance) {
      init();
    }

    if (instance) {
      return instance.get_session_id();
    }

    console.error('NO_PH_INSTANCE');
    return '';
  };

  /**
   * Return distinct user ID
   */
  const getDistinctId = (): string => {
    if (!instance) {
      init();
    }

    if (instance) {
      return instance.get_distinct_id();
    }

    console.error('NO_PH_INSTANCE');
    return '';
  };

  /**
   * Capture event
   */
  const capture: PosthogCaptureFunction = (eventName, properties) => {
    if (!instance) {
      init();
    }

    if (instance) {
      const eventToSend = eventName === '$pageview' ? eventName : `web-app-${eventName}`;

      instance.capture(eventToSend, properties);
    } else {
      console.error('NO_PH_INSTANCE');
    }
  };

  /**
   * Get headers from a request event
   */
  const getHeaders = (): RequestOptionsFrontend => ({
    'X-Ph-User-Session-Id': getSessionId(),
    'X-Ph-User-Distinct-Id': getDistinctId()
  });

  return {
    capture,
    getHeaders
  };
};

export const posthogService = getPosthogService();
