import { Component } from "@angular/core";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import {
  WidgetId,
  OTHER_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  ADMINISTRATIVE_DEFAULT_VALUES,
  REGEXP,
} from "@soliguide/common";

import { AnalyticsService } from "../../services/analytics.service";

import { IframeFormType, IframeGeneratorStep } from "../../types";

import { WIDGETS } from "../../../../models";

@Component({
  selector: "app-iframe-form",
  templateUrl: "./iframe-form.component.html",
  styleUrls: ["./iframe-form.component.scss"],
})
export class IframeFormComponent {
  public currentStep: IframeGeneratorStep;
  public numberSteps: number;
  public stepsArray: number[];

  public formValue: IframeFormType;

  public readonly faArrowLeft = faArrowLeft;
  public readonly faArrowRight = faArrowRight;
  public readonly IframeGeneratorStep = IframeGeneratorStep;
  public readonly emailRegexp = REGEXP.email;

  constructor(private readonly analyticsService: AnalyticsService) {
    this.currentStep = IframeGeneratorStep.INTRO;
    this.numberSteps = 5;

    this.stepsArray = [...Array(this.numberSteps).keys()];

    this.formValue = {
      email: "",
      organizationName: "",
      widgetId: WidgetId.SOLINUM,
      cities: [],
      departments: [],
      regions: [],
      national: false,
      categories: [],
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      publics: {
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        familialle: FAMILY_DEFAULT_VALUES,
        gender: GENDER_DEFAULT_VALUES,
        other: OTHER_DEFAULT_VALUES,
      },
      gcu: false,
    };
  }

  public allowsGoingToNextStep = (currentStep: number): boolean => {
    const hasLocation = (this.formValue.national ||
      this.formValue.regions.length ||
      this.formValue.departments.length ||
      this.formValue.cities.length) as boolean;

    const hasCategories = this.formValue.categories.length > 0;
    const hasPublics =
      this.formValue.publics?.administrative?.length !== 0 &&
      this.formValue.publics?.familialle?.length !== 0 &&
      this.formValue.publics?.gender?.length !== 0 &&
      this.formValue.publics?.other?.length !== 0;
    const hasModalities =
      typeof this.formValue.modalities?.appointment !== "undefined" ||
      typeof this.formValue.modalities?.inconditionnel !== "undefined" ||
      typeof this.formValue.modalities?.inscription !== "undefined" ||
      typeof this.formValue.modalities?.orientation !== "undefined";

    if (currentStep === IframeGeneratorStep.USERS) {
      return (
        this.emailRegexp.test(this.formValue.email) &&
        this.formValue.organizationName !== ""
      );
    } else if (currentStep === IframeGeneratorStep.LOCATIONS) {
      return hasLocation;
    } else if (currentStep === IframeGeneratorStep.CATEGORIES) {
      return hasLocation && hasCategories;
    } else if (currentStep === IframeGeneratorStep.PUBLICS) {
      return hasLocation && hasCategories && hasPublics;
    } else if (currentStep === IframeGeneratorStep.MODALITIES) {
      return hasLocation && hasCategories && hasPublics && hasModalities;
    } else {
      return true;
    }
  };

  public async breadcrumbGoToStep(step: IframeGeneratorStep) {
    await this.analyticsService.capture(
      "breadcrumb-click",
      this.currentStep,
      this.formValue,
      {
        step,
      }
    );
    this.currentStep = step;
  }

  public async continueToNextStep() {
    if (this.currentStep === IframeGeneratorStep.USERS) {
      await this.analyticsService.identify(
        this.formValue.email,
        this.formValue.organizationName
      );
    }

    await this.analyticsService.capture(
      "click-continue",
      this.currentStep,
      this.formValue
    );
    this.currentStep += 1;
  }

  public async goingBackToPreviousStep() {
    await this.analyticsService.capture(
      "click-arrow-back",
      this.currentStep,
      this.formValue
    );
    this.currentStep -= 1;
  }

  public async forwardToNextStep() {
    await this.analyticsService.capture(
      "click-arrow-next",
      this.currentStep,
      this.formValue
    );
    this.currentStep += 1;
  }

  public async done() {
    await this.analyticsService.capture(
      "click-done",
      this.currentStep,
      this.formValue
    );
    this.currentStep = IframeGeneratorStep.URI;
  }

  public async restart() {
    await this.analyticsService.capture(
      "click-restart",
      this.currentStep,
      this.formValue
    );
    this.formValue.gcu = false;
    this.currentStep = IframeGeneratorStep.INTRO;
  }
}
