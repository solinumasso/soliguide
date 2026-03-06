import { Component, Input } from "@angular/core";
import { AnalyticsService } from "../../services/analytics.service";

import { IframeFormType, IframeGeneratorStep } from "../../types";

@Component({
  selector: "app-gcu-form",
  templateUrl: "./gcu-form.component.html",
  styleUrls: ["./gcu-form.component.scss"],
})
export class GcuFormComponent {
  @Input() public formValue!: IframeFormType;

  constructor(private readonly analyticsService: AnalyticsService) {}

  public toggleGcu = async (): Promise<void> => {
    await this.analyticsService.capture(
      "update-cgu",
      IframeGeneratorStep.CGU,
      this.formValue,
      { newValue: !this.formValue.gcu }
    );
    this.formValue.gcu = !this.formValue.gcu;
  };
}
