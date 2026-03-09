import { Component, Input } from "@angular/core";

import { ServiceSaturation } from "@soliguide/common";

import { Service } from "../../../../../../models";

@Component({
  selector: "app-form-saturation-fiche",
  templateUrl: "./saturation.component.html",
  styleUrls: ["./saturation.component.css"],
})
export class FormSaturationFicheComponent {
  @Input() public service: Service;
  @Input() public serviceIndex: number;

  public readonly ServiceSaturation = ServiceSaturation;
  public readonly ServiceSaturationValues = Object.keys(
    ServiceSaturation
  ) as ServiceSaturation[];
}
