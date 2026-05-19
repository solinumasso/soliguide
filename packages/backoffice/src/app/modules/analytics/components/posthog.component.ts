import { Component, EventEmitter, Inject, Output } from "@angular/core";

import type { PosthogProperties } from "@soliguide/common-angular";

import { PosthogService } from "../services/posthog.service";
import { POSTHOG_PREFIX } from "../injectors/posthog-prefix.injector";

@Component({ selector: "app-posthog-component", template: "" })
export class PosthogComponent {
  @Output() public readonly parentCaptureEvent = new EventEmitter<{
    name: string;
    properties?: PosthogProperties;
  }>();

  private defaultProperties: PosthogProperties;

  constructor(
    private readonly posthogService: PosthogService,
    @Inject(POSTHOG_PREFIX) private readonly prefix: string
  ) {
    this.defaultProperties = {};
  }

  public captureEvent = (event: {
    name: string;
    properties?: PosthogProperties;
  }): void => {
    if (this.parentCaptureEvent.observed) {
      this.parentCaptureEvent.emit({
        name: `${this.prefix}-${event.name}`,
        properties: { ...this.defaultProperties, ...event.properties },
      });
    } else {
      this.posthogService.capture(`${this.prefix}-${event.name}`, {
        ...this.defaultProperties,
        ...event.properties,
      });
    }
  };

  public updateDefaultPosthogProperties = (
    newProperties: PosthogProperties
  ): void => {
    this.defaultProperties = { ...this.defaultProperties, ...newProperties };
  };
}
