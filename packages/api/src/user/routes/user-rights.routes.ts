import express from "express";

import { userRightsDto } from "../dto/userRights.dto";

import { ExpressRequest, ExpressResponse } from "../../_models";
import {
  canEditOrga,
  canGetOrga,
  getFilteredData,
  getOrgaFromUrl,
  getUserFromUrl,
  getPlaceFromUrl,
  canEditUser,
} from "../../middleware";
import {
  canEditPlace,
  getUserRightsForOrganization,
  patchUserRights,
} from "../controllers/user-rights.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /place/can-edit/{id}:
 *   get:
 *     description: check if a User can edit a Place
 *     tags: [Place]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: boolean
 *       404 :
 *         description: GET_RIGHTS_ON_PLACE_FAIL
 */
router.get(
  "/can-edit/:lieu_id",
  getPlaceFromUrl,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await canEditPlace(req.user, req.lieu);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_RIGHTS_ON_PLACE_FAIL");
      return res.status(500).json({ message: "GET_RIGHTS_ON_PLACE_FAIL" });
    }
  }
);

/**
 * @summary Get user rights for an organization
 */
router.get(
  "/:orgaObjectId",
  getOrgaFromUrl,
  canGetOrga,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getUserRightsForOrganization(req.organization);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_RIGHTS_FOR_ORGA_FAIL");
      return res.status(400).json({ message: "GET_RIGHTS_FOR_ORGA_FAIL" });
    }
  }
);

/**
 * @summary Update the user rights in an organization
 */
router.patch(
  "/:orgaObjectId/:userObjectId",
  getOrgaFromUrl,
  canEditOrga,
  getUserFromUrl,
  canEditUser,
  userRightsDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.selectedUser) {
        throw new Error("No user in request");
      }
      const result = await patchUserRights(
        req.selectedUser,
        req.organization,
        req.bodyValidated
      );

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "UPDATE_RIGHTS_FAIL");
      return res.status(400).json({ message: "UPDATE_RIGHTS_FAIL" });
    }
  }
);

export default router;
