import type { Themes } from '@soliguide/common';

/**
 * Bridge to the mobile application embedding this web application in a webview,
 * see the `soliguide-webview` repository.
 *
 * Nothing here is required for the web application to work: every call reports
 * whether the native shell took over, so the caller can always fall back on the
 * plain web behaviour.
 */

/** Message the native shell listens to. Duplicated in `soliguide-webview`. */
const CHANGE_COUNTRY_MESSAGE = 'soliguide:change-country';

/**
 * Capabilities the native shell injects before the page loads.
 *
 * Versions of the mobile application older than a capability simply do not
 * declare it, which is how the web application knows not to hand it work that
 * nobody would pick up.
 */
interface NativeShellCapabilities {
  countrySwitch?: boolean;
}

interface NativeShellWindow {
  __SOLIGUIDE_NATIVE__?: NativeShellCapabilities;
  ReactNativeWebView?: { postMessage: (message: string) => void };
}

const getNativeShellWindow = (): NativeShellWindow | null =>
  typeof window === 'undefined' ? null : (window as unknown as NativeShellWindow);

/** Whether the native shell can switch country itself, keeping the user in the app. */
export const canNativeShellSwitchCountry = (): boolean => {
  const nativeWindow = getNativeShellWindow();

  return Boolean(
    // Double underscores are the convention for a global injected by a host
    // environment, and keep this apart from anything the web application owns.
    // eslint-disable-next-line no-underscore-dangle
    nativeWindow?.__SOLIGUIDE_NATIVE__?.countrySwitch && nativeWindow.ReactNativeWebView
  );
};

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

  getNativeShellWindow()?.ReactNativeWebView?.postMessage(
    JSON.stringify({ type: CHANGE_COUNTRY_MESSAGE, theme })
  );

  return true;
};
