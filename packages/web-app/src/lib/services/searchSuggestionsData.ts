import type {
  FormattedSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode
} from '@soliguide/common';

const dataModules = import.meta.glob<{ default: FormattedSuggestion[] }>(
  '$lib/data/search-suggestions/*/*.json',
  { eager: false }
);

type DataLoader = () => Promise<{ default: FormattedSuggestion[] }>;

const dataLoaders: Map<string, DataLoader> = Object.entries(dataModules).reduce(
  (acc, [path, loader]) => {
    const match = /search-suggestions\/(?<country>[^/]+)\/(?<lang>[^/]+)\.json$/u.exec(path);
    if (match?.groups) {
      acc.set(`${match.groups.country}/${match.groups.lang}`, loader);
    }
    return acc;
  },
  new Map<string, DataLoader>()
);

const cache = new Map<string, FormattedSuggestion[]>();

export const loadSuggestionsData = async (
  country: SoliguideCountries,
  lang: SupportedLanguagesCode
): Promise<FormattedSuggestion[]> => {
  const key = `${country}/${lang}`;
  if (cache.has(key)) return cache.get(key)!;

  const loader = dataLoaders.get(key);
  if (!loader) return [];

  const module = await loader();
  const data = module.default ?? (module as unknown as FormattedSuggestion[]);
  cache.set(key, data);
  return data;
};
