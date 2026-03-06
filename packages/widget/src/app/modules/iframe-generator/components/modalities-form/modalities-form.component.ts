import { Component, Input, OnInit } from "@angular/core";

import { ModalitiesElement } from "@soliguide/common";
import { AnalyticsService } from "../../services/analytics.service";
import { IframeFormType, IframeGeneratorStep } from "../../types";

@Component({
  selector: "app-modalities-form",
  templateUrl: "./modalities-form.component.html",
  styleUrls: ["./modalities-form.component.scss"],
})
export class ModalitiesFormComponent implements OnInit {
  @Input() public formValue!: IframeFormType;

  public allChecked: boolean;

  public readonly ModalitiesElement = ModalitiesElement;

  constructor(private readonly analyticsService: AnalyticsService) {
    this.allChecked = false;
  }

  public ngOnInit(): void {
    this.updateDisable();
  }

  public toggleCheckbox = async (attribute: ModalitiesElement) => {
    await this.analyticsService.capture(
      "toggle-modality",
      IframeGeneratorStep.MODALITIES,
      this.formValue,
      { newModalities: attribute }
    );
    if (!this.formValue.modalities) {
      this.formValue.modalities = {
        // As we want the free referenced item and not the other way around, we
        // have to set the "price" attribute to false instead of true as of the
        // others. Thus, the attribution is :
        // attribute !== ModalitiesElement.PRICE ? true : false
        // Simplified in :
        // attribute !== ModalitiesElement.PRICE
        [attribute]: attribute !== ModalitiesElement.PRICE,
      };
    } else {
      if (
        this.formValue.modalities[attribute] ===
        (attribute !== ModalitiesElement.PRICE)
      ) {
        if (Object.keys(this.formValue.modalities).length > 1) {
          delete this.formValue.modalities[attribute];
        } else {
          delete this.formValue.modalities;
        }
      } else {
        this.formValue.modalities[attribute] =
          attribute !== ModalitiesElement.PRICE;
      }
    }

    this.updateDisable();
  };

  public isChecked = (attribute: ModalitiesElement): boolean => {
    return (this.formValue.modalities &&
      this.formValue.modalities[attribute] ===
        (attribute !== ModalitiesElement.PRICE)) as boolean;
  };

  public checkAll = async () => {
    await this.analyticsService.capture(
      "check-all",
      IframeGeneratorStep.MODALITIES,
      this.formValue
    );
    this.allChecked = !this.allChecked;

    if (this.allChecked) {
      for (const attribute of Object.values(ModalitiesElement)) {
        if (!this.formValue.modalities) {
          this.formValue.modalities = {};
        }

        if (
          attribute !== ModalitiesElement.ANIMAL &&
          attribute !== ModalitiesElement.PRM &&
          attribute !== ModalitiesElement.PRICE
        ) {
          this.formValue.modalities[attribute as ModalitiesElement] = true;
        }
      }
    } else {
      delete this.formValue.modalities?.appointment;
      delete this.formValue.modalities?.inconditionnel;
      delete this.formValue.modalities?.inscription;
      delete this.formValue.modalities?.orientation;
    }
  };

  private updateDisable = (): void => {
    for (const attribute of Object.values(ModalitiesElement)) {
      if (
        attribute !== ModalitiesElement.ANIMAL &&
        attribute !== ModalitiesElement.PRM &&
        attribute !== ModalitiesElement.PRICE &&
        (!this.formValue.modalities ||
          (this.formValue.modalities[
            attribute as ModalitiesElement
          ] as boolean) !== true)
      ) {
        this.allChecked = false;
        return;
      }
    }
    this.allChecked = true;
  };
}
