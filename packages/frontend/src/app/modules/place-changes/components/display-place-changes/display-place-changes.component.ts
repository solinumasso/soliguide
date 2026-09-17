import { Component, Input, OnInit, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import {
  CampaignChangesSection,
  PlaceChangesSection,
  PlaceContact,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
} from "@soliguide/common";

import { CAMPAIGN_SOURCE_LABELS } from "../../../../models/campaign";
import { Place } from "../../../../models/place";
import { PlaceChangesTypeEdition } from "../../../../models/place-changes";
import { computeArrayDiff, ServicesChanges } from "../../classes";

type BadgeConfig = { class: string; key: string };

const BADGE_MODIFIED: BadgeConfig = {
  class: "change-tag-modified",
  key: "CHANGE_TAG_MODIFIED",
};
const BADGE_ADDED: BadgeConfig = {
  class: "change-tag-added",
  key: "CHANGE_TAG_ADDED",
};
const BADGE_DELETED: BadgeConfig = {
  class: "change-tag-deleted",
  key: "CHANGE_TAG_DELETED",
};

interface ServiceSubSectionChange {
  hoursAdded: boolean;
  hoursChanged: boolean;
  modalitiesAdded: boolean;
  modalitiesChanged: boolean;
  publicsAdded: boolean;
  publicsChanged: boolean;
}

@Component({
  selector: "app-display-place-changes",
  templateUrl: "./display-place-changes.component.html",
  styleUrls: ["./display-place-changes.component.scss"],
})
export class DisplayPlaceChangesComponent implements OnInit {
  @Input() public oldPlace?: Place;
  @Input({ required: true }) public placeChanged!: Place;
  @Input({ required: true }) public section!:
    | PlaceChangesSection
    | CampaignChangesSection;
  @Input({ required: true }) public photosChanged!: boolean;
  @Input() public changesDate?: Date;
  @Input({ required: true }) public changeSection!: "old" | "new";
  @Input({ required: true }) public typeOfEdition!: PlaceChangesTypeEdition;

  public readonly CAMPAIGN_SOURCE_LABELS = CAMPAIGN_SOURCE_LABELS;
  public readonly PlaceChangesSection = PlaceChangesSection;
  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceType = PlaceType;
  public readonly PlaceVisibility = PlaceVisibility;

  public servicesChanges: ServicesChanges = new ServicesChanges([], []);
  public serviceSubSectionChanges: Record<string, ServiceSubSectionChange> = {};
  public descriptionDiff: string | null = null;
  public nameChanged = false;
  public publicsAccueilChanged = false;
  public publicsDetailsChanged = false;
  public publicsDescriptionDiff: string | null = null;
  public hoursChanged = false;
  public statusChanged = false;
  public visibilityChanged = false;
  public modalitiesChanged = false;
  public contactsAdded: PlaceContact[] = [];
  public contactsRemoved: PlaceContact[] = [];
  public languagesAdded: string[] = [];
  public languagesRemoved: string[] = [];
  public languagesChanged = false;
  public publicsBadge: BadgeConfig = BADGE_MODIFIED;
  public modalitiesBadge: BadgeConfig = BADGE_MODIFIED;
  public tempClosureBadge: BadgeConfig | null = null;
  public tempHoursBadge: BadgeConfig | null = null;
  public tempMessageBadge: BadgeConfig | null = null;

  private readonly sectionHandlers = new Map<
    PlaceChangesSection | CampaignChangesSection,
    (oldPlace: Place) => void
  >([
    [
      PlaceChangesSection.services,
      (oldPlace) => this.computeServicesChanges(oldPlace),
    ],
    [
      PlaceChangesSection.generalinfo,
      (oldPlace) => this.computeGeneralInfoChanges(oldPlace),
    ],
    [
      PlaceChangesSection.new,
      (oldPlace) => this.computeGeneralInfoChanges(oldPlace),
    ],
    [
      PlaceChangesSection.public,
      (oldPlace) => this.computePublicsChanges(oldPlace),
    ],
    [
      PlaceChangesSection.status,
      (oldPlace) => {
        this.statusChanged = oldPlace.status !== this.placeChanged.status;
      },
    ],
    [
      PlaceChangesSection.visibility,
      (oldPlace) => {
        this.visibilityChanged =
          oldPlace.visibility !== this.placeChanged.visibility;
      },
    ],
    [
      PlaceChangesSection.hours,
      (oldPlace) => {
        this.hoursChanged =
          JSON.stringify(oldPlace.newhours) !==
          JSON.stringify(this.placeChanged.newhours);
      },
    ],
    [
      PlaceChangesSection.modalities,
      (oldPlace) => this.computeModalitiesChanges(oldPlace),
    ],
    [
      PlaceChangesSection.contacts,
      (oldPlace) => this.computeContactsChanges(oldPlace),
    ],
    [
      PlaceChangesSection.tempClosure,
      (oldPlace) => {
        this.tempClosureBadge = this.computeTempInfoBadge(
          oldPlace.tempInfos.closure,
          this.placeChanged.tempInfos.closure
        );
      },
    ],
    [
      PlaceChangesSection.tempHours,
      (oldPlace) => {
        this.tempHoursBadge = this.computeTempInfoBadge(
          oldPlace.tempInfos.hours,
          this.placeChanged.tempInfos.hours
        );
      },
    ],
    [
      PlaceChangesSection.tempMessage,
      (oldPlace) => {
        this.tempMessageBadge = this.computeTempInfoBadge(
          oldPlace.tempInfos.message,
          this.placeChanged.tempInfos.message
        );
      },
    ],
  ]);

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const oldPlace = this.oldPlace;
    if (this.changeSection !== "new" || !oldPlace) return;
    this.sectionHandlers.get(this.section)?.(oldPlace);
  }

  private computeServicesChanges(oldPlace: Place): void {
    this.servicesChanges = new ServicesChanges(
      oldPlace.services_all,
      this.placeChanged.services_all
    );
    for (const newService of this.servicesChanges.edited) {
      const oldService =
        this.servicesChanges.oldServicesEdited[newService.serviceObjectId];
      if (oldService) {
        this.serviceSubSectionChanges[newService.serviceObjectId] = {
          hoursAdded:
            !oldService.differentHours && Boolean(newService.differentHours),
          hoursChanged:
            Boolean(oldService.differentHours) &&
            Boolean(newService.differentHours) &&
            JSON.stringify(oldService.hours) !==
              JSON.stringify(newService.hours),
          modalitiesAdded:
            !oldService.differentModalities &&
            Boolean(newService.differentModalities),
          modalitiesChanged:
            Boolean(oldService.differentModalities) &&
            Boolean(newService.differentModalities) &&
            JSON.stringify(oldService.modalities) !==
              JSON.stringify(newService.modalities),
          publicsAdded:
            !oldService.differentPublics &&
            Boolean(newService.differentPublics),
          publicsChanged:
            Boolean(oldService.differentPublics) &&
            Boolean(newService.differentPublics) &&
            JSON.stringify(oldService.publics) !==
              JSON.stringify(newService.publics),
        };
      }
    }
  }

  private computeGeneralInfoChanges(oldPlace: Place): void {
    this.nameChanged = oldPlace.name !== this.placeChanged.name;
    const oldDesc = this.stripHtml(oldPlace.description ?? "");
    const newDesc = this.stripHtml(this.placeChanged.description ?? "");
    if (oldDesc !== newDesc) {
      this.descriptionDiff = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.buildDiffHtml(oldDesc, newDesc)
      );
    }
  }

  private computePublicsChanges(oldPlace: Place): void {
    const oldPublics = oldPlace.publics;
    const newPublics = this.placeChanged.publics;
    if (oldPublics && newPublics) {
      this.publicsAccueilChanged = oldPublics.accueil !== newPublics.accueil;
      this.publicsDetailsChanged =
        !this.sameUnordered(oldPublics.gender, newPublics.gender) ||
        !this.sameUnordered(
          oldPublics.administrative,
          newPublics.administrative
        ) ||
        !this.sameUnordered(oldPublics.familialle, newPublics.familialle) ||
        !this.sameUnordered(oldPublics.other, newPublics.other) ||
        oldPublics.age?.min !== newPublics.age?.min ||
        oldPublics.age?.max !== newPublics.age?.max;
      if (oldPublics.description !== newPublics.description) {
        this.publicsDescriptionDiff = this.sanitizer.sanitize(
          SecurityContext.HTML,
          this.buildDiffHtml(
            oldPublics.description ?? "",
            newPublics.description ?? ""
          )
        );
      }
    }

    ({ added: this.languagesAdded, removed: this.languagesRemoved } =
      computeArrayDiff(
        oldPlace.languages ?? [],
        this.placeChanged.languages ?? []
      ));
    this.languagesChanged =
      this.languagesAdded.length > 0 || this.languagesRemoved.length > 0;

    const anyPublicChange =
      this.publicsAccueilChanged ||
      this.publicsDetailsChanged ||
      Boolean(this.publicsDescriptionDiff);
    if (
      this.languagesAdded.length > 0 &&
      this.languagesRemoved.length === 0 &&
      !anyPublicChange
    ) {
      this.publicsBadge = BADGE_ADDED;
    } else if (
      this.languagesRemoved.length > 0 &&
      this.languagesAdded.length === 0 &&
      !anyPublicChange
    ) {
      this.publicsBadge = BADGE_DELETED;
    }
  }

  private computeModalitiesChanges(oldPlace: Place): void {
    this.modalitiesChanged =
      JSON.stringify(oldPlace.modalities) !==
      JSON.stringify(this.placeChanged.modalities);
    if (!this.modalitiesChanged) return;

    const oldModalities = oldPlace.modalities;
    const newModalities = this.placeChanged.modalities;
    const modalityFlags: [boolean, boolean][] = [
      [
        Boolean(oldModalities?.inconditionnel),
        Boolean(newModalities?.inconditionnel),
      ],
      [
        Boolean(oldModalities?.orientation?.checked),
        Boolean(newModalities?.orientation?.checked),
      ],
      [
        Boolean(oldModalities?.inscription?.checked),
        Boolean(newModalities?.inscription?.checked),
      ],
      [
        Boolean(oldModalities?.appointment?.checked),
        Boolean(newModalities?.appointment?.checked),
      ],
      [
        Boolean(oldModalities?.pmr?.checked),
        Boolean(newModalities?.pmr?.checked),
      ],
      [
        Boolean(oldModalities?.animal?.checked),
        Boolean(newModalities?.animal?.checked),
      ],
      [
        Boolean(oldModalities?.price?.checked),
        Boolean(newModalities?.price?.checked),
      ],
    ];
    const anyAdded = modalityFlags.some(([old, cur]) => !old && cur);
    const anyRemoved = modalityFlags.some(([old, cur]) => old && !cur);
    if (anyAdded && !anyRemoved) {
      this.modalitiesBadge = BADGE_ADDED;
    } else if (anyRemoved && !anyAdded) {
      this.modalitiesBadge = BADGE_DELETED;
    }
  }

  public changeIndicatorClasses(
    badge: BadgeConfig | null
  ): Record<string, boolean> {
    return {
      "change-indicator": Boolean(badge),
      "change-indicator-added": badge === BADGE_ADDED,
      "change-indicator-modified": badge === BADGE_MODIFIED,
    };
  }

  private computeTempInfoBadge(
    oldInfo: { dateDebut: Date | null },
    newInfo: { dateDebut: Date | null }
  ): BadgeConfig | null {
    if (JSON.stringify(oldInfo) === JSON.stringify(newInfo)) return null;
    if (!oldInfo.dateDebut && newInfo.dateDebut) return BADGE_ADDED;
    if (oldInfo.dateDebut && !newInfo.dateDebut) return BADGE_DELETED;
    return BADGE_MODIFIED;
  }

  private computeContactsChanges(oldPlace: Place): void {
    const oldContacts = oldPlace.contacts ?? [];
    const newContacts = this.placeChanged.contacts ?? [];
    const contactKey = (contact: PlaceContact) =>
      `${contact.name}|${contact.lastname}|${contact.mail}`;
    ({ added: this.contactsAdded, removed: this.contactsRemoved } =
      computeArrayDiff(oldContacts, newContacts, contactKey));
  }

  private sameUnordered(
    firstArray: string[] | undefined,
    secondArray: string[] | undefined
  ): boolean {
    return (
      [...(firstArray ?? [])].sort((x, y) => x.localeCompare(y)).join() ===
      [...(secondArray ?? [])].sort((x, y) => x.localeCompare(y)).join()
    );
  }

  private stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent ?? div.innerText ?? "";
  }

  private buildDiffHtml(oldText: string, newText: string): string {
    if (!oldText && !newText) return "";
    if (!oldText)
      return `<span class="diff-added">${this.escapeHtml(newText)}</span>`;
    if (!newText)
      return `<del class="diff-deleted">${this.escapeHtml(oldText)}</del>`;

    const oldTokens = oldText.split(/(\s+)/);
    const newTokens = newText.split(/(\s+)/);

    const lcsMatrix = this.computeLcsMatrix(oldTokens, newTokens);
    const parts = this.tracebackDiffParts(oldTokens, newTokens, lcsMatrix);

    return parts.join("");
  }

  private computeLcsMatrix(
    oldTokens: string[],
    newTokens: string[]
  ): number[][] {
    const oldLen = oldTokens.length;
    const newLen = newTokens.length;

    const lcsMatrix = Array.from({ length: oldLen + 1 }, () =>
      new Array(newLen + 1).fill(0)
    );

    for (let rowIndex = 1; rowIndex <= oldLen; rowIndex++) {
      for (let colIndex = 1; colIndex <= newLen; colIndex++) {
        if (oldTokens[rowIndex - 1] === newTokens[colIndex - 1]) {
          lcsMatrix[rowIndex][colIndex] =
            lcsMatrix[rowIndex - 1][colIndex - 1] + 1;
        } else {
          lcsMatrix[rowIndex][colIndex] = Math.max(
            lcsMatrix[rowIndex - 1][colIndex],
            lcsMatrix[rowIndex][colIndex - 1]
          );
        }
      }
    }

    return lcsMatrix;
  }

  private tracebackDiffParts(
    oldTokens: string[],
    newTokens: string[],
    lcsMatrix: number[][]
  ): string[] {
    const parts: string[] = [];
    let oldIdx = oldTokens.length;
    let newIdx = newTokens.length;

    while (oldIdx > 0 || newIdx > 0) {
      if (
        oldIdx > 0 &&
        newIdx > 0 &&
        oldTokens[oldIdx - 1] === newTokens[newIdx - 1]
      ) {
        parts.unshift(this.escapeHtml(newTokens[newIdx - 1]));
        oldIdx--;
        newIdx--;
      } else if (
        newIdx > 0 &&
        (oldIdx === 0 ||
          lcsMatrix[oldIdx][newIdx - 1] >= lcsMatrix[oldIdx - 1][newIdx])
      ) {
        parts.unshift(
          `<span class="diff-added">${this.escapeHtml(
            newTokens[newIdx - 1]
          )}</span>`
        );
        newIdx--;
      } else {
        parts.unshift(
          `<del class="diff-deleted">${this.escapeHtml(
            oldTokens[oldIdx - 1]
          )}</del>`
        );
        oldIdx--;
      }
    }

    return parts;
  }

  private escapeHtml(text: string): string {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
}
