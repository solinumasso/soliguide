import { Injectable } from "@angular/core";
import { PosthogService } from "../../analytics/services/posthog.service";
import { IframeFormType, IframeGeneratorStep } from "../types";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(private readonly posthogService: PosthogService) {}

  public async capture(
    eventName: string,
    currentStep: IframeGeneratorStep,
    formValues?: IframeFormType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties?: Record<string, any>
  ) {
    const currentStepName = IframeGeneratorStep[currentStep].toLowerCase();
    await this.posthogService.capture(
      `iframe-generator-${currentStepName}-${eventName}`,
      {
        ...properties,
        formValues,
        currentStep,
      }
    );
  }

  public async identify(email: string, organization: string) {
    await this.posthogService.identify(email, { organization });
  }
}
