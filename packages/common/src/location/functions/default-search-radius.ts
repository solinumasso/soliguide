import { GeoTypes } from "../enums";

export const getDefaultSearchRadiusByGeoType = (geotype: GeoTypes): number => {
  let sliderValue: number;

  switch (geotype) {
    case GeoTypes.CITY:
      sliderValue = 20;
      break;
    case GeoTypes.DEPARTMENT:
      sliderValue = 50;
      break;
    case GeoTypes.REGION:
      sliderValue = 100;
      break;
    default:
      sliderValue = 10;
  }

  return sliderValue;
};
