import { afterEach, describe, expect, it, vi } from 'vitest';
import { Themes } from '@soliguide/common';

import { canNativeShellSwitchCountry, requestNativeCountrySwitch } from './nativeShellService';

const postMessage = vi.fn();

/** Reproduces what the mobile application injects into the page. */
const installNativeShell = (capabilities: unknown) => {
  vi.stubGlobal('window', {
    __SOLIGUIDE_NATIVE__: capabilities,
    ReactNativeWebView: { postMessage }
  });
};

/** A browser with no mobile application around it. */
const installPlainBrowser = () => {
  vi.stubGlobal('window', {});
};

afterEach(() => {
  vi.unstubAllGlobals();
  postMessage.mockClear();
});

describe('canNativeShellSwitchCountry', () => {
  it('is false while server side rendering, where there is no window at all', () => {
    expect(canNativeShellSwitchCountry()).toBe(false);
  });

  it('is false on the plain web', () => {
    installPlainBrowser();

    expect(canNativeShellSwitchCountry()).toBe(false);
  });

  it('is false in a mobile application older than the country switch', () => {
    vi.stubGlobal('window', { ReactNativeWebView: { postMessage } });

    expect(canNativeShellSwitchCountry()).toBe(false);
  });

  it('is false when the shell declares other capabilities but not this one', () => {
    installNativeShell({ countrySwitch: false });

    expect(canNativeShellSwitchCountry()).toBe(false);
  });

  it('is true once the shell declares the capability', () => {
    installNativeShell({ countrySwitch: true });

    expect(canNativeShellSwitchCountry()).toBe(true);
  });
});

describe('requestNativeCountrySwitch', () => {
  it('hands the target country to the shell', () => {
    installNativeShell({ countrySwitch: true });

    expect(requestNativeCountrySwitch(Themes.SOLIGUIA_ES)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      JSON.stringify({ type: 'soliguide:change-country', theme: Themes.SOLIGUIA_ES })
    );
  });

  it('posts nothing on the plain web, so the caller navigates itself', () => {
    installPlainBrowser();

    expect(requestNativeCountrySwitch(Themes.SOLIGUIA_AD)).toBe(false);
    expect(postMessage).not.toHaveBeenCalled();
  });
});
