import { Component, Input } from "@angular/core";
import { Params } from "@angular/router";

@Component({
  selector: "app-return-to-place",
  templateUrl: "./return-to-place.component.html",
  styleUrls: ["./return-to-place.component.css"],
})
export class ReturnToPlaceComponent {
  @Input() public returnUrl!: { url: (string | number)[]; queryParams: Params };
  @Input() public buttonText!: string;
  @Input() public buttonTitle!: string;
}
