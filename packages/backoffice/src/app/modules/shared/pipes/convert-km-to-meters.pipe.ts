import { Pipe, PipeTransform } from "@angular/core";
import { kmOrMeters } from "@soliguide/common";

@Pipe({ name: "kmToMeters" })
export class KmToMeters implements PipeTransform {
  public transform(input: number): string {
    return kmOrMeters(input);
  }
}
