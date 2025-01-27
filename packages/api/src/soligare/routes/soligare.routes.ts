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
import { checkRights } from "../../middleware";
import { UserStatus } from "@soliguide/common";
import { CONFIG, ExpressRequest, ExpressResponse } from "../../_models";
import axios from "axios";

const router = express.Router();

router.post(
  "/source/available",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const search = req.body;

    try {
      const result = await axios.post(
        `${CONFIG.SOLIGARE_URL}source/available`,
        search
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

router.get(
  "/source/details/:source_id",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const sourceId = req.params.source_id;

    try {
      const result = await axios.get(
        `${CONFIG.SOLIGARE_URL}source/details/${sourceId}`
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

router.post(
  "/pairing/to-pair",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const search = req.body;

    try {
      const result = await axios.post(
        `${CONFIG.SOLIGARE_URL}pairing/to-pair`,
        search
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

router.get(
  "/pairing/external-structure/:source_id",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const sourceId = req.params.source_id;

    try {
      const result = await axios.get(
        `${CONFIG.SOLIGARE_URL}pairing/external-structure/${sourceId}`
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

router.post(
  "/pairing/pair",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const search = req.body;

    try {
      const result = await axios.post(
        `${CONFIG.SOLIGARE_URL}pairing/pair`,
        search
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error?.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

router.delete(
  "/pairing/pair/:soliguide_id",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const soliguideId = req.params.soliguide_id;

    try {
      const result = await axios.delete(
        `${CONFIG.SOLIGARE_URL}pairing/pair/${soliguideId}`
      );

      return res.status(result.status).json(result.data);
    } catch (error) {
      if (error?.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json("Something went wrong");
    }
  }
);

export default router;
