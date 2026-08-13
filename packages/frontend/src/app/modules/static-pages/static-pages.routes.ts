import { Routes } from "@angular/router";
import {
  getLegalPagePath,
  LEGAL_PAGE_SLUGS_BY_THEME,
  LegalPage,
  Themes,
} from "@soliguide/common";
import { LegalNoticesComponent } from "./components/legal-notices/legal-notices.component";
import { LanguageGuard } from "../../guards/language.guard";
import { PrivacyPolicyComponent } from "./components/privacy-policy/privacy-policy.component";
import { DataProcessingAgreementComponent } from "./components/data-processing-agreement/data-processing-agreement.component";
import { CookiePolicyComponent } from "./components/cookie-policy/cookie-policy.component";
import { GcuComponent } from "./components/gcu/gcu.component";
import { THEME_CONFIGURATION } from "../../models";

/**
 * Localized paths of the legal pages, language segment included.
 *
 * The slugs themselves live in `@soliguide/common`
 * (`LEGAL_PAGE_SLUGS_BY_THEME`) so that the web-app can link to these same
 * pages without duplicating the table.
 */
export function getLocalPathByTheme(theme: Themes, lang: string = ":lang") {
  return {
    [LegalPage.LEGAL_NOTICES]: getLegalPagePath(
      theme,
      LegalPage.LEGAL_NOTICES,
      lang
    ),
    [LegalPage.PRIVACY_POLICY]: getLegalPagePath(
      theme,
      LegalPage.PRIVACY_POLICY,
      lang
    ),
    [LegalPage.DATA_PROCESSING_AGREEMENT]: getLegalPagePath(
      theme,
      LegalPage.DATA_PROCESSING_AGREEMENT,
      lang
    ),
    [LegalPage.COOKIE_POLICY]: getLegalPagePath(
      theme,
      LegalPage.COOKIE_POLICY,
      lang
    ),
    [LegalPage.GCU]: getLegalPagePath(theme, LegalPage.GCU, lang),
  };
}

export function getLocalRoutesByTheme(theme: Themes): Routes {
  const localizedPaths = getLocalPathByTheme(theme);
  const defaultLanguagePaths = getLocalPathByTheme(
    theme,
    THEME_CONFIGURATION.defaultLanguage
  );

  return [
    {
      path: localizedPaths[LegalPage.LEGAL_NOTICES],
      component: LegalNoticesComponent,
      canActivate: [LanguageGuard],
    },
    {
      path: localizedPaths[LegalPage.PRIVACY_POLICY],
      component: PrivacyPolicyComponent,
      canActivate: [LanguageGuard],
    },
    {
      path: localizedPaths[LegalPage.DATA_PROCESSING_AGREEMENT],
      component: DataProcessingAgreementComponent,
      canActivate: [LanguageGuard],
    },
    {
      path: localizedPaths[LegalPage.COOKIE_POLICY],
      component: CookiePolicyComponent,
      canActivate: [LanguageGuard],
    },
    {
      path: localizedPaths[LegalPage.GCU],
      component: GcuComponent,
      canActivate: [LanguageGuard],
    },
    // Legacy paths without a language segment, redirected to the default language
    {
      path: LEGAL_PAGE_SLUGS_BY_THEME[LegalPage.LEGAL_NOTICES][theme],
      redirectTo: defaultLanguagePaths[LegalPage.LEGAL_NOTICES],
    },
    {
      path: LegalPage.PRIVACY_POLICY,
      redirectTo: defaultLanguagePaths[LegalPage.PRIVACY_POLICY],
    },
    {
      path: LegalPage.COOKIE_POLICY,
      redirectTo: defaultLanguagePaths[LegalPage.COOKIE_POLICY],
    },
    {
      path: LegalPage.DATA_PROCESSING_AGREEMENT,
      redirectTo: defaultLanguagePaths[LegalPage.DATA_PROCESSING_AGREEMENT],
    },
    {
      path: LegalPage.GCU,
      redirectTo: defaultLanguagePaths[LegalPage.GCU],
    },
  ];
}
