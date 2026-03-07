import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "limitTo",
})
export class LimitToPipe implements PipeTransform {
  public transform(value: string | null, args: string): string {
    if (!value) {
      return "";
    }
    const limit = args ? parseInt(args, 10) : 10;
    const trail = "...";
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
