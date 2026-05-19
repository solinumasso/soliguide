import { Directive, ElementRef, OnDestroy } from "@angular/core";
import { CurrentLanguageService } from "../../general/services/current-language.service";
import { LanguageDirection } from "../../translations/enums";
import { Subscription } from "rxjs";

@Directive({
  selector: "[appTextDirection]",
})
export class TextDirectionDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    public el: ElementRef,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.el.nativeElement.dir =
          this.currentLanguageService.direction || LanguageDirection.LTR;
      })
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
