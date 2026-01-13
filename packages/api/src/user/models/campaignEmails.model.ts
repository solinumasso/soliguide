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
import mongoose from "mongoose";
import type { UserCampaignEmails } from "../../_models/users";
import { EmailEvents } from "../../_models/emailing";
import { UserCampaignEmails } from "../types";

const DEFAULT_VALUE = {
  done: { default: false, type: Boolean },
  ready: { default: false, type: Boolean },
  sendDate: { default: null, type: Date },
};

export const CampaignEmailsSchema = new mongoose.Schema<UserCampaignEmails>(
  {
    CAMPAGNE_COMPTES_PRO: DEFAULT_VALUE,
    CAMPAGNE_INVITATIONS: DEFAULT_VALUE,
    RELANCE_CAMPAGNE_COMPTES_PRO: DEFAULT_VALUE,
    RELANCE_CAMPAGNE_INVITATIONS: DEFAULT_VALUE,
    RELANCE_DESESPOIR_COMPTES_PRO: DEFAULT_VALUE,
    RELANCE_DESESPOIR_INVITATIONS: DEFAULT_VALUE,
    RELANCE_TERMINER_MAJ: DEFAULT_VALUE,

    lastEmailStatus: {
      default: EmailEvents.TO_SEND,
      enum: EmailEvents,
      type: String,
    },
  },
  {
    strict: true,
    _id: false,
  }
);
