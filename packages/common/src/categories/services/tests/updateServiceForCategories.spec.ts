import { Categories, CanteensMealType } from "../../enums";
import { updateServicesWithNewCategories } from "../updateServicesForCategories";
import { CommonPlaceService } from "../../../place";

describe("updateServicesWithNewCategories", () => {
  it("should add a category field with addiction", () => {
    const regularService = new CommonPlaceService({ categorie: 101 });

    expect(updateServicesWithNewCategories(regularService).category).toEqual(
      Categories.ADDICTION
    );
  });

  it("should add category field with food and a categorySpecificFields with food subcat name", () => {
    const foodService = new CommonPlaceService({
      categorie: 601,
      name: "dejeuner",
    });

    const service = updateServicesWithNewCategories(foodService);

    expect(service.category).toEqual(Categories.FOOD_DISTRIBUTION);

    expect(service.categorySpecificFields?.canteensMealType).toEqual(
      CanteensMealType.DEJEUNER
    );
  });

  it("should add category field with food and a wrong subcat name", () => {
    const foodService = new CommonPlaceService({
      categorie: 601,
      name: "foobar",
    });

    const service = updateServicesWithNewCategories(foodService);

    expect(service.category).toEqual(Categories.FOOD_DISTRIBUTION);

    expect(service.categorySpecificFields?.canteensMealType).toBeUndefined();
  });

  it("should add category field with integration_through_economic_activity and a categorySpecificFields with jobsList subcat name", () => {
    const jobService = new CommonPlaceService({
      categorie: 204,
      jobsList: "Développeur",
      name: "",
    });

    const service = updateServicesWithNewCategories(jobService);

    expect(service.category).toEqual(
      Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY
    );

    expect(service.categorySpecificFields?.jobsList).toEqual("Développeur");
  });

  it("should return a service with the parent catégorie", () => {
    const obsoleteService = new CommonPlaceService({
      categorie: 699,
    });

    const service = updateServicesWithNewCategories(obsoleteService);
    expect(service.category).toEqual(`${Categories.FOOD}-699`);
  });

  it("should return a service with null as a category", () => {
    const nullService = new CommonPlaceService({});

    const service = updateServicesWithNewCategories(nullService);
    expect(service.category).toEqual(null);
  });

  it("should throw an error", () => {
    const falsyService = new CommonPlaceService({
      categorie: 80000,
    });
    expect(() => updateServicesWithNewCategories(falsyService)).toThrow(Error);
  });

  it("category should be domiciliation", () => {
    const domiciliationService = new CommonPlaceService({
      categorie: 402,
      name: "",
    });

    const newService = updateServicesWithNewCategories(domiciliationService);

    expect(newService.category).toEqual(Categories.DOMICILIATION);

    expect(newService.categorySpecificFields).toBeUndefined();
  });
});
