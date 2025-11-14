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

import { generateEmailsDto } from "../dto";

import { checkRights, getFilteredData } from "../../middleware";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { UserStatus } from "@soliguide/common";

const router = express.Router();

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
let isGenerating = false;
let generationStartedAt: number | null = null;

router.post(
  "/generate-campaign-emails",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  generateEmailsDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    if (isGenerating) {
      const elapsed = Date.now() - (generationStartedAt || 0);
      const elapsedMinutes = Math.floor(elapsed / 1000 / 60);
      return res.status(409).json({
        error: `GENERATION IN PROGRESS FOR ${elapsedMinutes}min`,
      });
    }

    isGenerating = true;
    generationStartedAt = Date.now();
    const frontUrl = req.requestInformation.frontendUrl;
    const bodyValidated = req.bodyValidated;

    res.status(202).json({ message: "GENERATION STARTED" });

    generateCampaignEmails(bodyValidated, frontUrl, req.log)
      .catch((e) => {
        req.log.error(e, "GENERATE_CAMPAIGN_EMAILS_CONTENT_FAILED");
      })
      .finally(() => {
        isGenerating = false;
        generationStartedAt = null;
      });
  }
);

export default router;
