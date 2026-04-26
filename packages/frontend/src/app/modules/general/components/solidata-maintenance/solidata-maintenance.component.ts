import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CurrentLanguageService } from "../../services/current-language.service";

@Component({
  selector: "app-solidata-maintenance",
  templateUrl: "./solidata-maintenance.component.html",
  styleUrls: ["./solidata-maintenance.component.css"],
})
export class SolidataMaintenanceComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;

  constructor(private readonly currentLanguageService: CurrentLanguageService) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
