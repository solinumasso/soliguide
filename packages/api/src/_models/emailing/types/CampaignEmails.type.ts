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

import { CampaignNameAndAll, AnyDepartmentCode } from "@soliguide/common";
import { EmailEvents } from "./EmailEvents.type";
import { CampaignEmailName } from "./CampaignEmailName.type";
import { EmailData } from "./EmailData.type";

export type CampaignEmails = {
  campaign: CampaignNameAndAll;

  info: {
    organization: any | mongoose.Types.ObjectId | string;
    organization_id: number;

    places?: (any | mongoose.Types.ObjectId | string)[];
    placesId?: number[];

    territory: AnyDepartmentCode;

    user: User | mongoose.Types.ObjectId | string;
    user_id: number;
  };

  lastStatus: EmailEvents;
  lastUpdate: Date | null;

  emailData: EmailData;

  mailgunEmailId: string;

  emailType: CampaignEmailName;

  recipientEmail: string;

  senderEmail: string;

  status: {
    [key in EmailEvents]: {
      date: Date | null;
      value: boolean;
    };
  };
};

export type BodyValidatedCampaignEmails = {
  emailType: CampaignEmailName;
  territories: AnyDepartmentCode[];
};
