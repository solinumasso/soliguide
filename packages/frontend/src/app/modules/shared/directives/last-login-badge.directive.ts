import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { differenceInMonths } from "date-fns";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[appLastLoginBadge]",
})
export class LastLoginBadgeDirective implements OnInit {
  @Input() lastLogin: Date | null;

  constructor(
    private readonly el: ElementRef,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit() {
    const badgeClass = this.getBadgeClass();
    const displayText = this.getDisplayText();

    this.el.nativeElement.className = `status ${badgeClass}`;
    this.el.nativeElement.textContent = displayText;
  }

  private getBadgeClass(): string {
    if (!this.lastLogin) {
      return "status-danger";
    }

    const monthsDiff = differenceInMonths(new Date(), new Date(this.lastLogin));
    return monthsDiff > 3 ? "status-danger" : "status-success";
  }

  private getDisplayText(): string {
    if (!this.lastLogin) {
      return this.translateService.instant("NEVER_CONNECTED");
    }

    const datePipe = new DatePipe(this.translateService.currentLang ?? "fr");
    return datePipe.transform(this.lastLogin, "shortDate") ?? "";
  }
}
