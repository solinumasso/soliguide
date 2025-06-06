import { param } from "express-validator";

export const validateSoligareUuid = param("soliguideUuid")
  .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4,5}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  .withMessage("soliguideUuid should be an uuid");
