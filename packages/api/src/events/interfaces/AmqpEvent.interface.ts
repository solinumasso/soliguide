import { Themes } from "@soliguide/common";

export interface AmqpEvent {
  frontendUrl: string;
  theme: Themes | null;
}
