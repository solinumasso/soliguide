import {
  Themes,
  CountryCodes,
  SupportedLanguagesCode,
  initializeCategoriesByTheme,
} from "@soliguide/common";
import type { ThemeConfiguration } from "./theme-configuration.interface";
import { environment } from "../../../environments/environment";
// Importing from "../../shared" leads to a cyclic dependency hell
import { themeService } from "../../shared/services";

const DEFAULT_THEME_VALUE: Pick<
  ThemeConfiguration,
  "solinumHomeLink" | "socialMedia"
> = {
  solinumHomeLink: "https://www.solinum.org/",
  socialMedia: {},
};

// TODO: create themes on Common
const THEMES: Record<Themes, ThemeConfiguration> = {
  [Themes.SOLIGUIDE_FR]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguide",
    logos: {
      inline: "soliguide-inline.svg",
      original: "soliguide.svg",
      symbol: "soliguide-symbol.svg",
    },
    country: CountryCodes.FR,
    defaultCoordinates: [2.289949112, 48.85846184], // Paris
    defaultLanguage: SupportedLanguagesCode.FR,
    suggestedLanguages: [SupportedLanguagesCode.FR],
    mobileApp: {
      androidLink:
        "https://play.google.com/store/apps/details?id=com.soliguide.soliguide&hl=fr",
      appleLink:
        "https://apps.apple.com/fr/app/soliguide/id1495949521#?platform=iphone",
    },
    helpEnabled: true,
    aboutSolinumLink: "https://www.solinum.org/activites/",
    socialMedia: {
      instagram: "https://www.instagram.com/soliguide/",
      linkedin: "https://linkedin.com/company/assosolinum",
      facebook: "https://www.facebook.com/soliguide/",
      youtube: "https://youtube.com/channel/UCB4WtxF7wt0Kwk8onHCATKg",
      tiktok: "https://www.tiktok.com/@soliguide",
    },
    becomeVolunteerEnabled: true,
    contactFormEnabled: true,
    locationAutocompletePlaceholder:
      "Gare de l'est, 12 rue des bois, Paris, etc.",
    backofficeUrl: environment.backofficeUrl,
    praticalFilesLink: environment.praticalFilesLink,
    becomeTranslatorFormLink: environment.becomeTranslatorFormLink,
    donateLink: environment.donateLink,
    proAccountCreationFormLink: environment.proAccountCreationFormLink,
    chatWebsiteId: environment.chatWebsiteId,
    territoriesStats: {
      territoriesPresent: Number.parseInt(environment.territoriesPresent),
    },
    showTranslationMenuDropdown: true,
    websiteUrl: "soliguide.fr",
  },
  [Themes.SOLIGUIA_ES]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguia",
    logos: {
      inline: "soliguia-inline.svg",
      original: "soliguia.svg",
      symbol: "soliguide-symbol.svg",
      sponsor: "poctefa.webp",
    },
    country: CountryCodes.ES,
    defaultCoordinates: [2.1752361863470204, 41.38760428878576], // Barcelona
    defaultLanguage: SupportedLanguagesCode.CA,
    suggestedLanguages: [SupportedLanguagesCode.CA, SupportedLanguagesCode.ES],
    helpEnabled: false,
    aboutSolinumLink: "https://landing.soliguia.cat/",
    becomeVolunteerEnabled: false,
    contactFormEnabled: true,
    locationAutocompletePlaceholder: "Barcelona Sants, Lleida, etc.",
    showTranslationMenuDropdown: false,
    websiteUrl: "soliguia.cat",
    socialMedia: {
      instagram: "https://www.instagram.com/soliguia/",
      linkedin: "https://www.linkedin.com/showcase/soliguia/",
      facebook: "https://www.facebook.com/people/Soliguia/61586492182496/",
    },
  },
  [Themes.SOLIGUIA_AD]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguia",
    logos: {
      inline: "soliguia-inline.svg",
      original: "soliguia.svg",
      symbol: "soliguide-symbol.svg",
      sponsor: "poctefa.webp",
    },
    country: CountryCodes.AD,
    defaultCoordinates: [1.582188, 42.535812], // Andorra
    defaultLanguage: SupportedLanguagesCode.CA,
    suggestedLanguages: [
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
    ],
    helpEnabled: false,
    aboutSolinumLink: "https://landing.soliguia.cat/",
    becomeVolunteerEnabled: false,
    contactFormEnabled: true,
    locationAutocompletePlaceholder:
      "Andorre-la-Vieja, Escaldes-Engordany, etc.",
    showTranslationMenuDropdown: false,
    websiteUrl: "soliguia.ad",
    socialMedia: {
      instagram: "https://www.instagram.com/soliguia/",
      linkedin: "https://www.linkedin.com/showcase/soliguia/",
      facebook: "https://www.facebook.com/people/Soliguia/61586492182496/",
    },
  },
} as const;

const theme = themeService.getTheme();

initializeCategoriesByTheme(theme);

export const THEME_CONFIGURATION = THEMES[theme];
