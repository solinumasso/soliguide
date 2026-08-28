import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Themes } from '@soliguide/common';

import {
  canNativeAppOpenSettings,
  canNativeAppSwitchCountry,
  captureNativeAppVersion,
  isInsideNativeApp,
  requestNativeCountrySwitch,
  requestNativeOpenSettings
} from './nativeBridgeService';

const postMessage = vi.fn();

/** A webview, whatever version of the mobile application is around it. */
const installWebview = () => {
  vi.stubGlobal('window', { ReactNativeWebView: { postMessage } });
};

/** A browser with no mobile application around it. */
const installPlainBrowser = () => {
  vi.stubGlobal('window', {});
};

/** Reproduces the url the mobile application loads, version parameter included. */
const openedWith = (version: string) =>
  captureNativeAppVersion(`https://soliguide.fr/fr/search?version=${version}`);

beforeEach(() => {
  captureNativeAppVersion('https://soliguide.fr/fr/search');
});

afterEach(() => {
  vi.unstubAllGlobals();
  postMessage.mockClear();
});

describe('captureNativeAppVersion', () => {
  it('ignores an url without the parameter, leaving every capability off', () => {
    installWebview();
    captureNativeAppVersion('https://soliguide.fr/fr/search');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('ignores a version that is not a number sequence', () => {
    installWebview();
    openedWith('not-a-version');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('ignores an unreadable url rather than throwing during the boot sequence', () => {
    installWebview();

    expect(() => captureNativeAppVersion('¯\\_(ツ)_/¯')).not.toThrow();
    expect(canNativeAppSwitchCountry()).toBe(false);
  });
});

describe('isInsideNativeApp', () => {
  it('is false while server side rendering, where there is no window at all', () => {
    expect(isInsideNativeApp()).toBe(false);
  });

  it('is false in a browser, where switching country is a plain navigation', () => {
    installPlainBrowser();

    expect(isInsideNativeApp()).toBe(false);
  });

  it('is true in a webview too old to answer, which is what tells it apart', () => {
    installWebview();
    openedWith('3.1.4');

    expect(isInsideNativeApp()).toBe(true);
    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('is true in a webview that answers', () => {
    installWebview();
    openedWith('3.1.5');

    expect(isInsideNativeApp()).toBe(true);
  });
});

describe('canNativeAppSwitchCountry', () => {
  it('is false while server side rendering, where there is no window at all', () => {
    openedWith('3.1.5');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('is false on the plain web', () => {
    installPlainBrowser();
    openedWith('3.1.5');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('is false in a mobile application older than the country switch', () => {
    installWebview();
    openedWith('3.1.4');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });

  it('is true from the version that answers the message', () => {
    installWebview();
    openedWith('3.1.5');

    expect(canNativeAppSwitchCountry()).toBe(true);
  });

  it('is true in any later version', () => {
    installWebview();
    openedWith('3.2.0');

    expect(canNativeAppSwitchCountry()).toBe(true);
  });

  it('compares numerically rather than alphabetically', () => {
    installWebview();
    openedWith('3.1.10');

    expect(canNativeAppSwitchCountry()).toBe(true);
  });

  it('is false outside a webview, even when the url carries a version', () => {
    installPlainBrowser();
    openedWith('9.9.9');

    expect(canNativeAppSwitchCountry()).toBe(false);
  });
});

describe('canNativeAppOpenSettings', () => {
  it('is false on the plain web, where no API opens the device settings', () => {
    installPlainBrowser();
    openedWith('3.1.5');

    expect(canNativeAppOpenSettings()).toBe(false);
  });

  it('is false in a mobile application older than the capability', () => {
    installWebview();
    openedWith('3.1.4');

    expect(canNativeAppOpenSettings()).toBe(false);
  });

  it('is true from the version that answers the message', () => {
    installWebview();
    openedWith('3.1.5');

    expect(canNativeAppOpenSettings()).toBe(true);
  });
});

describe('requestNativeCountrySwitch', () => {
  it('hands the target country to the native application', () => {
    installWebview();
    openedWith('3.1.5');

    expect(requestNativeCountrySwitch(Themes.SOLIGUIA_ES)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      JSON.stringify({ type: 'soliguide:change-country', theme: Themes.SOLIGUIA_ES })
    );
  });

  it('posts nothing on the plain web, so the caller navigates itself', () => {
    installPlainBrowser();
    openedWith('3.1.5');

    expect(requestNativeCountrySwitch(Themes.SOLIGUIA_AD)).toBe(false);
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('posts nothing to a version that would not pick it up', () => {
    installWebview();
    openedWith('3.1.4');

    expect(requestNativeCountrySwitch(Themes.SOLIGUIA_AD)).toBe(false);
    expect(postMessage).not.toHaveBeenCalled();
  });
});

describe('requestNativeOpenSettings', () => {
  it('asks the native application to open the application settings', () => {
    installWebview();
    openedWith('3.1.5');

    expect(requestNativeOpenSettings()).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify({ type: 'soliguide:open-settings' }));
  });

  it('posts nothing on the plain web, so the caller hides the offer', () => {
    installPlainBrowser();
    openedWith('3.1.5');

    expect(requestNativeOpenSettings()).toBe(false);
    expect(postMessage).not.toHaveBeenCalled();
  });
});
