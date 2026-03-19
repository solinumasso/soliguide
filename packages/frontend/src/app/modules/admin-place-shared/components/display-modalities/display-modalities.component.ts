import { Component, Input, OnInit } from "@angular/core";

import type { Modalities } from "@soliguide/common";

type CheckedChange = { added: boolean; removed: boolean };
type CheckedWithPrecisionsChange = CheckedChange & {
  precisionsChanged: boolean;
};

// Add keys here when a new modality field is introduced in Modalities
const FIELDS_WITH_PRECISIONS = [
  "orientation",
  "inscription",
  "appointment",
  "price",
] as const;
const FIELDS_CHECKED_ONLY = ["pmr", "animal"] as const;

type FieldWithPrecisions = (typeof FIELDS_WITH_PRECISIONS)[number];
type FieldCheckedOnly = (typeof FIELDS_CHECKED_ONLY)[number];

interface ModalitiesChanges
  extends Record<FieldWithPrecisions, CheckedWithPrecisionsChange>,
    Record<FieldCheckedOnly, CheckedChange> {
  unconditional: CheckedChange;
  other: boolean;
}

const NO_CHANGE: ModalitiesChanges = {
  unconditional: { added: false, removed: false },
  orientation: { added: false, removed: false, precisionsChanged: false },
  inscription: { added: false, removed: false, precisionsChanged: false },
  appointment: { added: false, removed: false, precisionsChanged: false },
  price: { added: false, removed: false, precisionsChanged: false },
  pmr: { added: false, removed: false },
  animal: { added: false, removed: false },
  other: false,
};

@Component({
  selector: "app-display-modalities",
  templateUrl: "./display-modalities.component.html",
  styleUrls: ["./display-modalities.component.css"],
})
export class DisplayModalitiesComponent implements OnInit {
  @Input() public modalities!: Modalities;
  @Input() public isHistory!: boolean;
  @Input() public oldModalities?: Modalities;

  public changes: ModalitiesChanges = { ...NO_CHANGE };

  public ngOnInit(): void {
    if (!this.oldModalities) return;

    const oldModalities = this.oldModalities;
    const newModalities = this.modalities;

    this.changes.unconditional = {
      added: !oldModalities.inconditionnel && !!newModalities.inconditionnel,
      removed: !!oldModalities.inconditionnel && !newModalities.inconditionnel,
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
