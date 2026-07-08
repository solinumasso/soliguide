import { body, param } from "express-validator";

// Campaign slug : `^[a-z0-9-]+$` (aligné avec la validation Mongoose).
// `trim` + `toLowerCase` + `escape` + `blacklist` : défense en profondeur.
// Le regex empêche déjà tout caractère spécial, mais on sanitise avant
// l'usage aval (log, requête Mongo, template email).
export const campaignSlugParam = param("campaignSlug")
  .isString()
  .trim()
  .toLowerCase()
  .isLength({ min: 3, max: 64 })
  .matches(/^[a-z0-9-]+$/)
  .blacklist("^a-z0-9-")
  .escape();

// UUID v1/v4/v5. `toLowerCase` : normalise la casse (les liens Brevo peuvent
// arriver majuscules) pour matcher l'index MongoDB.
export const campaignUserUuidParam = param("campaignUserUuid")
  .isString()
  .trim()
  .toLowerCase()
  .isUUID();

export const lieuIdParam = param("lieu_id").isInt({ min: 1 }).toInt();

// null | true | false — tri-state (Oui / Non / Non renseigné) aligné avec l'UI
// thermal-comfort existante.
export const airConditionedBody = body("airConditioned").custom(
  (value) => value === null || typeof value === "boolean"
);
