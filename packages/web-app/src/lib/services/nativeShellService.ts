import type { Themes } from '@soliguide/common';

/**
 * Bridge to the mobile application embedding this web application in a webview,
 * see the `soliguide-webview` repository.
 *
 * Nothing here is required for the web application to work: every call reports
 * whether the native shell took over, so the caller can always fall back on the
 * plain web behaviour.
 */

/** Messages the native shell listens to. Duplicated in `soliguide-webview`. */
const CHANGE_COUNTRY_MESSAGE = 'soliguide:change-country';
const OPEN_SETTINGS_MESSAGE = 'soliguide:open-settings';

/**
 * Capabilities the native shell injects before the page loads.
 *
 * Versions of the mobile application older than a capability simply do not
 * declare it, which is how the web application knows not to hand it work that
 * nobody would pick up.
 */
interface NativeShellCapabilities {
  countrySwitch?: boolean;
  openSettings?: boolean;
}

interface NativeShellWindow {
  __SOLIGUIDE_NATIVE__?: NativeShellCapabilities;
  ReactNativeWebView?: { postMessage: (message: string) => void };
}

const getNativeShellWindow = (): NativeShellWindow | null =>
  typeof window === 'undefined' ? null : (window as unknown as NativeShellWindow);

/**
 * Whether the shell both declares a capability and offers a way to reach it.
 *
 * Both halves matter: `ReactNativeWebView` alone only means "inside a webview",
 * not "inside a version that answers this message".
 */
const hasNativeCapability = (capability: keyof NativeShellCapabilities): boolean => {
  const nativeWindow = getNativeShellWindow();

  return Boolean(
    // Double underscores are the convention for a global injected by a host
    // environment, and keep this apart from anything the web application owns.
    // eslint-disable-next-line no-underscore-dangle
    nativeWindow?.__SOLIGUIDE_NATIVE__?.[capability] && nativeWindow.ReactNativeWebView
  );
};

const postToNativeShell = (type: string, payload: Record<string, unknown> = {}): void => {
  getNativeShellWindow()?.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));
};

/** Whether the native shell can switch country itself, keeping the user in the app. */
export const canNativeShellSwitchCountry = (): boolean => hasNativeCapability('countrySwitch');

/**
 * Whether the native shell can open the operating system settings of the
 * application, which is where a denied location permission is granted back.
 *
 * Always false on the plain web: no browser API opens the settings of the device
 * or of the browser itself, so there is nothing to offer there.
 */
export const canNativeShellOpenSettings = (): boolean => hasNativeCapability('openSettings');

/**
 * Asks the native shell to switch to another country.
 *
 * The shell owns the country of the application: it persists the choice, stops
 * overriding it from the device position and reloads its webview on the new
 * country. Returns `false` when there is no shell to ask, leaving the caller to
 * navigate itself.
 */
export const requestNativeCountrySwitch = (theme: Themes): boolean => {
  if (!canNativeShellSwitchCountry()) {
    return false;
  }

  postToNativeShell(CHANGE_COUNTRY_MESSAGE, { theme });

  return true;
};

/**
 * Asks the native shell to open the settings of the application.
 *
 * Used to recover from a denied location permission: the shell opens the screen
 * where the permission can be granted, which no web API can reach. Returns
 * `false` when there is no shell to ask, so the caller can hide the offer
 * instead of showing a button that would do nothing.
 */
export const requestNativeOpenSettings = (): boolean => {
  if (!canNativeShellOpenSettings()) {
    return false;
  }

  postToNativeShell(OPEN_SETTINGS_MESSAGE);

  return true;
};
