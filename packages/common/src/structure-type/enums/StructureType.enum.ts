/**
 * Typologie canonique des structures santé/social référençables Soliguide.
 *
 * Sert de discriminant fort pour le matching FINESS ↔ Soliguide (même quand
 * les noms divergent) et de critère de ciblage pour les campagnes.
 *
 * Reprise 1:1 depuis solihub (`soliguide-tools/projects/solihub/libs/domain/
 * src/finess/structure-type.model.ts`). Toute évolution doit être synchronisée
 * des deux côtés.
 */
export enum StructureType {
  // Santé mentale
  CMP = "CMP",
  CMPP = "CMPP",
  CATTP = "CATTP",

  // Santé enfant / famille
  PMI = "PMI",

  // Soins courants
  CSNP = "CSNP",
  MSP = "MSP",
  CPTS = "CPTS",

  // Addictologie
  CSAPA = "CSAPA",
  CAARUD = "CAARUD",

  // Santé sexuelle
  CeGIDD = "CeGIDD",
  SANTE_SEXUELLE = "SANTE_SEXUELLE",

  // Santé publique / vaccination
  BCG = "BCG",
  VACCINATION = "VACCINATION",

  // Hébergement médicalisé
  LAM = "LAM",
  LHSS = "LHSS",
  ACT = "ACT",

  // Précarité / dépistage
  CLAT = "CLAT",
  PASS = "PASS",
}

export const STRUCTURE_TYPES = Object.values(StructureType);
