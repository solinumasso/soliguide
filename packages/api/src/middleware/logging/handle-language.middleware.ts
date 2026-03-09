import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models";
import { getUserLanguageFromRequest } from "./services/get-user-language-from-request";

// Set language when we see a params in place's search
export const handleLanguage = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  const selectedLanguageByUser = getUserLanguageFromRequest(req);
  req.userForLogs.language = selectedLanguageByUser;
  // Update with selectedlanguage
  req.requestInformation.language = selectedLanguageByUser;

  next();
};
