import { CheckAndPrecisions, Checked } from "../interfaces";
import { CommonPlaceDocument } from "./CommonPlaceDocument.class";

export class Modalities {
  public inconditionnel: boolean;

  public appointment: CheckAndPrecisions;
  public inscription: CheckAndPrecisions;
  public orientation: CheckAndPrecisions;
  public price: {
    checked?: boolean;
    precisions: string | null;
  };

  public animal: Checked;
  public pmr: Checked;

  public docs: CommonPlaceDocument[];

  public other: string | null;

  constructor(modalities?: Partial<Modalities>) {
    this.inconditionnel = modalities?.inconditionnel ?? true;

    this.appointment = modalities?.appointment ?? {
      checked: false,
      precisions: null,
    };
    this.inscription = modalities?.inscription ?? {
      checked: false,
      precisions: null,
    };
    this.orientation = modalities?.orientation ?? {
      checked: false,
      precisions: null,
    };
    this.price = {
      ...modalities?.price,
      precisions: modalities?.price?.precisions ?? null,
    };

    this.animal = modalities?.animal ?? {};
    this.pmr = modalities?.pmr ?? {};

    this.docs = modalities?.docs?.length
      ? modalities.docs.map(
          (doc: CommonPlaceDocument) => new CommonPlaceDocument(doc)
        )
      : [];

    this.other = modalities?.other ?? null;
  }
}
