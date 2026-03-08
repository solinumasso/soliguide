import { Pipe, PipeTransform } from "@angular/core";
import { Categories } from "@soliguide/common";

/**
 * Pipe pour transformer une valeur de catégorie en clé de traduction.
 * Ajoute le préfixe 'CAT_' et convertit en majuscules.
 *
 * @example
 * {{ 'health' | categoryTranslateKey }} // 'CAT_HEALTH'
 * {{ Categories.FOOD | categoryTranslateKey }} // 'CAT_FOOD'
 */
@Pipe({ name: "categoryTranslateKey" })
export class CategoryTranslateKeyPipe implements PipeTransform {
  public transform(category: string | Categories): string {
    return `CAT_${(category || "").toUpperCase()}`;
  }
}
