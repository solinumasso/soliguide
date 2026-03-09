export type CampaignObject = {
  // Changement sur la fiche ?
  changes: boolean;
  // Date à laquelle le formulaire a été complété pour la première fois
  date: Date;
  // Fiche concernée par la campagne ?
  toUpdate: boolean;
  // Fiche mise à jour ?
  updated: boolean;
};
