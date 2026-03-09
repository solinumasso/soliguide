import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PosthogService as CommonPosthogService } from "@soliguide/common-angular";

@Injectable({
  providedIn: "root",
})
export class PosthogService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly commonPosthogService: CommonPosthogService
  ) {
    this.commonPosthogService.switchPersistence("memory");
    this.subscription = new Subscription();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public capture(eventName: string, properties?: Record<string, any>) {
    this.commonPosthogService.capture(`widget-${eventName}`, properties);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public identify(email: string, properties?: Record<string, any>) {
    this.commonPosthogService.identify(email, properties);
  }
}
