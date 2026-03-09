import { Categories } from "../../categories";

export function getCategoryTranslationKey(
  category: string | Categories | null
): string {
  return category ? `CAT_${category.toUpperCase()}` : "";
}
