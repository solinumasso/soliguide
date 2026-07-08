import { CampaignLifecycleStatus, SoliguideCountries } from "@soliguide/common";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { CampaignModel } from "../models/campaign.model";

/**
 * Liste les campagnes ACTIVE pour le `country` passé en query param.
 *
 * Le frontend admin passe `country = THEME_CONFIGURATION.country` (comme pour
 * `SearchUsersObject`) : la page "campagnes de mises à jour exceptionnelles"
 * n'affiche que les campagnes dont les liens `campaign-temp-forms` cibleront
 * des users PRO du même pays.
 *
 * Accès borné à `ADMIN_SOLIGUIDE` côté route (`checkRights`).
 */
export const getActiveCampaigns = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const country = req.query.country as SoliguideCountries | undefined;

  if (!country) {
    return res.status(400).json({ message: "COUNTRY_REQUIRED" });
  }

  const campaigns = await CampaignModel.find({
    country,
    status: CampaignLifecycleStatus.ACTIVE,
  })
    .sort({ startDate: -1 })
    .lean();

  return res.status(200).json(campaigns);
};
