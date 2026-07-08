import {
  CAMPAIGN_SECTION_PATHS,
  CampaignSectionPath,
} from "../constants/CAMPAIGN_SECTION_PATHS.const";

const VALID_PATHS = new Set<string>(CAMPAIGN_SECTION_PATHS);

/**
 * Filtre + dédup + réordonne une liste de section paths.
 *
 * - Retire les valeurs qui ne matchent pas `CAMPAIGN_SECTION_PATHS`
 *   (protection contre les inputs API mal formés / obsolètes).
 * - Dédup préservant la 1ère occurrence.
 * - Réordonne selon l'ordre canonique de `CAMPAIGN_SECTION_PATHS`
 *   (ordre du stepper front — pas l'ordre d'insertion utilisateur).
 */
export function normalizeSectionPaths(
  paths: readonly string[]
): CampaignSectionPath[] {
  const seen = new Set<string>();
  for (const path of paths) {
    if (VALID_PATHS.has(path)) {
      seen.add(path);
    }
  }
  return CAMPAIGN_SECTION_PATHS.filter((path) => seen.has(path));
}
