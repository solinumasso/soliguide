import { Component, Input } from "@angular/core";
@Component({
  selector: "app-display-languages",
  templateUrl: "./display-languages.component.html",
  styleUrls: ["./display-languages.component.css"],
})
export class DisplayLanguagesComponent {
  @Input() public languages: string[];
}
