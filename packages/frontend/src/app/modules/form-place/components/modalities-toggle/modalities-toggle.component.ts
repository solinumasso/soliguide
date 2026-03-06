import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-modalities-toggle",
  templateUrl: "./modalities-toggle.component.html",
})
export class ModalitiesToggleComponent {
  @Input() public checked?: boolean;
  @Output() public readonly checkedChange = new EventEmitter<
    boolean | undefined
  >();

  toggleSwitch(value: boolean) {
    this.checked = value;
    this.checkedChange.emit(this.checked);
  }
}
