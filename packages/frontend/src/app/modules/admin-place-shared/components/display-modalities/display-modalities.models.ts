import { ModalitiesElement } from "@soliguide/common";

export type CheckedChange = { added: boolean; removed: boolean };
export type CheckedWithPrecisionsChange = CheckedChange & {
  precisionsChanged: boolean;
};

export const FIELDS_WITH_PRECISIONS = [
  ModalitiesElement.ON_ORIENTATION,
  ModalitiesElement.ON_REGISTRATION,
  ModalitiesElement.ON_APPOINTMENT,
  ModalitiesElement.PRICE,
] as const;

export const FIELDS_CHECKED_ONLY = [
  ModalitiesElement.PRM,
  ModalitiesElement.ANIMAL,
] as const;

type FieldWithPrecisions = (typeof FIELDS_WITH_PRECISIONS)[number];
type FieldCheckedOnly = (typeof FIELDS_CHECKED_ONLY)[number];

export interface ModalitiesChanges
  extends Record<FieldWithPrecisions, CheckedWithPrecisionsChange>,
    Record<FieldCheckedOnly, CheckedChange> {
  unconditional: CheckedChange;
  other: boolean;
}

export const NO_CHANGE: ModalitiesChanges = {
  unconditional: { added: false, removed: false },
  orientation: { added: false, removed: false, precisionsChanged: false },
  inscription: { added: false, removed: false, precisionsChanged: false },
  appointment: { added: false, removed: false, precisionsChanged: false },
  price: { added: false, removed: false, precisionsChanged: false },
  pmr: { added: false, removed: false },
  animal: { added: false, removed: false },
  other: false,
};
