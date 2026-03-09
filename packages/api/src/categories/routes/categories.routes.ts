import { Router } from "express";

const router = Router();

import { ExpressRequest, ExpressResponse } from "../../_models";

import { getAllCategories } from "../controllers/categories.controller";
import { checkRights } from "../../middleware";
import { UserStatus } from "@soliguide/common";
import { TypeCategoriesServiceNotFromThemeEnum } from "../enums/type-categories-service-not-from-theme.enum";
import { getServiceCategoriesApi } from "../functions/get-service-categories-api.function";

router.get(
  "/",
  checkRights([
    UserStatus.ADMIN_SOLIGUIDE,
    UserStatus.ADMIN_TERRITORY,
    UserStatus.API_USER,
  ]),
  (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const categoryService = getServiceCategoriesApi(
        TypeCategoriesServiceNotFromThemeEnum.V2
      );
      req.requestInformation.categoryService = categoryService;
      const categories = getAllCategories(req);
      return res.json(categories);
    } catch (e) {
      return res.status(400).json({
        message: "CATEGORIES_NOT_FOUND",
      });
    }
  }
);

export default router;
