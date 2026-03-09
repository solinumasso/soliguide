import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SupportedLanguagesCode } from "@soliguide/common";

@Pipe({
  name: "dateProxy",
})
export class DateProxyPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any, pattern: string = "shortDate"): string {
    const ngPipe = new DatePipe(
      this.translateService?.currentLang ?? SupportedLanguagesCode.FR
    );
    return ngPipe.transform(value, pattern);
  }
}
