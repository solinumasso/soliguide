/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
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

import { CategoryTranslateKeyPipe } from "./category-translate-key.pipe";
import { Categories } from "@soliguide/common";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("CategoryTranslateKeyPipe", () => {
  let pipe: CategoryTranslateKeyPipe;

  beforeEach(() => {
    pipe = new CategoryTranslateKeyPipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should have translations for all Categories enum values", () => {
    const translationPath = resolve(
      __dirname,
      "../../../../../../common/src/translations/locales/fr.json"
    );
    const translations = JSON.parse(readFileSync(translationPath, "utf8"));

    const missingTranslations: string[] = [];

    Object.values(Categories).forEach((cat) => {
      const key = pipe.transform(cat);
      if (!translations[key]) {
        missingTranslations.push(key);
      }
    });

    if (missingTranslations.length > 0) {
      fail(
        `Missing translations for the following category keys:\n${missingTranslations.join(
          "\n"
        )}`
      );
    }

    expect(missingTranslations.length).toBe(0);
  });

  describe("with lowercase string values", () => {
    it("should transform 'health' to 'CAT_HEALTH'", () => {
      expect(pipe.transform("health")).toBe("CAT_HEALTH");
    });

    it("should transform 'food' to 'CAT_FOOD'", () => {
      expect(pipe.transform("food")).toBe("CAT_FOOD");
    });

    it("should transform 'addiction' to 'CAT_ADDICTION'", () => {
      expect(pipe.transform("addiction")).toBe("CAT_ADDICTION");
    });

    it("should transform 'std_testing' to 'CAT_STD_TESTING'", () => {
      expect(pipe.transform("std_testing")).toBe("CAT_STD_TESTING");
    });

    it("should transform 'psychological_support' to 'CAT_PSYCHOLOGICAL_SUPPORT'", () => {
      expect(pipe.transform("psychological_support")).toBe(
        "CAT_PSYCHOLOGICAL_SUPPORT"
      );
    });
  });

  describe("with Categories enum values", () => {
    it("should transform Categories.HEALTH to 'CAT_HEALTH'", () => {
      expect(pipe.transform(Categories.HEALTH)).toBe("CAT_HEALTH");
    });

    it("should transform Categories.ADDICTION to 'CAT_ADDICTION'", () => {
      expect(pipe.transform(Categories.ADDICTION)).toBe("CAT_ADDICTION");
    });

    it("should transform Categories.STD_TESTING to 'CAT_STD_TESTING'", () => {
      expect(pipe.transform(Categories.STD_TESTING)).toBe("CAT_STD_TESTING");
    });

    it("should transform Categories.PSYCHOLOGICAL_SUPPORT to 'CAT_PSYCHOLOGICAL_SUPPORT'", () => {
      expect(pipe.transform(Categories.PSYCHOLOGICAL_SUPPORT)).toBe(
        "CAT_PSYCHOLOGICAL_SUPPORT"
      );
    });

    it("should transform Categories.CHILD_CARE to 'CAT_CHILD_CARE'", () => {
      expect(pipe.transform(Categories.CHILD_CARE)).toBe("CAT_CHILD_CARE");
    });

    it("should transform Categories.GENERAL_PRACTITIONER to 'CAT_GENERAL_PRACTITIONER'", () => {
      expect(pipe.transform(Categories.GENERAL_PRACTITIONER)).toBe(
        "CAT_GENERAL_PRACTITIONER"
      );
    });

    it("should transform Categories.DENTAL_CARE to 'CAT_DENTAL_CARE'", () => {
      expect(pipe.transform(Categories.DENTAL_CARE)).toBe("CAT_DENTAL_CARE");
    });

    it("should transform Categories.PREGNANCY_CARE to 'CAT_PREGNANCY_CARE'", () => {
      expect(pipe.transform(Categories.PREGNANCY_CARE)).toBe(
        "CAT_PREGNANCY_CARE"
      );
    });

    it("should transform Categories.VACCINATION to 'CAT_VACCINATION'", () => {
      expect(pipe.transform(Categories.VACCINATION)).toBe("CAT_VACCINATION");
    });

    it("should transform Categories.INFIRMARY to 'CAT_INFIRMARY'", () => {
      expect(pipe.transform(Categories.INFIRMARY)).toBe("CAT_INFIRMARY");
    });

    it("should transform Categories.VET_CARE to 'CAT_VET_CARE'", () => {
      expect(pipe.transform(Categories.VET_CARE)).toBe("CAT_VET_CARE");
    });

    it("should transform Categories.HEALTH_SPECIALISTS to 'CAT_HEALTH_SPECIALISTS'", () => {
      expect(pipe.transform(Categories.HEALTH_SPECIALISTS)).toBe(
        "CAT_HEALTH_SPECIALISTS"
      );
    });

    it("should transform Categories.ALLERGOLOGY to 'CAT_ALLERGOLOGY'", () => {
      expect(pipe.transform(Categories.ALLERGOLOGY)).toBe("CAT_ALLERGOLOGY");
    });

    it("should transform Categories.CARDIOLOGY to 'CAT_CARDIOLOGY'", () => {
      expect(pipe.transform(Categories.CARDIOLOGY)).toBe("CAT_CARDIOLOGY");
    });

    it("should transform Categories.DERMATOLOGY to 'CAT_DERMATOLOGY'", () => {
      expect(pipe.transform(Categories.DERMATOLOGY)).toBe("CAT_DERMATOLOGY");
    });

    it("should transform Categories.ECHOGRAPHY to 'CAT_ECHOGRAPHY'", () => {
      expect(pipe.transform(Categories.ECHOGRAPHY)).toBe("CAT_ECHOGRAPHY");
    });

    it("should transform Categories.ENDOCRINOLOGY to 'CAT_ENDOCRINOLOGY'", () => {
      expect(pipe.transform(Categories.ENDOCRINOLOGY)).toBe(
        "CAT_ENDOCRINOLOGY"
      );
    });

    it("should transform Categories.GASTROENTEROLOGY to 'CAT_GASTROENTEROLOGY'", () => {
      expect(pipe.transform(Categories.GASTROENTEROLOGY)).toBe(
        "CAT_GASTROENTEROLOGY"
      );
    });

    it("should transform Categories.GYNECOLOGY to 'CAT_GYNECOLOGY'", () => {
      expect(pipe.transform(Categories.GYNECOLOGY)).toBe("CAT_GYNECOLOGY");
    });

    it("should transform Categories.KINESITHERAPY to 'CAT_KINESITHERAPY'", () => {
      expect(pipe.transform(Categories.KINESITHERAPY)).toBe(
        "CAT_KINESITHERAPY"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle already uppercase values", () => {
      expect(pipe.transform("HEALTH")).toBe("CAT_HEALTH");
    });

    it("should handle mixed case values", () => {
      expect(pipe.transform("HeAlTh")).toBe("CAT_HEALTH");
    });
  });
});
