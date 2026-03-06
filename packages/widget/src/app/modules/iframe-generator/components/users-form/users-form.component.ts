import { Component, Input } from "@angular/core";
import { IframeFormType } from "../../types";
import { REGEXP } from "@soliguide/common";

@Component({
  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.scss"],
})
export class UsersFormComponent {
  @Input() public formValue!: IframeFormType;
  public readonly emailRegexp = REGEXP.email;
}
