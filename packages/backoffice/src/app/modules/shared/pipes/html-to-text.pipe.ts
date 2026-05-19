import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "htmlToText",
})
export class HtmlToTextPipe implements PipeTransform {
  public transform(text: string): string {
    if (!text) {
      return "";
    }

    text = text.replace(/<[^>]+>/gm, " ");
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(text, "text/html");

    return parsedHtml.body.textContent?.replace(/\s\s+/g, " ").trim();
  }
}
