import { CommonPlacePosition } from "@soliguide/common";
import { globalConstants } from "../../../shared/functions";
import { THEME_CONFIGURATION } from "../../themes";

export class PlacePosition extends CommonPlacePosition {
  public codePostalPlusVille: string;

  constructor(position?: CommonPlacePosition) {
    super(position);
    const positionLocalStorage = globalConstants.getItem("POSITION");
    this.location = position?.location ?? {
      coordinates: [
        positionLocalStorage?.coordinates[0]
          ? positionLocalStorage.coordinates[0]
          : THEME_CONFIGURATION.defaultCoordinates[0],
        positionLocalStorage?.coordinates[1]
          ? positionLocalStorage.coordinates[1]
          : THEME_CONFIGURATION.defaultCoordinates[1],
      ],
      type: "Point",
    };

    this.codePostalPlusVille = this.codePostal
      ? this.codePostal + ", " + this.ville
      : this.ville;
  }
}
