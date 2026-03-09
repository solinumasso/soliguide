import express from "express";

import { displayContactProDto } from "../../user/dto";

import {
  getPlaceFromUrl,
  canGetPlace,
  canEditPlace,
  getFilteredData,
  canGetContact,
} from "../../middleware";
import type {
  ExpressRequest,
  ExpressResponse,
  UserRightUserPopulate,
} from "../../_models";
import {
  getContactsProForPlace,
  getContactsProForPlaceAdmin,
  patchDisplayContactPro,
} from "../controllers";

const router = express.Router();

/**
 * @summary Get a place's contacts
 */
router.get(
  "/:lieu_id",
  getPlaceFromUrl,
  canGetPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getContactsProForPlace(req.lieu);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_ROLES_FOR_FICHE_FAIL");
      return res.status(400).json({ message: "GET_ROLES_FOR_FICHE_FAIL" });
    }
  }
);

router.get(
  "/:lieu_id/admin",
  getPlaceFromUrl,
  canGetPlace,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getContactsProForPlaceAdmin(req.lieu, req.user);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_ROLES_FOR_FICHE_FAIL");
      return res.status(400).json({ message: "GET_ROLES_FOR_FICHE_FAIL" });
    }
  }
);

/**
 * @summary Update the contact visibility
 */
router.patch(
  "/display-contact/:userRightObjectId",
  canGetContact,
  displayContactProDto,
  getFilteredData,
  async (
    req: ExpressRequest & {
      selectedUserRight: UserRightUserPopulate;
    },
    res: ExpressResponse
  ) => {
    try {
      await patchDisplayContactPro(req.selectedUserRight, req.bodyValidated);
      return res.status(200).json({ message: "OK" });
    } catch (e) {
      req.log.error(e, "PATCH_CONTACT_FAIL");
      return res.status(400).json({ message: "PATCH_CONTACT_FAIL" });
    }
  }
);

export default router;
