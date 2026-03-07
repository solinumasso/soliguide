import { Component, Input } from "@angular/core";

import { PublicsElement } from "@soliguide/common";

import { IframeFormType } from "../../types";

@Component({
  selector: "app-publics-form",
  templateUrl: "./publics-form.component.html",
  styleUrls: ["./publics-form.component.scss"],
})
export class PublicsFormComponent {
  @Input() public formValue!: IframeFormType;

  public readonly PublicsElement = PublicsElement;
}
