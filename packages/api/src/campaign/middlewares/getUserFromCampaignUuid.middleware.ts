import { NextFunction } from "express";

import { UserTypeLogged } from "@soliguide/common";

import { ExpressRequest, ExpressResponse, UserFactory } from "../../_models";
import { getUserByCampaignUserUuidWithRights } from "../../user/services";

/**
 * Authentifie un endpoint public `campaign-temp-forms/*` via le
 * `campaignUserUuid` passé en path param.
 *
 * On veut :
 * - Retomber sur la même infra `req.user` / `req.userForLogs` / `canEditPlace`
 *   que les endpoints authentifiés classiques (pour tracer l'auteur d'un
 *   changement dans `placeChanges`, réutiliser `UserRightsCanEditPlace`, etc.).
 * - **Ne rien fuiter** en cas d'échec : même réponse `404 NOT_FOUND` que si le
 *   couple slug/uuid est inconnu ailleurs dans la chaîne.
 *
 * Prérequis : `campaignUserUuid` déjà validé (isUUID + trim) par le DTO
 * `express-validator` en amont.
 */
export const getUserFromCampaignUuid = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const campaignUserUuid =
    (req.bodyValidated?.campaignUserUuid as string | undefined) ??
    (req.params.campaignUserUuid as string | undefined);

  if (!campaignUserUuid) {
    return res.status(404).json({ message: "NOT_FOUND" });
  }

  const user = await getUserByCampaignUserUuidWithRights(campaignUserUuid);

  if (!user || !user.verified || user.blocked) {
    return res.status(404).json({ message: "NOT_FOUND" });
  }

  user.type = UserTypeLogged.LOGGED;
  req.user = UserFactory.createUser(user);

  return next();
};
