import { Modalities } from "./Modalities.class";
import { ThermalComfort } from "./ThermalComfort.class";

describe("Modalities", () => {
  describe("thermalComfort integration", () => {
    it("always instantiates thermalComfort as ThermalComfort with null defaults when omitted", () => {
      const modalities = new Modalities();
      expect(modalities.thermalComfort).toBeInstanceOf(ThermalComfort);
      expect(modalities.thermalComfort.heated).toBeNull();
      expect(modalities.thermalComfort.airConditioned).toBeNull();
    });

    it("normalizes legacy input without thermalComfort", () => {
      const modalities = new Modalities({ inconditionnel: true });
      expect(modalities.thermalComfort).toBeInstanceOf(ThermalComfort);
      expect(modalities.thermalComfort.heated).toBeNull();
      expect(modalities.thermalComfort.airConditioned).toBeNull();
    });

    it("preserves provided thermalComfort values", () => {
      const modalities = new Modalities({
        thermalComfort: { heated: true, airConditioned: false },
      });
      expect(modalities.thermalComfort.heated).toBe(true);
      expect(modalities.thermalComfort.airConditioned).toBe(false);
    });

    it("re-instantiates thermalComfort on each new Modalities (no shared reference)", () => {
      const source = { thermalComfort: { heated: true, airConditioned: null } };
      const first = new Modalities(source);
      const second = new Modalities(source);
      expect(first.thermalComfort).not.toBe(second.thermalComfort);
      expect(first.thermalComfort.heated).toBe(true);
      expect(second.thermalComfort.heated).toBe(true);
    });
  });

  describe("existing fields still work", () => {
    it("keeps inconditionnel default to true when unset", () => {
      const modalities = new Modalities();
      expect(modalities.inconditionnel).toBe(true);
    });

    it("keeps existing fields untouched by thermalComfort addition", () => {
      const modalities = new Modalities({
        inconditionnel: false,
        appointment: { checked: true, precisions: "test" },
        animal: { checked: true },
      });
      expect(modalities.inconditionnel).toBe(false);
      expect(modalities.appointment.checked).toBe(true);
      expect(modalities.appointment.precisions).toBe("test");
      expect(modalities.animal.checked).toBe(true);
    });
  });
});
