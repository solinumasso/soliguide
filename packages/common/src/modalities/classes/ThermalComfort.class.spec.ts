import { ThermalComfort } from "./ThermalComfort.class";

describe("ThermalComfort", () => {
  describe("constructor defaults", () => {
    it("initializes both fields to null when called with no argument", () => {
      const comfort = new ThermalComfort();
      expect(comfort.heated).toBeNull();
      expect(comfort.airConditioned).toBeNull();
    });

    it("initializes both fields to null when called with undefined", () => {
      const comfort = new ThermalComfort(undefined);
      expect(comfort.heated).toBeNull();
      expect(comfort.airConditioned).toBeNull();
    });

    it("initializes both fields to null when called with null", () => {
      const comfort = new ThermalComfort(null);
      expect(comfort.heated).toBeNull();
      expect(comfort.airConditioned).toBeNull();
    });

    it("initializes both fields to null when called with empty object", () => {
      const comfort = new ThermalComfort({});
      expect(comfort.heated).toBeNull();
      expect(comfort.airConditioned).toBeNull();
    });
  });

  describe("value preservation", () => {
    it("preserves airConditioned true", () => {
      const comfort = new ThermalComfort({ airConditioned: true });
      expect(comfort.airConditioned).toBe(true);
      expect(comfort.heated).toBeNull();
    });

    it("preserves airConditioned false", () => {
      const comfort = new ThermalComfort({ airConditioned: false });
      expect(comfort.airConditioned).toBe(false);
      expect(comfort.heated).toBeNull();
    });

    it("preserves heated true", () => {
      const comfort = new ThermalComfort({ heated: true });
      expect(comfort.heated).toBe(true);
      expect(comfort.airConditioned).toBeNull();
    });

    it("preserves heated false", () => {
      const comfort = new ThermalComfort({ heated: false });
      expect(comfort.heated).toBe(false);
      expect(comfort.airConditioned).toBeNull();
    });

    it("preserves both fields when both provided", () => {
      const comfort = new ThermalComfort({
        heated: true,
        airConditioned: false,
      });
      expect(comfort.heated).toBe(true);
      expect(comfort.airConditioned).toBe(false);
    });

    it("preserves explicit null values", () => {
      const comfort = new ThermalComfort({
        heated: null,
        airConditioned: null,
      });
      expect(comfort.heated).toBeNull();
      expect(comfort.airConditioned).toBeNull();
    });
  });
});
