/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Themes } from "../../../themes";
import { Categories } from "../../enums";
import {
  getSpanishCategories,
  getAndorraCategories,
  generateCategoriesByTheme,
} from "../generateCategoriesByTheme";

describe("Country-specific categories", () => {
  const spanishResults = getSpanishCategories();
  const andorraResults = getAndorraCategories();
  const frenchResults = generateCategoriesByTheme(Themes.SOLIGUIDE_FR);

  it("should include Spanish-specific categories in Spanish theme", () => {
    const spanishCategories = spanishResults.filter(
      (category) => category.id === Categories.SPANISH_COURSE
    );

    expect(spanishCategories.length).toBeGreaterThan(0);

    const frenchCourseCategories = spanishResults.filter(
      (category) => category.id === Categories.FRENCH_COURSE
    );

    expect(frenchCourseCategories.length).toBe(0);
    // Check if Spanish course is correctly linked to Training and Jobs category
    const trainingCategory = spanishResults.find(
      (category) => category.id === Categories.TRAINING_AND_JOBS
    );

    expect(trainingCategory).toBeDefined();

    if (trainingCategory) {
      expect(
        trainingCategory.children.some(
          (child) => child.id === Categories.SPANISH_COURSE
        )
      ).toBeTruthy();
    }
  });

  it("should include Catalan course in Spanish theme", () => {
    const catalanInSpanish = andorraResults.filter(
      (category) => category.id === Categories.CATALAN_COURSE
    );

    expect(catalanInSpanish.length).toBeGreaterThan(0);
  });

  it("should include Catalan course in Andorra theme", () => {
    const results = getAndorraCategories();

    const catalanInAndorra = results.filter(
      (category) => category.id === Categories.CATALAN_COURSE
    );

    expect(catalanInAndorra.length).toBeGreaterThan(0);
  });

  it("should include Spanish course in Andorra theme", () => {
    const results = getAndorraCategories();

    // Check that Spanish course exists in Andorra theme
    const spanishInAndorra = results.filter(
      (category) => category.id === Categories.SPANISH_COURSE
    );

    expect(spanishInAndorra.length).toBeGreaterThan(0);
  });

  it("should include Legal protection ONLY in Andorra theme", () => {
    // Check if Legal Protection is correctly linked to Counseling category
    const counselingCategory = andorraResults.find(
      (category) => category.id === Categories.COUNSELING
    );

    expect(counselingCategory).toBeDefined();

    // Check that Legal protection exists in Andorra theme
    const legalProtectionInAndorra = counselingCategory?.children.find(
      (category) => category.id === Categories.LEGAL_PROTECTION
    );
    expect(legalProtectionInAndorra).toBeDefined();

    const spanishCouneling = spanishResults.find(
      (category) => category.id === Categories.COUNSELING
    );

    const legalProtectionInSpain = spanishCouneling?.children.find(
      (category) => category.id === Categories.LEGAL_PROTECTION
    );

    expect(legalProtectionInSpain).toBeUndefined();

    // Verify Legal Protection does NOT exist in French theme
    const legalProtectionInFrench = frenchResults.filter(
      (category) => category.id === Categories.LEGAL_PROTECTION
    );
    expect(legalProtectionInFrench.length).toBe(0);
  });

  it("should include Domiciliation ONLY in France theme", () => {
    const domiciliationInAndorra = andorraResults.find(
      (category) => category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInAndorra).toBeUndefined();

    const domiciliationInSpain = spanishResults.find(
      (category) => category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInSpain).toBeUndefined();

    const domiciliationInFrance = frenchResults.find(
      (category) => category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInFrance).toBeDefined();
  });
});
