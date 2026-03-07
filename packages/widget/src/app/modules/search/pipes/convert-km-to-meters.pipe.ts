import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "kmToMeters" })
export class KmToMeters implements PipeTransform {
  public transform(input: number): string {
    const dist = Math.round(input * 1000);
    const result =
      dist < 1000
        ? (10 * Math.floor(dist / 10)).toString() + " m"
        : (Math.round(dist / 100) / 10).toString() + " km";
    return result.replace(".", ",");
  }
}
