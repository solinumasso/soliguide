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
import {
  CampaignPlaceAutonomy,
  CampaignSource,
  CampaignStatus,
  KeyStringValueString,
  KeyUserStatusValueString,
  PairingSources,
  PlaceStatus,
} from "@soliguide/common";

import {
  KeyPlaceTypeValueString,
  KeyPlaceVisibilityValueString,
} from "../types";

import { KeyPlaceOpeningStatusValueString } from "../../_models";

export const USER_STATUS: KeyUserStatusValueString = {
  ADMIN_SOLIGUIDE: "Administrateur Soliguide",
  ADMIN_TERRITORY: "Administrateur de territoire",
  API_USER: "Utilisateur de l'API",
  PRO: "Pro",
  SIMPLE_USER: "Simple utilisateur",
  SOLI_BOT: "Solibot",
  VOLUNTEER: "Bénévole",
  WIDGET_USER: "Utilisateur du widget",
} as const;

export const EMAIL_STATUS: KeyStringValueString = {
  BOUNCED_PERM: "Rejeté",
  BOUNCED_TEMP: "Rejeté",
  CLICKED: "Cliqué",
  DELIVERED: "Reçu",
  DISABLED: "Désactivé",
  HUMAN_RESPONSE: "Répondu",
  OPENED: "Ouvert",
  PENDING: "En attente",
  REJECTED: "Rejeté",
  SENT: "Envoyé",
  SPAM: "Spam",
  TO_SEND: "",
} as const;

export const PLACE_OPENING_STATUS: KeyPlaceOpeningStatusValueString = {
  CLOSED: "Fermé",
  OPENED: "Ouvert",
} as const;

export const PLACE_STATUS: { [key in PlaceStatus | "DELETED"]: string } = {
  PERMANENTLY_CLOSED: "Fermé définitivement",
  DELETED: "Supprimé",
  DRAFT: "Brouillon",
  OFFLINE: "Hors-ligne",
  ONLINE: "En ligne",
} as const;

export const PLACE_VISIBILITY: KeyPlaceVisibilityValueString = {
  ALL: "Visible à tout⋅e⋅s",
  PRO: "Réservées aux pros",
} as const;

export const PLACE_STATUS_MAJ: Record<CampaignStatus, string> = {
  FINISHED: "Finie",
  STARTED: "Commencée",
  TO_DO: "Pas commencée",
} as const;

export const PLACE_AUTONOMY_MAJ: Record<CampaignPlaceAutonomy, string> = {
  AUTONOMOUS: "Màj autonome",
  NOT_AUTONOMOUS: "Màj manuelle",
  SEMI_AUTONOMOUS: "Màj semi-autonome",
  UNKNOWN: "Niveau d'autonomie pas encore calculé",
} as const;

export const PLACE_TYPE: KeyPlaceTypeValueString = {
  LIEU: "Structure",
  PARCOURS_MOBILE: "Parcours mobile",
} as const;

export const PLACE_CAMPAIGN_SOURCE: Record<CampaignSource, string> = {
  CALL: "Appel",
  CONTACT: "Contact",
  COORDINATION: "Coordination",
  INTERNET: "Internet",
  EMAIL: "Email",
  CHAT: "Tchat",
  VISIT: "Visite",
} as const;

export const PLACE_EXTERNAL_SOURCES: Record<PairingSources, string> = {
  [PairingSources.ALISOL]: "Alisol",
  [PairingSources.CD59]: "Conseil Départemental du 59",
  [PairingSources.CRF]: "Croix-Rouge française",
  [PairingSources.CROUS_PDL]: "Crous Pays de la Loire",
  [PairingSources.DORA]: "Dora",
  [PairingSources.RESTOS]: "Restos du Cœur",
  [PairingSources.SSVP]: "Société Saint Vincent de Paul",
} as const;
