import { NextFunction } from "express";

import { Modalities } from "@soliguide/common";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { patchModalities } from "../../place/controllers/admin-place.controller";
import {
  buildCampaignTempFormsPayload,
  buildCampaignTempFormsPayloadForOrga,
} from "../services/campaign-temp-forms.service";

export const getCampaignTempFormsData = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const payload = await buildCampaignTempFormsPayload(
      req.campaign!,
      req.user
    );
    return res.status(200).json(payload);
  } catch (err) {
    req.log.error(err, "CAMPAIGN_TEMP_FORMS_GET_FAILED");
    return next(err);
  }
};

/**
 * Variante admin scoped-orga du GET : `req.organization` déjà résolue par
 * `getOrgaFromUrl`, `req.campaign` par `getActiveCampaignFromSlug`. L'auth
 * `ADMIN_SOLIGUIDE` est appliquée en amont par `checkRights` sur la route.
 */
export const getCampaignTempFormsDataForOrga = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const payload = await buildCampaignTempFormsPayloadForOrga(
      req.campaign!,
      req.organization
    );
    return res.status(200).json(payload);
  } catch (err) {
    req.log.error(err, "CAMPAIGN_TEMP_FORMS_ORGA_GET_FAILED");
    return next(err);
  }
};

/**
 * PATCH `modalities.thermalComfort.airConditioned`.
 *
 * Reprend intégralement le flux `patchModalities` (persist + updateServices +
 * savePatchChanges) : on injecte simplement une modalities complète mergée
 * avec la nouvelle valeur, et on passe le contexte campagne pour tracer
 * `campaignSlug` dans l'entrée `placeChanges`.
 */
export const patchCampaignTempFormsClimate = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const { airConditioned } = req.bodyValidated as {
    airConditioned: boolean | null;
  };

  // On merge la modalities existante avec la nouvelle valeur. `patchModalities`
  // attend la modalities COMPLÈTE sur `req.bodyValidated.modalities` — même
  // contrat que la route admin classique.
  //
  // On profite de ce PATCH pour ré-hydrater la modalities via `new Modalities()`
  // afin de rétablir les défauts sur les fiches historiques dont certains
  // sous-objets (thermalComfort, docs, price, …) sont absents ou partiels.
  req.bodyValidated.modalities = new Modalities({
    ...req.lieu.modalities,
    thermalComfort: {
      ...req.lieu.modalities?.thermalComfort,
      airConditioned,
    },
  });
  req.bodyValidated.forceChanges = false;

  try {
    const { placeChanges, updatedPlace } = await patchModalities(req, {
      isCampaign: true,
      campaignName: req.campaign!.slug,
    });

    req.updatedPlace = updatedPlace;
    req.placeChanges = placeChanges;

    // Audit log : identifie l'auteur du changement pour reconstitution
    // a posteriori. Ne contient aucune donnée sensible (pas de uuid/mail).
    req.log.info(
      {
        campaignSlug: req.campaign?.slug,
        userId: req.user?._id?.toString(),
        user_id: req.user?.user_id,
        lieu_id: req.lieu.lieu_id,
        airConditioned,
      },
      "CAMPAIGN_TEMP_FORMS_UPDATED"
    );

    res.status(200).json({ lieu_id: req.lieu.lieu_id, airConditioned });
    return next();
  } catch (err) {
    req.log.error(err, "CAMPAIGN_TEMP_FORMS_PATCH_FAILED");
    return next(err);
  }
};
