import { Component, Input, OnInit } from "@angular/core";

import { ModalitiesElement } from "@soliguide/common";
import type { Modalities } from "@soliguide/common";

import {
  FIELDS_CHECKED_ONLY,
  FIELDS_WITH_PRECISIONS,
  NO_CHANGE,
} from "./display-modalities.models";
import type { ModalitiesChanges } from "./display-modalities.models";

@Component({
  selector: "app-display-modalities",
  templateUrl: "./display-modalities.component.html",
  styleUrls: ["./display-modalities.component.css"],
})
export class DisplayModalitiesComponent implements OnInit {
  @Input({ required: true }) public modalities!: Modalities;
  @Input({ required: true }) public isHistory!: boolean;
  @Input() public oldModalities?: Modalities;

  public changes: ModalitiesChanges = { ...NO_CHANGE };

  public ngOnInit(): void {
    if (!this.oldModalities) return;

    const oldModalities = this.oldModalities;
    const newModalities = this.modalities;

    this.changes.unconditional = {
      added:
        !oldModalities[ModalitiesElement.UNCONDITIONAL] &&
        !!newModalities[ModalitiesElement.UNCONDITIONAL],
      removed:
        !!oldModalities[ModalitiesElement.UNCONDITIONAL] &&
        !newModalities[ModalitiesElement.UNCONDITIONAL],
    };

    for (const key of FIELDS_WITH_PRECISIONS) {
      this.changes[key] = {
        added: this.checkedAdded(oldModalities[key], newModalities[key]),
        removed: this.checkedRemoved(oldModalities[key], newModalities[key]),
        precisionsChanged: this.precisionsChanged(
          oldModalities[key],
          newModalities[key]
        ),
      };
    }

    for (const key of FIELDS_CHECKED_ONLY) {
      this.changes[key] = {
        added: this.checkedAdded(oldModalities[key], newModalities[key]),
        removed: this.checkedRemoved(oldModalities[key], newModalities[key]),
      };
    }

    this.changes.other = oldModalities.other !== newModalities.other;
  }

  private checkedAdded(
    old?: { checked?: boolean },
    next?: { checked?: boolean }
  ): boolean {
    return !old?.checked && !!next?.checked;
  }

  private checkedRemoved(
    old?: { checked?: boolean },
    next?: { checked?: boolean }
  ): boolean {
    return !!old?.checked && !next?.checked;
  }

  private precisionsChanged(
    old?: { checked?: boolean; precisions?: string | null },
    next?: { checked?: boolean; precisions?: string | null }
  ): boolean {
    return !!next?.checked && old?.precisions !== next?.precisions;
  }
}
