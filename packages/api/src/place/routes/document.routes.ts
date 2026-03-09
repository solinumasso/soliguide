import express from "express";

const router = express.Router();

import type { ExpressRequest, ExpressResponse } from "../../_models";

import { getPlaceFromUrl, canEditPlace, mediaGuards } from "../../middleware";
import { addDocument, uploadDocument, deleteDocument } from "../controllers";

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: All routes related to documents
 */

/**
 * @swagger
 *
 * /documents/:lieu_id
 *   post:
 *     description: Uploads a document for a particular place
 *     tags: [Documents]
 *     parameters:
 *       - name: placeType
 *         in: path
 *         required: true
 *         type: string
 *       - name: place Id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Docs
 *       403:
 *         description: FORBIDDEN
 *       422:
 *         description: Invalid data
 */
router.post(
  "/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  mediaGuards.canUploadDocument,
  uploadDocument,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const doc = await addDocument(req.lieu, req.file, req.body);
      return res.status(200).json(doc);
    } catch (err) {
      req.log.error(err);
      return res.status(500).json({ message: "ADD_DOCUMENT_PLACE_ERROR" });
    }
  }
);

/**
 * @swagger
 *
 * /documents/:placeType:/:lieu_id/:documentObjectId/:serviceId?
 *   delete:
 *     description: Deletes a document from the database
 *     tags: [Documents]
 *     parameters:
 *       - name: placeType
 *         in: path
 *         required: true
 *         type: string
 *       - name: lieu_id
 *         in: path
 *         required: true
 *         type: string
 *       - name: serviceId
 *         in: path
 *         required: false
 *         type: string
 *       - name: documentObjectId
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: place
 *       403:
 *         description: FORBIDDEN
 */
router.delete(
  "/:lieu_id/:documentObjectId/:serviceId?",
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const place = await deleteDocument(
        req.lieu,
        req.params.documentObjectId,
        req.params?.serviceId
      );
      return res.status(200).json(place);
    } catch (err) {
      req.log.error(err);
      return res.status(500).json({ message: "DELETE_DOCUMENT_PLACE_ERROR" });
    }
  }
);
export default router;
