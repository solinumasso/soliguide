import i18next, { type i18n } from 'i18next';
import { writable, type Writable } from 'svelte/store';

const resources: Record<
  string,
  {
    translation: {
      SEARCH: string;
      CLOSE: string;
      CANCEL: string;
      CLEAR: string;
      TOTO: string;
    };
  }
> = {
  ar: {
    translation: {
      SEARCH: 'بحث',
      CLOSE: 'اغلاق',
      CANCEL: 'إلغاء',
      CLEAR: 'لمحو',
      TOTO: 'toto-ar'
    }
  },
  ca: {
    translation: {
      SEARCH: 'Cerca',
      CLOSE: 'Tanca',
      CANCEL: 'Cancel·la',
      CLEAR: 'Esborra',
      TOTO: 'toto-ca'
    }
  },
  en: {
    translation: {
      SEARCH: 'Search',
      CLOSE: 'Close',
      CANCEL: 'Cancel',
      CLEAR: 'Clear',
      TOTO: 'toto-en'
    }
  },
  es: {
    translation: {
      SEARCH: 'Buscar',
      CLOSE: 'Cerca',
      CANCEL: 'Cancelar',
      CLEAR: 'Borrar',
      TOTO: 'toto-es'
    }
  },
  fa: {
    translation: {
      SEARCH: 'به تحقیق',
      CLOSE: 'بستن',
      CANCEL: 'لغو کنید',
      CLEAR: 'برای پاک کردن',
      TOTO: 'toto-fa'
    }
  },
  fr: {
    translation: {
      SEARCH: 'Rechercher',
      CLOSE: 'Fermer',
      CANCEL: 'Annuler',
      CLEAR: 'Effacer',
      TOTO: 'toto-fr'
    }
  },
  ka: {
    translation: {
      SEARCH: 'Კვლევა',
      CLOSE: 'დახურვა',
      CANCEL: 'გაუქმება',
      CLEAR: 'წასაშლელად',
      TOTO: 'toto-ka'
    }
  },
  ps: {
    translation: {
      SEARCH: 'تحقیق کول',
      CLOSE: 'تړل',
      CANCEL: 'لغوه کړئ',
      CLEAR: 'د پاکولو لپاره',
      TOTO: 'toto-ps'
    }
  },
  ro: {
    translation: {
      SEARCH: 'A cerceta',
      CLOSE: 'Închide',
      CANCEL: 'Anulare',
      CLEAR: 'A șterge',
      TOTO: 'toto-ro'
    }
  },
  ru: {
    translation: {
      SEARCH: 'Поиск',
      CLOSE: 'Закрывать',
      CANCEL: 'Отменить',
      CLEAR: 'Чтобы стереть',
      TOTO: 'toto-ru'
    }
  },
  uk: {
    translation: {
      SEARCH: 'Пошук',
      CLOSE: 'Закрити',
      CANCEL: 'Скасувати',
      CLEAR: 'Щоб стерти',
      TOTO: 'toto-uk'
    }
  }
} as const;

// Create an instance to avoid collisions with other i18next contexts
const i18nInstance = i18next.createInstance(
  {
    lng: 'fr',
    resources,
    fallbackLng: 'fr',
    supportedLngs: Object.keys(resources),
    interpolation: {
      escapeValue: false // not needed for svelte as it escapes by default
    }
  },
  (err) => {
    if (err) {
      console.error('something went wrong loading design-system i18n', err);
    }
  }
);

// Expose this to allow language change from outside the design system
export const changeDesignSystemLocale = (locale: string) => {
  i18nInstance.changeLanguage(locale);
};
export const getDesignSystemLocale = () => {
  return i18nInstance.language;
};

export const createI18nStore = (instance: i18n): Writable<i18n> => {
  const i18nWritable = writable(instance);

  instance.on('initialized', () => {
    i18nWritable.set(instance);
  });
  instance.on('loaded', () => {
    i18nWritable.set(instance);
  });
  instance.on('added', () => i18nWritable.set(instance));
  instance.on('languageChanged', () => {
    i18nWritable.set(instance);
  });
  return i18nWritable;
};

const i18nStore: Writable<i18n> = createI18nStore(i18nInstance);

export default i18nStore;
