import { ThermalComfortData } from "../interfaces";

export class ThermalComfort implements ThermalComfortData {
  public heated: boolean | null;
  public airConditioned: boolean | null;

  constructor(thermalComfort?: Partial<ThermalComfortData> | null) {
    this.heated = thermalComfort?.heated ?? null;
    this.airConditioned = thermalComfort?.airConditioned ?? null;
  }
}
