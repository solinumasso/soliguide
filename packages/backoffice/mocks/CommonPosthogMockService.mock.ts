import { BehaviorSubject } from "rxjs";

export class CommonPosthogMockService {
  public enabled = false;
  public mockInstance = jest.fn();

  public capture = (
    eventName: string,
    properties?: Record<string, any>
  ): void => {
    if (this.enabled) {
      this.posthogInstance.subscribe((posthogInstance) =>
        posthogInstance.capture(eventName, properties)
      );
    }
  };

  public identify = (
    userId: string,
    properties?: Record<string, any>
  ): void => {
    if (this.enabled) {
      this.posthogInstance.subscribe((posthogInstance) =>
        posthogInstance.identify(userId, properties)
      );
    }
  };

  public posthogInstance = new BehaviorSubject({
    capture: this.mockInstance,
    identify: this.mockInstance,
  });
}
