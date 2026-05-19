import { THEME_CONFIGURATION } from "../../models";

export const getMobileAppLink = (): string | null => {
  const mobileAppLinks = THEME_CONFIGURATION.mobileApp;
  // Android detection
  if (/android/i.test(navigator.userAgent)) {
    return mobileAppLinks ? mobileAppLinks.androidLink : null;
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return mobileAppLinks ? mobileAppLinks.appleLink : null;
  }
  return null;
};
