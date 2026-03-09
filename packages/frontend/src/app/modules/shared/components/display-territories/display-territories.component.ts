import { Component, Input, OnInit } from "@angular/core";
import {
  AnyDepartmentCode,
  CommonUser,
  DEPARTMENTS_MAP,
  getTerritoriesFromAreas,
} from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../../../models";
import { Organisation } from "../../../admin-organisation/interfaces";

@Component({
  selector: "app-display-territories",
  templateUrl: "./display-territories.component.html",
  styleUrls: ["./display-territories.component.css"],
})
export class DisplayTerritoriesComponent implements OnInit {
  @Input() public organizationOrUser: CommonUser | Organisation;

  public departments: AnyDepartmentCode[] = [];

  public readonly DEPARTMENTS_LIST =
    DEPARTMENTS_MAP[THEME_CONFIGURATION.country];

  public readonly allDepartmentsLength = Object.values(
    DEPARTMENTS_MAP[THEME_CONFIGURATION.country]
  ).length;

  ngOnInit() {
    this.departments = getTerritoriesFromAreas(
      this.organizationOrUser,
      THEME_CONFIGURATION.country
    );
  }
}
