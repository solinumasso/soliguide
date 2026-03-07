
import express from "express";
import { checkRights, getFilteredData } from "../../middleware";
import { UserStatus } from "@soliguide/common";
import { CONFIG, ExpressRequest, ExpressResponse } from "../../_models";
import axios from "axios";
import { validateSoligareUuid } from "../dto/soligareUuid.dto";

const router = express.Router();

router.post(
  "/source/available",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const search = req.body;

    try {
      const result = await axios.post(
        `${CONFIG.SOLIGARE_URL}/source/available`,
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
  "/source/details/:soliguideUuid",
  validateSoligareUuid,
  getFilteredData,
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const sourceId = req.bodyValidated.soliguideUuid;

    try {
      const result = await axios.get(
        `${CONFIG.SOLIGARE_URL}/source/details/${sourceId}`
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
        `${CONFIG.SOLIGARE_URL}/pairing/to-pair`,
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
  "/pairing/external-structure/:soliguideUuid",
  validateSoligareUuid,
  getFilteredData,
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const sourceId = req.bodyValidated.soliguideUuid;

    try {
      const result = await axios.get(
        `${CONFIG.SOLIGARE_URL}/pairing/external-structure/${sourceId}`
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
        `${CONFIG.SOLIGARE_URL}/pairing/pair`,
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
  "/pairing/pair/:soliguideUuid",
  validateSoligareUuid,
  getFilteredData,
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const soliguideUuid = req.bodyValidated.soliguideUuid;

    try {
      const result = await axios.delete(
        `${CONFIG.SOLIGARE_URL}/pairing/pair/${soliguideUuid}`
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
