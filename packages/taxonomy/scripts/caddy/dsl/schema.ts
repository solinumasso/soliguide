import { z } from "zod";
import { Categories } from "@soliguide/common";

/**
 * Source de vérité pour les clés de catégories
 */
export const CategoryKeySchema = z.nativeEnum(Categories);

/**
 * Pays autorisés (alignés avec ton DSL)
 */
export const CountrySchema = z.enum(["FR", "ES", "AD"]);

/**
 * Historique d’un slug
 */
export const CategoryHistoryEntrySchema = z.object({
  slug: z.string().min(1),
  from: z.string().optional(),
  until: z.string().optional(),
});

/**
 * Définition d'une catégorie
 */
export const CategorySchema = z.object({
  slug: z.string().min(1),
  countries: z.array(CountrySchema),
  createdAt: z.string().optional(),
  history: z.array(CategoryHistoryEntrySchema),
});

/**
 * DSL complet avec validation que toutes les catégories de l'enum sont présentes
 */
export const CategoriesDslSchema = z
  .object({
    countries: z.array(CountrySchema),
    categories: z.record(z.string(), CategorySchema),
  })
  .refine(
    (data) => {
      // Obtenir toutes les clés (noms) de l'enum Categories
      const enumKeys = Object.keys(Categories);
      const yamlKeys = Object.keys(data.categories);

      // Vérifier que toutes les catégories de l'enum sont présentes
      const missingCategories = enumKeys.filter((key) => !yamlKeys.includes(key));
      return missingCategories.length === 0;
    },
    (data) => {
      const enumKeys = Object.keys(Categories);
      const yamlKeys = Object.keys(data.categories);
      const missingCategories = enumKeys.filter((key) => !yamlKeys.includes(key));

      return {
        message: `Missing categories from enum: ${missingCategories.join(", ")}`,
      };
    }
  )
  .refine(
    (data) => {
      // Vérifier qu'il n'y a pas de catégories inconnues
      const enumKeys = Object.keys(Categories);
      const yamlKeys = Object.keys(data.categories);

      const unknownCategories = yamlKeys.filter((key) => !enumKeys.includes(key));
      return unknownCategories.length === 0;
    },
    (data) => {
      const enumKeys = Object.keys(Categories);
      const yamlKeys = Object.keys(data.categories);
      const unknownCategories = yamlKeys.filter((key) => !enumKeys.includes(key));

      return {
        message: `Unknown categories found: ${unknownCategories.join(", ")}`,
      };
    }
  );

/**
 * Types exportés
 */
export type CategoriesDsl = z.infer<typeof CategoriesDslSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryHistoryEntry = z.infer<typeof CategoryHistoryEntrySchema>;
