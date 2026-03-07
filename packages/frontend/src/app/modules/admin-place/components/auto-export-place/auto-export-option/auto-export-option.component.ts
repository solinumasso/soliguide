import { Component, Input } from "@angular/core";
import { ExportParams } from "@soliguide/common";

@Component({
  selector: "app-auto-export-option",
  templateUrl: "./auto-export-option.component.html",
  styleUrls: ["./auto-export-option.component.css"],
})
export class AutoExportOptionComponent {
  @Input() public option: string;
  @Input() public optionLabel: string;
  @Input() public params: ExportParams;
}
