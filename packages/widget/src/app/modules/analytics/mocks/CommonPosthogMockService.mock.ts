import { BehaviorSubject } from "rxjs";

export class CommonPosthogMockService {
  public enabled = false;

  private persistence: "memory" | "localStorage+cookie" = "memory";

  public mockInstance = jest.fn();

  public capture = (
    eventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties?: Record<string, any>
  ): void => {
    if (this.enabled) {
      this.posthogInstance.subscribe((posthogInstance) =>
        posthogInstance.identify(userId, properties)
      );
    }
  };

  public switchPersistence = (
    persistence: "memory" | "localStorage+cookie"
  ): void => {
    this.persistence = persistence;
    this.posthogInstance.subscribe((posthogInstance) =>
      posthogInstance.set_config(this.persistence)
    );
  };

  public posthogInstance = new BehaviorSubject({
    capture: this.mockInstance,
    identify: this.mockInstance,
    set_config: jest.fn(),
  });
}
