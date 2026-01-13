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
import { EmailEvents } from "../../../_models";
import { UserCampaignEmailsValue, UserCampaignEmails } from "../../types";

const VALUE: UserCampaignEmailsValue = {
  done: false,
  ready: false,
  sendDate: null,
};

export const CAMPAIGN_EMAILS_CONTENT_FOR_USERS: UserCampaignEmails = {
  CAMPAGNE_COMPTES_PRO: VALUE,
  CAMPAGNE_INVITATIONS: VALUE,
  RELANCE_CAMPAGNE_COMPTES_PRO: VALUE,
  RELANCE_CAMPAGNE_INVITATIONS: VALUE,
  RELANCE_DESESPOIR_COMPTES_PRO: VALUE,
  RELANCE_DESESPOIR_INVITATIONS: VALUE,
  RELANCE_TERMINER_MAJ: VALUE,
  lastEmailStatus: EmailEvents.TO_SEND,
};
