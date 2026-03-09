import { TranslatedFieldElement } from "@soliguide/common";

export const TRANSLATED_FIELDS_PARAMS: {
  [key in TranslatedFieldElement]: {
    label: string;
    editor: "input" | "ckeditor" | "textarea";
  };
} = {
  description: { label: "Description de la structure", editor: "ckeditor" },
  "modalities.appointment.precisions": {
    label: "Précisions sur le rendez-vous",
    editor: "input",
  },
  "modalities.inscription.precisions": {
    label: "Précisions sur l'inscription",
    editor: "input",
  },
  "modalities.orientation.precisions": {
    label: "Précisions sur l'orientation",
    editor: "input",
  },
  "modalities.price.precisions": {
    label: "Précisions sur la participation financière requise",
    editor: "textarea",
  },
  "modalities.other": {
    label: "Autres précisions sur les modalités",
    editor: "textarea",
  },
  "publics.description": {
    label: "Information complémentaire sur le public accueilli",
    editor: "textarea",
  },
  "tempInfos.closure.description": {
    label: "Raison de la fermeture",
    editor: "textarea",
  },
  "tempInfos.hours.description": {
    label: "Détails sur les horaires temporaires",
    editor: "textarea",
  },
  "tempInfos.message.description": {
    label: "Description d'une info temporaire",
    editor: "ckeditor",
  },
  "tempInfos.message.name": {
    label: "Titre d'une info temporaire",
    editor: "input",
  },
  "service.description": {
    label: "Description d'un service",
    editor: "ckeditor",
  },
  "service.modalities.appointment.precisions": {
    label: "Précisions sur le rendez-vous dans un service",
    editor: "input",
  },
  "service.modalities.inscription.precisions": {
    label: "Précisions sur l'inscription dans un service",
    editor: "input",
  },
  "service.modalities.orientation.precisions": {
    label: "Précisions sur l'orientation dans un service",
    editor: "input",
  },
  "service.modalities.price.precisions": {
    label: "Précisions sur la participation financière requise dans un service",
    editor: "textarea",
  },
  "service.modalities.other": {
    label: "Autres précisions sur les modalités dans un service",
    editor: "textarea",
  },
  "service.publics.description": {
    label:
      "Informations complémentaires sur le public accueilli dans un service",
    editor: "textarea",
  },
  "service.saturated.precision": {
    label: "Précisions sur la fréquentation dans un service",
    editor: "textarea",
  },
  "service.categorySpecificFields.jobsList": {
    label: "Liste des métiers disponibles",
    editor: "input",
  },
  "service.categorySpecificFields.wellnessActivityName": {
    label: "Activités bien-être proposée",
    editor: "input",
  },
  "service.categorySpecificFields.activityName": {
    label: "Activité proposée",
    editor: "input",
  },
  "service.categorySpecificFields.usageModality": {
    label: "Modalité d'utilisation",
    editor: "input",
  },
  "service.categorySpecificFields.voucherTypePrecisions": {
    label: "Précisions sur le type de bons",
    editor: "textarea",
  },
  "service.categorySpecificFields.otherProductTypePrecisions": {
    label: "Précisions sur les autres produits proposés",
    editor: "textarea",
  },
  "service.categorySpecificFields.availableEquipmentPrecisions": {
    label: "Précisions sur le type d'équipement disponible",
    editor: "textarea",
  },

  // [CATEGORY] TO REMOVE
  "service.jobsList": {
    label: "Liste des métiers disponibles",
    editor: "input",
  },
};
