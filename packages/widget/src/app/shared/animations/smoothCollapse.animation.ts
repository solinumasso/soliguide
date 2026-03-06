import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

export const smoothCollapse = trigger("smoothCollapse", [
  state(
    "initial",
    style({
      height: "0",
      overflow: "hidden",
      opacity: "0",
      position: "relative",
      top: "-20px",
      padding: "0.5rem",
    })
  ),
  state(
    "final",
    style({
      overflow: "hidden",
      opacity: "1",
      position: "relative",
      top: "-0px",
      padding: "1rem",
    })
  ),
  transition("initial=>final", animate("500ms")),
  transition("final=>initial", animate("500ms")),
]);
