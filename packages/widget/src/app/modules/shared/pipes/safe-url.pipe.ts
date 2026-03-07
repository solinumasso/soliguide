import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: "safeUrl" })
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly domSanitizer: DomSanitizer) {}
  public transform(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
