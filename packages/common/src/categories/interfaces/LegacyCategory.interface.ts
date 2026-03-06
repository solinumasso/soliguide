import { Categories } from "../enums";
import type { LegacySeoCategoryId } from "../types/LegacySeoCategoryId.type";

export interface LegacyCategory {
  label: string;
  description?: string;
  seo: LegacySeoCategoryId;
  title: string;
  newCategory: Categories;
}
