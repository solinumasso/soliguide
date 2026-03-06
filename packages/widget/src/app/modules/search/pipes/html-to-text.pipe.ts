import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "htmlToText",
})
export class HtmlToTextPipe implements PipeTransform {
  public transform(text: string): string {
    return text ? String(text).replace(/<[^>]+>/gm, "") : "";
  }
}
