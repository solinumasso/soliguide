import { Themes } from "../../../themes";
import { Categories } from "../../enums";
import {
  CategoriesService,
  initializeCategoriesApiByTheme,
} from "../categories.service";

let frService: CategoriesService;
let esService: CategoriesService;
let adService: CategoriesService;

beforeAll(() => {
  frService = initializeCategoriesApiByTheme(Themes.SOLIGUIDE_FR);
  esService = initializeCategoriesApiByTheme(Themes.SOLIGUIA_ES);
  adService = initializeCategoriesApiByTheme(Themes.SOLIGUIA_AD);
});

describe("isDeepNestedCategory", () => {
  describe("root categories (no parents)", () => {
    it("should return false for all root categories across every theme", () => {
      const rootCategories = [
        Categories.WELCOME,
        Categories.ACTIVITIES,
        Categories.FOOD,
        Categories.COUNSELING,
        Categories.TRAINING_AND_JOBS,
        Categories.ACCOMODATION_AND_HOUSING,
        Categories.HYGIENE_AND_WELLNESS,
        Categories.EQUIPMENT,
        Categories.HEALTH,
        Categories.TECHNOLOGY,
        Categories.MOBILITY,
      ];

      for (const service of [frService, esService, adService]) {
        for (const rootCategory of rootCategories) {
          expect(service.isDeepNestedCategory(rootCategory)).toBe(false);
        }
      }
    });
  });

  describe("level-1 categories (direct children of a root)", () => {
    it("should return false for shared level-1 categories across every theme", () => {
      const level1Categories = [
        Categories.DAY_HOSTING,
        Categories.FOOD_DISTRIBUTION,
        Categories.LEGAL_ADVICE,
        Categories.SOCIAL_ACCOMPANIMENT,
        Categories.DISABILITY_ADVICE,
        Categories.ADMINISTRATIVE_ASSISTANCE,
        Categories.BUDGET_ADVICE,
        Categories.DIGITAL_TOOLS_TRAINING,
        Categories.JOB_COACHING,
        Categories.TUTORING,
        Categories.OVERNIGHT_STOP,
        Categories.EMERGENCY_ACCOMMODATION,
        Categories.LONG_TERM_ACCOMODATION,
        Categories.ACCESS_TO_HOUSING,
        Categories.SHOWER,
        Categories.LAUNDRY,
        Categories.WELLNESS,
        Categories.TOILETS,
        Categories.LUGGAGE_STORAGE,
        Categories.CLOTHING,
        Categories.HEALTH_ACCESS,
        Categories.PHYSICAL_HEALTH,
        Categories.MENTAL_HEALTH,
        Categories.ADDICTIONS,
        Categories.SEXUAL_HEALTH,
        Categories.PARENTHOOD,
        Categories.HEALTH_SPECIALISTS,
        Categories.COMPUTERS_AT_YOUR_DISPOSAL,
        Categories.WIFI,
        Categories.TRANSPORTATION_MOBILITY,
      ];

      for (const service of [frService, esService, adService]) {
        for (const level1Category of level1Categories) {
          expect(service.isDeepNestedCategory(level1Category)).toBe(false);
        }
      }
    });
  });

  describe("deeply nested categories (depth >= 2, parent is not a root)", () => {
    it("should return true for shared deeply nested categories across every theme", () => {
      const deepNestedCategories = [
        // Under PHYSICAL_HEALTH
        Categories.GENERAL_PRACTITIONER,
        Categories.HEALTH_ASSESSMENT,
        Categories.DENTAL_CARE,
        Categories.OPTICAL_CARE,
        Categories.HEARING_CARE,
        Categories.INFIRMARY,
        Categories.VACCINATION,
        Categories.STD_TESTING,
        Categories.CHRONIC_DISEASES,
        Categories.NUTRITION,
        // Under MENTAL_HEALTH
        Categories.SUPPORT_GROUPS,
        Categories.MENTAL_HEALTH_EDUCATION,
        Categories.THERAPEUTIC_ACTIVITIES,
        // Under ADDICTIONS
        Categories.ADDICTION_CARE,
        Categories.ADDICTION_PREVENTION_AND_MATERIAL,
        // Under SEXUAL_HEALTH
        Categories.EMERGENCY_CONTRACEPTION,
        Categories.CONTRACEPTION,
        Categories.GYNECOLOGY,
        Categories.STI_PREVENTION_TESTING,
        Categories.HIV_PREVENTION,
        Categories.SEXUAL_HEALTH_VACCINATION,
        Categories.SEXUAL_HEALTH_EDUCATION,
        Categories.SEXUAL_VIOLENCE_SUPPORT,
        Categories.AFFECTIVE_LIFE,
        // Under PARENTHOOD
        Categories.PREGNANCY_CARE,
        // Under HEALTH_ACCESS
        Categories.HEALTH_COVERAGE,
        Categories.FIND_HEALTHCARE,
        // Under HEALTH_SPECIALISTS
        Categories.ALLERGOLOGY,
        Categories.CARDIOLOGY,
        Categories.DERMATOLOGY,
        Categories.ENDOCRINOLOGY,
        Categories.GASTROENTEROLOGY,
        Categories.KINESITHERAPY,
        Categories.OTORHINOLARYNGOLOGY,
        Categories.SPEECH_THERAPY,
        Categories.PEDICURE,
        Categories.PNEUMOLOGY,
        Categories.RADIOLOGY,
        Categories.RHEUMATOLOGY,
        Categories.STOMATOLOGY,
        Categories.UROLOGY,
        Categories.VET_CARE,
      ];

      for (const service of [frService, esService, adService]) {
        for (const deepCategory of deepNestedCategories) {
          expect(service.isDeepNestedCategory(deepCategory)).toBe(true);
        }
      }
    });
  });

  describe("multi-parental categories", () => {
    it("should return true for PSYCHIATRY whose parents are MENTAL_HEALTH and HEALTH_SPECIALISTS, both non-root", () => {
      for (const service of [frService, esService, adService]) {
        expect(service.isDeepNestedCategory(Categories.PSYCHIATRY)).toBe(true);
      }
    });

    it("should return true for PSYCHOLOGICAL_SUPPORT whose parents are MENTAL_HEALTH and HEALTH_SPECIALISTS, both non-root", () => {
      for (const service of [frService, esService, adService]) {
        expect(
          service.isDeepNestedCategory(Categories.PSYCHOLOGICAL_SUPPORT)
        ).toBe(true);
      }
    });

    it("should return true for CHILD_CARE whose parents are PHYSICAL_HEALTH and PARENTHOOD, both non-root", () => {
      for (const service of [frService, esService, adService]) {
        expect(service.isDeepNestedCategory(Categories.CHILD_CARE)).toBe(true);
      }
    });

    it("should return true for MEDICAL_ACCOMMODATION whose parents are PHYSICAL_HEALTH and MENTAL_HEALTH, both non-root", () => {
      for (const service of [frService, esService, adService]) {
        expect(
          service.isDeepNestedCategory(Categories.MEDICAL_ACCOMMODATION)
        ).toBe(true);
      }
    });

    it("should return false for PARENT_ASSISTANCE because its first parent is COUNSELING which is a root", () => {
      // PARENT_ASSISTANCE has parents [COUNSELING, PARENTHOOD].
      // The function checks only parents[0]: COUNSELING is a root → false.
      for (const service of [frService, esService, adService]) {
        expect(service.isDeepNestedCategory(Categories.PARENT_ASSISTANCE)).toBe(
          false
        );
      }
    });
  });

  describe("SOLIGUIDE_FR country-specific categories", () => {
    it("should return false for FR-specific level-1 categories whose parent is a root", () => {
      expect(frService.isDeepNestedCategory(Categories.DOMICILIATION)).toBe(
        false
      ); // parent: COUNSELING
      expect(frService.isDeepNestedCategory(Categories.PUBLIC_WRITER)).toBe(
        false
      ); // parent: COUNSELING
      expect(frService.isDeepNestedCategory(Categories.FRENCH_COURSE)).toBe(
        false
      ); // parent: TRAINING_AND_JOBS
      expect(frService.isDeepNestedCategory(Categories.CITIZEN_HOUSING)).toBe(
        false
      ); // parent: ACCOMODATION_AND_HOUSING
      expect(
        frService.isDeepNestedCategory(Categories.PERSONAL_VEHICLE_ACCESS)
      ).toBe(false); // parent: MOBILITY
      expect(
        frService.isDeepNestedCategory(Categories.VEHICLE_MAINTENANCE)
      ).toBe(false); // parent: MOBILITY
      expect(frService.isDeepNestedCategory(Categories.DRIVING_LICENSE)).toBe(
        false
      ); // parent: MOBILITY
    });

    it("should return true for FR-specific deeply nested categories whose parent is non-root", () => {
      expect(frService.isDeepNestedCategory(Categories.ABORTION)).toBe(true); // parent: SEXUAL_HEALTH
      expect(frService.isDeepNestedCategory(Categories.OSTEOPATHY)).toBe(true); // parent: HEALTH_SPECIALISTS
      expect(frService.isDeepNestedCategory(Categories.PHLEBOLOGY)).toBe(true); // parent: HEALTH_SPECIALISTS
    });

    it("should return false for FR-specific categories when used with ES or AD services (no parents in those themes)", () => {
      expect(esService.isDeepNestedCategory(Categories.FRENCH_COURSE)).toBe(
        false
      );
      expect(esService.isDeepNestedCategory(Categories.DOMICILIATION)).toBe(
        false
      );
      expect(esService.isDeepNestedCategory(Categories.OSTEOPATHY)).toBe(false);
      expect(esService.isDeepNestedCategory(Categories.PHLEBOLOGY)).toBe(false);
      expect(adService.isDeepNestedCategory(Categories.FRENCH_COURSE)).toBe(
        false
      );
      expect(adService.isDeepNestedCategory(Categories.DOMICILIATION)).toBe(
        false
      );
      expect(adService.isDeepNestedCategory(Categories.OSTEOPATHY)).toBe(false);
      expect(adService.isDeepNestedCategory(Categories.PHLEBOLOGY)).toBe(false);
    });
  });

  describe("SOLIGUIA_ES country-specific categories", () => {
    it("should return false for ES-specific level-1 categories whose parent is a root", () => {
      expect(esService.isDeepNestedCategory(Categories.SPANISH_COURSE)).toBe(
        false
      ); // parent: TRAINING_AND_JOBS
      expect(esService.isDeepNestedCategory(Categories.CATALAN_COURSE)).toBe(
        false
      ); // parent: TRAINING_AND_JOBS
      expect(esService.isDeepNestedCategory(Categories.REGULARIZATION)).toBe(
        false
      ); // parent: COUNSELING
    });

    it("should return true for ES-specific deeply nested categories whose parent is non-root", () => {
      expect(esService.isDeepNestedCategory(Categories.ABORTION)).toBe(true); // parent: SEXUAL_HEALTH
      expect(esService.isDeepNestedCategory(Categories.NEUROLOGY)).toBe(true); // parent: HEALTH_SPECIALISTS
      expect(esService.isDeepNestedCategory(Categories.VASCULAR_SURGERY)).toBe(
        true
      ); // parent: HEALTH_SPECIALISTS
    });

    it("should return false for ES-specific categories when used with FR or AD services (no parents in those themes)", () => {
      expect(frService.isDeepNestedCategory(Categories.REGULARIZATION)).toBe(
        false
      );
      expect(adService.isDeepNestedCategory(Categories.REGULARIZATION)).toBe(
        false
      );
    });
  });

  describe("SOLIGUIA_AD country-specific categories", () => {
    it("should return false for AD-specific level-1 categories whose parent is a root", () => {
      expect(adService.isDeepNestedCategory(Categories.SPANISH_COURSE)).toBe(
        false
      ); // parent: TRAINING_AND_JOBS
      expect(adService.isDeepNestedCategory(Categories.CATALAN_COURSE)).toBe(
        false
      ); // parent: TRAINING_AND_JOBS
      expect(adService.isDeepNestedCategory(Categories.LEGAL_PROTECTION)).toBe(
        false
      ); // parent: COUNSELING
    });

    it("should return true for AD-specific deeply nested categories whose parent is non-root", () => {
      expect(adService.isDeepNestedCategory(Categories.NEUROLOGY)).toBe(true); // parent: HEALTH_SPECIALISTS
      expect(adService.isDeepNestedCategory(Categories.VASCULAR_SURGERY)).toBe(
        true
      ); // parent: HEALTH_SPECIALISTS
    });

    it("should return false for ABORTION which is absent in the AD theme (no parents)", () => {
      expect(adService.isDeepNestedCategory(Categories.ABORTION)).toBe(false);
    });

    it("should return false for LEGAL_PROTECTION when used with FR or ES services (absent in those themes)", () => {
      expect(frService.isDeepNestedCategory(Categories.LEGAL_PROTECTION)).toBe(
        false
      );
      expect(esService.isDeepNestedCategory(Categories.LEGAL_PROTECTION)).toBe(
        false
      );
    });
  });

  describe("ES and AD shared categories (SPANISH_COURSE and CATALAN_COURSE)", () => {
    it("should return false for SPANISH_COURSE and CATALAN_COURSE in ES and AD (parent is root TRAINING_AND_JOBS)", () => {
      expect(esService.isDeepNestedCategory(Categories.SPANISH_COURSE)).toBe(
        false
      );
      expect(esService.isDeepNestedCategory(Categories.CATALAN_COURSE)).toBe(
        false
      );
      expect(adService.isDeepNestedCategory(Categories.SPANISH_COURSE)).toBe(
        false
      );
      expect(adService.isDeepNestedCategory(Categories.CATALAN_COURSE)).toBe(
        false
      );
    });

    it("should return false for SPANISH_COURSE and CATALAN_COURSE in the FR service (absent, no parents)", () => {
      expect(frService.isDeepNestedCategory(Categories.SPANISH_COURSE)).toBe(
        false
      );
      expect(frService.isDeepNestedCategory(Categories.CATALAN_COURSE)).toBe(
        false
      );
    });

    it("should return true for NEUROLOGY and VASCULAR_SURGERY in ES and AD (parent is non-root HEALTH_SPECIALISTS)", () => {
      expect(esService.isDeepNestedCategory(Categories.NEUROLOGY)).toBe(true);
      expect(esService.isDeepNestedCategory(Categories.VASCULAR_SURGERY)).toBe(
        true
      );
      expect(adService.isDeepNestedCategory(Categories.NEUROLOGY)).toBe(true);
      expect(adService.isDeepNestedCategory(Categories.VASCULAR_SURGERY)).toBe(
        true
      );
    });

    it("should return false for NEUROLOGY and VASCULAR_SURGERY in the FR service (absent, no parents)", () => {
      expect(frService.isDeepNestedCategory(Categories.NEUROLOGY)).toBe(false);
      expect(frService.isDeepNestedCategory(Categories.VASCULAR_SURGERY)).toBe(
        false
      );
    });
  });
});
