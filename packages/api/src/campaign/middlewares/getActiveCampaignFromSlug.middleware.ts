import { NextFunction } from "express";

import { CampaignLifecycleStatus } from "@soliguide/common";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { CampaignModel } from "../models/campaign.model";

/**
 * Résout et attache la campagne active à `req.campaign`.
 *
 * Réponse `404 NOT_FOUND` indifférenciée si :
 * - le slug est absent (route mal montée),
 * - la campagne n'existe pas,
 * - la campagne n'est pas au statut `ACTIVE`.
 *
 * Prérequis : `campaignSlug` déjà validé (regex `^[a-z0-9-]+$`) par le DTO.
 */
export const getActiveCampaignFromSlug = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const campaignSlug =
    (req.bodyValidated?.campaignSlug as string | undefined) ??
    (req.params.campaignSlug as string | undefined);

  if (!campaignSlug) {
    return res.status(404).json({ message: "NOT_FOUND" });
  }

  const campaign = await CampaignModel.findOne({
    slug: campaignSlug,
    status: CampaignLifecycleStatus.ACTIVE,
  }).lean();

  if (!campaign) {
    return res.status(404).json({ message: "NOT_FOUND" });
  }

  req.campaign = campaign;
  return next();
};
