import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-helper-notification",
  templateUrl: "./helper-notification.component.html",
  styleUrls: ["./helper-notification.component.css"],
})
export class HelperNotificationComponent {
  @Input() public title!: string;
  @Input() public message!: string;
  @Input() public link!: (string | number)[];
  @Input() public buttonMessage!: string;
  @Input() public type!: string;

  @Output() public readonly clickFunction = new EventEmitter<void>();
}
