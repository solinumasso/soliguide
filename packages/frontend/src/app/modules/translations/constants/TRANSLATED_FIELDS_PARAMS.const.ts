/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
