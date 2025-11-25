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

import EmailCampaignModel from "../models/email-campaign.model";

import { CampaignEmails, ModelWithId } from "../../_models";

import { PLACE_FIELDS_FOR_USERS } from "../../user/constants/FIELDS_TO_SELECT_FOR_POPULATE.const";

export const findEmails = async (
  searchRequest: any,
  options: any
): Promise<ModelWithId<CampaignEmails>[]> => {
  return await EmailCampaignModel.find(searchRequest)
    .limit(options.limit)
    .skip(options.skip)
    .sort(options.sort)
    .collation({ locale: "fr", strength: 1 })
    .populate({ path: "info.organization", select: "organization_id name" })
    .lean<ModelWithId<CampaignEmails>[]>()
    .exec();
};

export const findOne = async (
  _id: string
): Promise<ModelWithId<CampaignEmails> | null> => {
  return await EmailCampaignModel.findOne({
    _id: new mongoose.Types.ObjectId(_id),
  })
    .populate([
      { path: "info.organization", select: "organization_id name" },
      {
        path: "info.organization",
        populate: { path: "places", select: PLACE_FIELDS_FOR_USERS },
      },
    ])
    .lean<ModelWithId<CampaignEmails>>()
    .exec();
};

export const countEmailsManage = async (
  searchRequest: any
): Promise<number> => {
  return await EmailCampaignModel.countDocuments(searchRequest);
};

export const updatOneEmailCampaign = async (
  params: any,
  data: any
): Promise<ModelWithId<CampaignEmails> | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return await EmailCampaignModel.findOneAndUpdate(
    params,
    { $set: data },
    { new: true }
  )
    .populate({ path: "info.places", select: PLACE_FIELDS_FOR_USERS })
    .lean<ModelWithId<CampaignEmails>>()
    .exec();
};

export const insertMany = async (documents: any) => {
  return await EmailCampaignModel.insertMany(documents);
};
