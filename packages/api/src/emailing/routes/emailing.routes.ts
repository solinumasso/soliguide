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
import express from "express";

import { generateCampaignEmails } from "../controllers/campaign-email.controller";
import {
  findOneEmail,
  searchEmail,
} from "../controllers/email-manager.controller";

import { generateEmailsDto, emailingSearchDto, sendEmailsDto } from "../dto";

import { sendCampaignEmails } from "../senders";

import { checkRights, getFilteredData } from "../../middleware";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { UserStatus } from "@soliguide/common";
import { campaignState } from "../utils/campaignState";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Emailing
 *   description: All routes related to emails for the update campaign
 */

/**
 * @swagger
 *
 * /emailing/search
 *   post:
 *     description: get emails
 *     tags: [Emailing]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:
 *       500 :
 *         description:
 */
router.post(
  "/search",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  emailingSearchDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const response = await searchEmail(req.bodyValidated, req?.user);
      return res.status(200).json(response);
    } catch (e) {
      req.log.error(e, "SEARCH_EMAIL_FAILED");
      return res.status(500).json("SEARCH_EMAIL_FAILED");
    }
  }
);

/**
 * @swagger
 *
 * /emailing/send-campaign-emails
 *   post:
 *     description: send campaign emails
 *     tags: [Emailing]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:
 *       500 :
 *         description:
 */
router.post(
  "/send-campaign-mails",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  sendEmailsDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const response = await sendCampaignEmails(
        req.bodyValidated.typeMail,
        req.bodyValidated.limit,
        req.log
      );

      return res.status(200).json(response);
    } catch (e) {
      req.log.error(e, "SEND_CAMPAIGN_EMAILS_CONTENT_FAILED");
      return res.status(500).json("SEND_CAMPAIGN_EMAILS_CONTENT_FAILED");
    }
  }
);

/**
 * @swagger
 *
 * /emailing/generate-campaign-emails
 *   post:
 *     description: generates campaign emails
 *     tags: [Emailing]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:
 *       500 :
 *         description:
 */
router.post(
  "/generate-campaign-emails",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  generateEmailsDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    if (!campaignState.isGenerating) {
      try {
        campaignState.isGenerating = true;
        const frontUrl = req.requestInformation.frontendUrl;

        const bodyValidated = req.bodyValidated;
        const response = await generateCampaignEmails(
          bodyValidated,
          frontUrl,
          req.log
        );

        return res.status(200).json(response);
      } catch (e) {
        req.log.error(e, "GENERATE_CAMPAIGN_EMAILS_CONTENT_FAILED");
        return res.status(500).json("GENERATE_CAMPAIGN_EMAILS_CONTENT_FAILED");
      } finally {
        campaignState.isGenerating = false;
      }
    }
  }
);

/**
 * @swagger
 *
 * /emailing/:emailObjectId
 *   get:
 *     description: gets a particular email
 *     tags: [Emailing]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:
 *       500 :
 *         description:
 */
router.get(
  "/:emailObjectId",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const response = await findOneEmail(req.params.emailObjectId);
      return res.status(200).json(response);
    } catch (e) {
      req.log.error(e, "EMAIL_NOT_FOUND");
      return res.status(500).json("EMAIL_NOT_FOUND");
    }
  }
);

export default router;
