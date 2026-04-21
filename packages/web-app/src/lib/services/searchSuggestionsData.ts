import type {
  FormattedSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode
} from '@soliguide/common';

const dataModules = import.meta.glob<{ default: FormattedSuggestion[] }>(
  '$lib/data/search-suggestions/*/*.json',
  { eager: false }
);

const dataLoaders = new Map<string, () => Promise<{ default: FormattedSuggestion[] }>>();

Object.entries(dataModules).forEach(([path, loader]) => {
  const match = path.match(/search-suggestions\/(?<country>[^/]+)\/(?<lang>[^/]+)\.json$/u);
  if (match?.groups) {
    dataLoaders.set(
      `${match.groups.country}/${match.groups.lang}`,
      loader as () => Promise<{ default: FormattedSuggestion[] }>
    );
  }
});

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
