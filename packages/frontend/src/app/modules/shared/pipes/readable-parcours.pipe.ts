import { Pipe, PipeTransform } from "@angular/core";

import { PlaceParcours } from "../../../models/place/classes";

@Pipe({ name: "readableParcours" })
export class ReadableParcoursPipe implements PipeTransform {
  public transform(parcours: PlaceParcours[]): string {
    let readableParcours = "";

    parcours.forEach(
      (point: PlaceParcours, index: number) =>
        (readableParcours += `${index + 1}. ${point.position.address} - `)
    );

    return readableParcours.slice(0, -3);
  }
}
