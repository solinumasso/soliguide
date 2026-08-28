import type { Themes } from '@soliguide/common';

/**
 * Bridge to the mobile application embedding this web application in a webview,
 * see the `soliguide-webview` repository.
 *
 * Nothing here is required for the web application to work: every call reports
 * whether the native application took over, so the caller can always fall back on the
 * plain web behaviour.
 */

/** Messages the native application listens to. Duplicated in `soliguide-webview`. */
const CHANGE_COUNTRY_MESSAGE = 'soliguide:change-country';
const OPEN_SETTINGS_MESSAGE = 'soliguide:open-settings';

/** Query parameter the native application appends to the url it loads. */
const VERSION_PARAM = 'version';

/**
 * First version of the mobile application answering each message.
 *
 * Older versions simply do not listen, which is how the web application knows
 * not to hand them work that nobody would pick up.
 */
const MINIMUM_VERSIONS = {
  countrySwitch: '3.1.5',
  openSettings: '3.1.5'
};

type NativeCapability = keyof typeof MINIMUM_VERSIONS;

interface NativeBridgeWindow {
  ReactNativeWebView?: { postMessage: (message: string) => void };
}

/**
 * Version of the native application around us, read once from the url it opened.
 *
 * It has to be captured rather than read on demand: the parameter only ever
 * appears on the very first url, and any client side navigation drops it.
 */
let nativeAppVersion: number[] | null = null;

const getNativeBridgeWindow = (): NativeBridgeWindow | null =>
  typeof window === 'undefined' ? null : (window as unknown as NativeBridgeWindow);

/**
 * Splits a version into its numbers, or returns null when it is anything else.
 *
 * The value comes from the url and is therefore user supplied: a hand written
 * parameter must leave every capability off rather than unlock any of them.
 */
const parseVersion = (version: string | null): number[] | null => {
  if (!version || !/^\d+(\.\d+)*$/.test(version)) {
    return null;
  }

  return version.split('.').map(Number);
};

/** Compares number by number, treating a missing one as a zero: 3.2 is 3.2.0. */
const isAtLeast = (version: number[], minimum: number[]): boolean => {
  const length = Math.max(version.length, minimum.length);

  for (let index = 0; index < length; index += 1) {
    const current = version[index] ?? 0;
    const required = minimum[index] ?? 0;

    if (current !== required) {
      return current > required;
    }
  }

  return true;
};

/**
 * Reads the version the native application advertises, and remembers it.
 *
 * Called from `hooks.client.ts`, before the router runs: the first navigation
 * would otherwise take the parameter away with it.
 */
export const captureNativeAppVersion = (url: string): void => {
  try {
    nativeAppVersion = parseVersion(new URL(url).searchParams.get(VERSION_PARAM));
  } catch {
    // An url we cannot read simply means no native application. Never let this throw: it
    // runs during the boot sequence, ahead of everything else.
    nativeAppVersion = null;
  }
};

/**
 * Whether a native application surrounds us at all, whatever its version.
 *
 * Tells a browser, where a country switch is a plain navigation that works, from
 * a version too old to answer, where that same navigation would leave the
 * application for the system browser and should not be offered.
 */
export const isInsideNativeApp = (): boolean =>
  Boolean(getNativeBridgeWindow()?.ReactNativeWebView);

/**
 * Whether the native application is both reachable and recent enough for a capability.
 *
 * Both halves matter: a version parameter alone only means "an url claiming a
 * version", and `ReactNativeWebView` alone only means "inside a webview", not
 * "inside a version that answers this message".
 */
const hasNativeCapability = (capability: NativeCapability): boolean => {
  if (!isInsideNativeApp() || !nativeAppVersion) {
    return false;
  }

  return isAtLeast(nativeAppVersion, parseVersion(MINIMUM_VERSIONS[capability]) as number[]);
};

const postToNativeApp = (type: string, payload: Record<string, unknown> = {}): void => {
  getNativeBridgeWindow()?.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));
};

/** Whether the native application can switch country itself, keeping the user in the app. */
export const canNativeAppSwitchCountry = (): boolean => hasNativeCapability('countrySwitch');

/**
 * Whether the native application can open the operating system settings of the
 * application, which is where a denied location permission is granted back.
 *
 * Always false on the plain web: no browser API opens the settings of the device
 * or of the browser itself, so there is nothing to offer there.
 */
export const canNativeAppOpenSettings = (): boolean => hasNativeCapability('openSettings');

/**
 * Asks the native application to switch to another country.
 *
 * The native application owns the country of the application: it persists the choice, stops
 * overriding it from the device position and reloads its webview on the new
 * country. Returns `false` when there is no native application to ask, leaving the caller to
 * navigate itself.
 */
export const requestNativeCountrySwitch = (theme: Themes): boolean => {
  if (!canNativeAppSwitchCountry()) {
    return false;
  }

  postToNativeApp(CHANGE_COUNTRY_MESSAGE, { theme });

  return true;
};

/**
 * Asks the native application to open the settings of the application.
 *
 * Used to recover from a denied location permission: the native application opens the screen
 * where the permission can be granted, which no web API can reach. Returns
 * `false` when there is no native application to ask, so the caller can hide the offer
 * instead of showing a button that would do nothing.
 */
export const requestNativeOpenSettings = (): boolean => {
  if (!canNativeAppOpenSettings()) {
    return false;
  }

  postToNativeApp(OPEN_SETTINGS_MESSAGE);

  return true;
};
