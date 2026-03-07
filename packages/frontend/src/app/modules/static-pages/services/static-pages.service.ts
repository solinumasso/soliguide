import { Type } from "@angular/core";
import { componentStaticPage, StaticPagesComponentInterface } from "../models";

export function getStaticPageComponentByName(
  allStaticPageComponentsTheme: componentStaticPage[],
  theme: string,
  lang: string
): Type<StaticPagesComponentInterface> {
  // find Component By Theme & Lang
  let staticPageComponent = allStaticPageComponentsTheme.find(
    (componentTheme) =>
      componentTheme.theme === theme && componentTheme.lang === lang
  );
  if (staticPageComponent) {
    return staticPageComponent.component;
  }
  // find default Component By Theme
  staticPageComponent = allStaticPageComponentsTheme.find(
    (componentTheme) =>
      componentTheme.theme === theme && componentTheme.defaultTheme
  );
  if (staticPageComponent) {
    return staticPageComponent.component;
  }
  // find default Component
  staticPageComponent = allStaticPageComponentsTheme.find(
    (legalNoticeComponentTheme) => legalNoticeComponentTheme.default
  );
  return staticPageComponent.component;
}
