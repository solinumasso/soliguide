import { Component, Input, OnInit } from "@angular/core";

import type { Modalities } from "@soliguide/common";

@Component({
  selector: "app-display-modalities",
  templateUrl: "./display-modalities.component.html",
  styleUrls: ["./display-modalities.component.css"],
})
export class DisplayModalitiesComponent implements OnInit {
  @Input() public modalities: Modalities;
  @Input() public isHistory: boolean;
  @Input() public oldModalities?: Modalities;

  public unconditionalAdded = false;
  public unconditionalRemoved = false;
  public orientationAdded = false;
  public orientationRemoved = false;
  public orientationPrecisionsChanged = false;
  public inscriptionAdded = false;
  public inscriptionRemoved = false;
  public inscriptionPrecisionsChanged = false;
  public appointmentAdded = false;
  public appointmentRemoved = false;
  public appointmentPrecisionsChanged = false;
  public pmrAdded = false;
  public pmrRemoved = false;
  public animalAdded = false;
  public animalRemoved = false;
  public priceAdded = false;
  public priceRemoved = false;
  public pricePrecisionsChanged = false;
  public otherChanged = false;

  public ngOnInit(): void {
    if (!this.oldModalities) return;

    const o = this.oldModalities;
    const n = this.modalities;

    this.unconditionalAdded = !o.inconditionnel && !!n.inconditionnel;
    this.unconditionalRemoved = !!o.inconditionnel && !n.inconditionnel;

    this.orientationAdded = !o.orientation?.checked && !!n.orientation?.checked;
    this.orientationRemoved =
      !!o.orientation?.checked && !n.orientation?.checked;
    this.orientationPrecisionsChanged =
      !!n.orientation?.checked &&
      o.orientation?.precisions !== n.orientation?.precisions;

    this.inscriptionAdded = !o.inscription?.checked && !!n.inscription?.checked;
    this.inscriptionRemoved =
      !!o.inscription?.checked && !n.inscription?.checked;
    this.inscriptionPrecisionsChanged =
      !!n.inscription?.checked &&
      o.inscription?.precisions !== n.inscription?.precisions;

    this.appointmentAdded = !o.appointment?.checked && !!n.appointment?.checked;
    this.appointmentRemoved =
      !!o.appointment?.checked && !n.appointment?.checked;
    this.appointmentPrecisionsChanged =
      !!n.appointment?.checked &&
      o.appointment?.precisions !== n.appointment?.precisions;

    this.pmrAdded = !o.pmr?.checked && !!n.pmr?.checked;
    this.pmrRemoved = !!o.pmr?.checked && !n.pmr?.checked;

    this.animalAdded = !o.animal?.checked && !!n.animal?.checked;
    this.animalRemoved = !!o.animal?.checked && !n.animal?.checked;

    this.priceAdded = !o.price?.checked && !!n.price?.checked;
    this.priceRemoved = !!o.price?.checked && !n.price?.checked;
    this.pricePrecisionsChanged =
      !!n.price?.checked && o.price?.precisions !== n.price?.precisions;

    this.otherChanged = o.other !== n.other;
  }
}
