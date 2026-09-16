import type { ComponentType } from 'svelte';
import type { types as DSTypes } from '@soliguide/design-system';
import type {
  Categories,
  Modalities,
  SearchModalities,
  SoliguideCountries
} from '@soliguide/common';

/** One 1-click search offered by the highlight card. */
export interface EmergencyQuickSearch {
  category: Categories;
  /**
   * Names of the search result filters pre-applied to this search. A name that
   * the emergency does not declare is ignored, so a shortcut never produces a
   * filter the results page cannot turn off again.
   */
  filters?: string[];
}

/** The block pinned on the home page, between the search bar and the category tiles. */
export interface EmergencyHighlight {
  titleKey: string;
  descriptionKey: string;
  /** Imported image asset: the import resolves to the final URL at build time. */
  iconUrl: string;
  /** Oversized icon watermarked behind the card. Omit to leave the card flat. */
  backgroundIcon?: ComponentType;
  quickSearches: EmergencyQuickSearch[];
}

/** The extra toggle added to the results page filter bar. */
export interface EmergencyFilter {
  /** URL query parameter, toggle identifier and analytics label, e.g. "airConditioned". */
  name: string;
  translationKey: string;
  icon: ComponentType;
  /** Merged into the modalities sent to the search API when the toggle is on. */
  modalities: SearchModalities;
}

/** A tag ready to render: the components read nothing else. */
export interface EmergencyTag {
  translationKey: string;
  variant: DSTypes.TagVariant;
}

/**
 * The place data a tag rule may read. Limited to the modalities, which is what
 * an emergency qualifies a place on; widening it later means touching the two
 * mappers of `$lib/models` and nothing else.
 */
export interface EmergencyTagSubject {
  modalities: Modalities;
}

export interface EmergencyTagRule {
  icon: ComponentType;
  /** The tag to show for this place, or null when the place says nothing useful. */
  resolve: (subject: EmergencyTagSubject) => EmergencyTag | null;
}

/**
 * One emergency situation: an exceptional event (heatwave, cold snap) or a
 * taxonomy highlight, made visible across the application.
 *
 * The three surfaces are independent and optional: an emergency may only
 * highlight categories on the home page, or only add a filter.
 */
export interface EmergencyDefinition {
  /** Stable identifier, also reported as an analytics property. */
  id: string;
  /** The single switch. Turning it off removes every surface at once. */
  active: boolean;
  countries: SoliguideCountries[];
  highlight?: EmergencyHighlight;
  filter?: EmergencyFilter;
  tag?: EmergencyTagRule;
}
