import { StructureType } from "../../structure-type";
import { SoliguideCountries } from "../../location/enums";
import { AnyDepartmentCode } from "../../location/types";
import { CampaignLifecycleStatus } from "../enums/CampaignLifecycleStatus.enum";
import { CampaignSectionPath } from "../constants/CAMPAIGN_SECTION_PATHS.const";

/**
 * Une campagne (nouveau modèle). Une entrée par campagne dans la
 * collection `campaigns`.
 *
 * Remplace le modèle historique où les campagnes étaient hardcodées
 * dans les schémas Mongoose de `place` et `organization` (crisis campaigns).
 */
export interface Campaign {
  /** Identifiant unique lisible (URL slug). Regex : `^[a-z0-9-]+$`. */
  slug: string;

  /** Libellé affiché (multilingue par translation key ou libellé direct). */
  name: string;

  /** Description longue affichée en tête du parcours (optionnelle). */
  description: string | null;

  status: CampaignLifecycleStatus;

  /** Pays cible unique (une campagne ne cible qu'un pays). */
  country: SoliguideCountries;

  /**
   * Territoires (départements) ciblés dans le pays. `[]` = tout le pays.
   * Chaque code doit appartenir au `country` de la campagne.
   */
  territories: AnyDepartmentCode[];

  /**
   * Types de structure ciblés. `[]` = tous types (aucun filtre par type).
   * Voir la décision D2 pour le comportement `structureTypes: []` côté fiche.
   */
  structureTypes: StructureType[];

  /**
   * Sections activées dans le parcours, dans l'ordre d'affichage.
   * Chaque valeur est un `CampaignSectionPath` (URL segment).
   */
  sectionsToUpdate: CampaignSectionPath[];

  /** Début de la campagne (inclusif). */
  startDate: Date;

  /** Fin de la campagne (inclusif). Doit être `> startDate`. */
  endDate: Date;

  createdAt: Date;
  updatedAt: Date;
}
