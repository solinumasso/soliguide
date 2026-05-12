import { Component, Input, OnInit } from "@angular/core";

import type { Modalities } from "@soliguide/common";
import { ModalitiesElement } from "@soliguide/common";

import type { ModalitiesChanges } from "./display-modalities.models";
import {
  FIELDS_CHECKED_ONLY,
  FIELDS_WITH_PRECISIONS,
  NO_CHANGE,
} from "./display-modalities.models";

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
    const changes = { ...NO_CHANGE };

    changes.unconditional = {
      added:
        !oldModalities[ModalitiesElement.UNCONDITIONAL] &&
        !!newModalities[ModalitiesElement.UNCONDITIONAL],
      removed:
        !!oldModalities[ModalitiesElement.UNCONDITIONAL] &&
        !newModalities[ModalitiesElement.UNCONDITIONAL],
    };

    for (const key of FIELDS_WITH_PRECISIONS) {
      changes[key] = {
        added: this.checkedAdded(oldModalities[key], newModalities[key]),
        removed: this.checkedRemoved(oldModalities[key], newModalities[key]),
        precisionsChanged: this.precisionsChanged(
          oldModalities[key],
          newModalities[key]
        ),
      };
    }

    for (const key of FIELDS_CHECKED_ONLY) {
      changes[key] = {
        added: this.checkedAdded(oldModalities[key], newModalities[key]),
        removed: this.checkedRemoved(oldModalities[key], newModalities[key]),
      };
    }

    changes.other = oldModalities.other !== newModalities.other;
    this.changes = changes;
  }

  private checkedAdded(
    old: { checked?: boolean },
    next: { checked?: boolean }
  ): boolean {
    return !old?.checked && Boolean(next?.checked);
  }

  private checkedRemoved(
    old: { checked?: boolean },
    next: { checked?: boolean }
  ): boolean {
    return Boolean(old?.checked && !next?.checked);
  }

  private precisionsChanged(
    old: { checked?: boolean; precisions?: string | null },
    next: { checked?: boolean; precisions?: string | null }
  ): boolean {
    return Boolean(next?.checked && old?.precisions !== next?.precisions);
  }
}
