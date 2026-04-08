import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import {
  CampaignChangesSection,
  PlaceChangesSection,
  PlaceContact,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
} from "@soliguide/common";

import { CAMPAIGN_SOURCE_LABELS } from "../../../../models/campaign";
import { PlaceChangesTypeEdition } from "../../../../models/place-changes";
import { Place } from "../../../../models/place";
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
  @Input() public oldPlace!: Place;
  @Input() public placeChanged!: Place;
  @Input() public section!: PlaceChangesSection | CampaignChangesSection;
  @Input() public photosChanged!: boolean;
  @Input() public changesDate!: Date;
  @Input() public changeSection!: "old" | "new";
  @Input() public typeOfEdition!: PlaceChangesTypeEdition;

  public readonly CAMPAIGN_SOURCE_LABELS = CAMPAIGN_SOURCE_LABELS;
  public readonly PlaceChangesSection = PlaceChangesSection;
  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceType = PlaceType;
  public readonly PlaceVisibility = PlaceVisibility;

  public servicesChanges: ServicesChanges = new ServicesChanges([], []);
  public serviceSubSectionChanges: Record<string, ServiceSubSectionChange> = {};
  public descriptionDiff: SafeHtml | null = null;
  public nameChanged = false;
  public publicsAccueilChanged = false;
  public publicsDetailsChanged = false;
  public publicsDescriptionDiff: SafeHtml | null = null;
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

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.changeSection !== "new" || !this.oldPlace) return;

    switch (this.section) {
      case PlaceChangesSection.services:
        this.computeServicesChanges();
        break;
      case PlaceChangesSection.generalinfo:
      case PlaceChangesSection.new:
        this.computeGeneralInfoChanges();
        break;
      case PlaceChangesSection.public:
        this.computePublicsChanges();
        break;
      case PlaceChangesSection.status:
        this.statusChanged = this.oldPlace.status !== this.placeChanged.status;
        break;
      case PlaceChangesSection.visibility:
        this.visibilityChanged =
          this.oldPlace.visibility !== this.placeChanged.visibility;
        break;
      case PlaceChangesSection.hours:
        this.hoursChanged =
          JSON.stringify(this.oldPlace.newhours) !==
          JSON.stringify(this.placeChanged.newhours);
        break;
      case PlaceChangesSection.modalities:
        this.computeModalitiesChanges();
        break;
      case PlaceChangesSection.contacts:
        this.computeContactsChanges();
        break;
    }
  }

  private computeServicesChanges(): void {
    this.servicesChanges = new ServicesChanges(
      this.oldPlace.services_all,
      this.placeChanged.services_all
    );
    for (const newService of this.servicesChanges.edited) {
      const oldService =
        this.servicesChanges.oldServicesEdited[newService.serviceObjectId];
      if (oldService) {
        this.serviceSubSectionChanges[newService.serviceObjectId] = {
          hoursAdded: !oldService.differentHours && !!newService.differentHours,
          hoursChanged:
            !!oldService.differentHours &&
            !!newService.differentHours &&
            JSON.stringify(oldService.hours) !==
              JSON.stringify(newService.hours),
          modalitiesAdded:
            !oldService.differentModalities && !!newService.differentModalities,
          modalitiesChanged:
            !!oldService.differentModalities &&
            !!newService.differentModalities &&
            JSON.stringify(oldService.modalities) !==
              JSON.stringify(newService.modalities),
          publicsAdded:
            !oldService.differentPublics && !!newService.differentPublics,
          publicsChanged:
            !!oldService.differentPublics &&
            !!newService.differentPublics &&
            JSON.stringify(oldService.publics) !==
              JSON.stringify(newService.publics),
        };
      }
    }
  }

  private computeGeneralInfoChanges(): void {
    this.nameChanged = this.oldPlace.name !== this.placeChanged.name;
    const oldDesc = this.stripHtml(this.oldPlace.description ?? "");
    const newDesc = this.stripHtml(this.placeChanged.description ?? "");
    if (oldDesc !== newDesc) {
      this.descriptionDiff = this.sanitizer.bypassSecurityTrustHtml(
        this.buildDiffHtml(oldDesc, newDesc)
      );
    }
  }

  private computePublicsChanges(): void {
    const oldPublics = this.oldPlace.publics;
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
        this.publicsDescriptionDiff = this.sanitizer.bypassSecurityTrustHtml(
          this.buildDiffHtml(
            oldPublics.description ?? "",
            newPublics.description ?? ""
          )
        );
      }
    }

    ({ added: this.languagesAdded, removed: this.languagesRemoved } =
      computeArrayDiff(
        this.oldPlace.languages ?? [],
        this.placeChanged.languages ?? []
      ));
    this.languagesChanged =
      this.languagesAdded.length > 0 || this.languagesRemoved.length > 0;

    const anyPublicChange =
      this.publicsAccueilChanged ||
      this.publicsDetailsChanged ||
      !!this.publicsDescriptionDiff;
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

  private computeModalitiesChanges(): void {
    this.modalitiesChanged =
      JSON.stringify(this.oldPlace.modalities) !==
      JSON.stringify(this.placeChanged.modalities);
    if (!this.modalitiesChanged) return;

    const oldModalities = this.oldPlace.modalities;
    const newModalities = this.placeChanged.modalities;
    // Each pair is [oldValue, newValue] for a boolean modality flag
    const modalityFlags: [boolean, boolean][] = [
      [!!oldModalities?.inconditionnel, !!newModalities?.inconditionnel],
      [
        !!oldModalities?.orientation?.checked,
        !!newModalities?.orientation?.checked,
      ],
      [
        !!oldModalities?.inscription?.checked,
        !!newModalities?.inscription?.checked,
      ],
      [
        !!oldModalities?.appointment?.checked,
        !!newModalities?.appointment?.checked,
      ],
      [!!oldModalities?.pmr?.checked, !!newModalities?.pmr?.checked],
      [!!oldModalities?.animal?.checked, !!newModalities?.animal?.checked],
      [!!oldModalities?.price?.checked, !!newModalities?.price?.checked],
    ];
    const anyAdded = modalityFlags.some(([old, cur]) => !old && cur);
    const anyRemoved = modalityFlags.some(([old, cur]) => old && !cur);
    if (anyAdded && !anyRemoved) {
      this.modalitiesBadge = BADGE_ADDED;
    } else if (anyRemoved && !anyAdded) {
      this.modalitiesBadge = BADGE_DELETED;
    }
  }

  private computeContactsChanges(): void {
    const oldContacts = this.oldPlace.contacts ?? [];
    const newContacts = this.placeChanged.contacts ?? [];
    const contactKey = (c: PlaceContact) => `${c.name}|${c.lastname}|${c.mail}`;
    ({ added: this.contactsAdded, removed: this.contactsRemoved } =
      computeArrayDiff(oldContacts, newContacts, contactKey));
  }

  // Returns true if both arrays contain the same elements regardless of order
  private sameUnordered(
    a: unknown[] | undefined,
    b: unknown[] | undefined
  ): boolean {
    return [...(a ?? [])].sort().join() === [...(b ?? [])].sort().join();
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

  /**
   * Builds the Longest Common Subsequence (LCS) dynamic programming matrix.
   * lcsMatrix[i][j] = length of LCS between oldTokens[0..i-1] and newTokens[0..j-1].
   */
  private computeLcsMatrix(
    oldTokens: string[],
    newTokens: string[]
  ): number[][] {
    const oldLen = oldTokens.length;
    const newLen = newTokens.length;

    const lcsMatrix = Array.from({ length: oldLen + 1 }, () =>
      new Array(newLen + 1).fill(0)
    );

    for (let i = 1; i <= oldLen; i++) {
      for (let j = 1; j <= newLen; j++) {
        if (oldTokens[i - 1] === newTokens[j - 1]) {
          lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1; // tokens match: extend LCS
        } else {
          lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]); // skip best side
        }
      }
    }

    return lcsMatrix;
  }

  /**
   * Traces back through the LCS matrix to reconstruct the diff as HTML parts.
   * - Matched tokens are kept as-is.
   * - Tokens only in newTokens are wrapped in <span class="diff-added">.
   * - Tokens only in oldTokens are wrapped in <del class="diff-deleted">.
   */
  private tracebackDiffParts(
    oldTokens: string[],
    newTokens: string[],
    lcsMatrix: number[][]
  ): string[] {
    const parts: string[] = [];
    let i = oldTokens.length;
    let j = newTokens.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
        // Tokens match: part of the LCS, kept unchanged
        parts.unshift(this.escapeHtml(newTokens[j - 1]));
        i--;
        j--;
      } else if (
        j > 0 &&
        (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])
      ) {
        // Token only in new text: added
        parts.unshift(
          `<span class="diff-added">${this.escapeHtml(newTokens[j - 1])}</span>`
        );
        j--;
      } else {
        // Token only in old text: deleted
        parts.unshift(
          `<del class="diff-deleted">${this.escapeHtml(oldTokens[i - 1])}</del>`
        );
        i--;
      }
    }

    return parts;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
