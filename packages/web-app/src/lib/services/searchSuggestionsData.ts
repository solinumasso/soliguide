import type {
  FormattedSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode
} from '@soliguide/common';

const dataModules = import.meta.glob<FormattedSuggestion[]>(
  '$lib/data/search-suggestions/*/*.json',
  { eager: false }
);

const dataLoaders = new Map<string, () => Promise<{ default: FormattedSuggestion[] }>>();

for (const [path, loader] of Object.entries(dataModules)) {
  const match = path.match(/search-suggestions\/([^/]+)\/([^/]+)\.json$/);
  if (match) {
    dataLoaders.set(
      `${match[1]}/${match[2]}`,
      loader as () => Promise<{ default: FormattedSuggestion[] }>
    );
  }
}

let cache: { key: string; data: FormattedSuggestion[] } | null = null;

export async function loadSuggestionsData(
  country: SoliguideCountries,
  lang: SupportedLanguagesCode
): Promise<FormattedSuggestion[]> {
  const key = `${country}/${lang}`;
  if (cache?.key === key) return cache.data;

  const loader = dataLoaders.get(key);
  if (!loader) return [];

  const module = await loader();
  const data = module.default ?? (module as unknown as FormattedSuggestion[]);
  cache = { key, data };
  return data;
}
