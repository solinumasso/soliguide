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
import { ServicesChanges } from "../../classes";

@Component({
  selector: "app-display-place-changes",
  templateUrl: "./display-place-changes.component.html",
  styleUrls: ["./display-place-changes.component.scss"],
})
export class DisplayPlaceChangesComponent implements OnInit {
  @Input() public oldPlace!: Place;
  @Input() public placeChanged: Place;
  @Input() public section: PlaceChangesSection | CampaignChangesSection;
  @Input() public photosChanged: boolean;
  @Input() public changesDate: Date;
  @Input() public changeSection: "old" | "new";
  @Input() public typeOfEdition: PlaceChangesTypeEdition;

  public readonly CAMPAIGN_SOURCE_LABELS = CAMPAIGN_SOURCE_LABELS;

  public readonly PlaceChangesSection = PlaceChangesSection;
  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceType = PlaceType;
  public readonly PlaceVisibility = PlaceVisibility;

  public servicesChanges: ServicesChanges = new ServicesChanges([], []);
  public serviceSubSectionChanges: {
    [serviceObjectId: string]: {
      hoursAdded: boolean;
      modalitiesAdded: boolean;
      publicsAdded: boolean;
    };
  } = {};
  public descriptionDiff: SafeHtml | null = null;
  public nameChanged = false;
  public publicsAccueilChanged = false;
  public publicsDetailsChanged = false;
  public publicsDescriptionDiff: SafeHtml | null = null;
  public statusChanged = false;
  public visibilityChanged = false;
  public modalitiesChanged = false;
  public contactsAdded: PlaceContact[] = [];
  public contactsRemoved: PlaceContact[] = [];
  public languagesAdded: string[] = [];
  public languagesRemoved: string[] = [];
  public languagesChanged = false;
  public publicsBadgeClass = "change-tag-modified";
  public publicsBadgeKey = "CHANGE_TAG_MODIFIED";
  public modalitiesBadgeClass = "change-tag-modified";
  public modalitiesBadgeKey = "CHANGE_TAG_MODIFIED";

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (
      this.section === PlaceChangesSection.services &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.servicesChanges = new ServicesChanges(
        this.oldPlace.services_all,
        this.placeChanged.services_all
      );
      for (const newService of this.servicesChanges.edited) {
        const oldService =
          this.servicesChanges.oldServicesEdited[newService.serviceObjectId];
        if (oldService) {
          this.serviceSubSectionChanges[newService.serviceObjectId] = {
            hoursAdded:
              !oldService.differentHours && !!newService.differentHours,
            modalitiesAdded:
              !oldService.differentModalities &&
              !!newService.differentModalities,
            publicsAdded:
              !oldService.differentPublics && !!newService.differentPublics,
          };
        }
      }
    }

    if (
      (this.section === PlaceChangesSection.generalinfo ||
        this.section === PlaceChangesSection.new) &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.nameChanged = this.oldPlace.name !== this.placeChanged.name;
      const oldDesc = this.stripHtml(this.oldPlace.description ?? "");
      const newDesc = this.stripHtml(this.placeChanged.description ?? "");
      if (oldDesc !== newDesc) {
        this.descriptionDiff = this.sanitizer.bypassSecurityTrustHtml(
          this.buildDiffHtml(oldDesc, newDesc)
        );
      }
    }

    if (
      this.section === PlaceChangesSection.public &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      const oldP = this.oldPlace.publics;
      const newP = this.placeChanged.publics;
      if (oldP && newP) {
        this.publicsAccueilChanged = oldP.accueil !== newP.accueil;
        this.publicsDetailsChanged =
          [...(oldP.gender ?? [])].sort().join() !==
            [...(newP.gender ?? [])].sort().join() ||
          [...(oldP.administrative ?? [])].sort().join() !==
            [...(newP.administrative ?? [])].sort().join() ||
          [...(oldP.familialle ?? [])].sort().join() !==
            [...(newP.familialle ?? [])].sort().join() ||
          [...(oldP.other ?? [])].sort().join() !==
            [...(newP.other ?? [])].sort().join() ||
          oldP.age?.min !== newP.age?.min ||
          oldP.age?.max !== newP.age?.max;
        if (oldP.description !== newP.description) {
          this.publicsDescriptionDiff = this.sanitizer.bypassSecurityTrustHtml(
            this.buildDiffHtml(oldP.description ?? "", newP.description ?? "")
          );
        }
      }
      const oldLangs = new Set(this.oldPlace.languages ?? []);
      const newLangs = new Set(this.placeChanged.languages ?? []);
      this.languagesAdded = [...newLangs].filter((l) => !oldLangs.has(l));
      this.languagesRemoved = [...oldLangs].filter((l) => !newLangs.has(l));
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
        this.publicsBadgeClass = "change-tag-added";
        this.publicsBadgeKey = "CHANGE_TAG_ADDED";
      } else if (
        this.languagesRemoved.length > 0 &&
        this.languagesAdded.length === 0 &&
        !anyPublicChange
      ) {
        this.publicsBadgeClass = "change-tag-deleted";
        this.publicsBadgeKey = "CHANGE_TAG_DELETED";
      }
    }

    if (
      this.section === PlaceChangesSection.status &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.statusChanged = this.oldPlace.status !== this.placeChanged.status;
    }

    if (
      this.section === PlaceChangesSection.visibility &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.visibilityChanged =
        this.oldPlace.visibility !== this.placeChanged.visibility;
    }

    if (
      this.section === PlaceChangesSection.modalities &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.modalitiesChanged =
        JSON.stringify(this.oldPlace.modalities) !==
        JSON.stringify(this.placeChanged.modalities);

      if (this.modalitiesChanged) {
        const o = this.oldPlace.modalities;
        const n = this.placeChanged.modalities;
        const anyAdded =
          (!o?.inconditionnel && !!n?.inconditionnel) ||
          (!o?.orientation?.checked && !!n?.orientation?.checked) ||
          (!o?.inscription?.checked && !!n?.inscription?.checked) ||
          (!o?.appointment?.checked && !!n?.appointment?.checked) ||
          (!o?.pmr?.checked && !!n?.pmr?.checked) ||
          (!o?.animal?.checked && !!n?.animal?.checked) ||
          (!o?.price?.checked && !!n?.price?.checked);
        const anyRemoved =
          (!!o?.inconditionnel && !n?.inconditionnel) ||
          (!!o?.orientation?.checked && !n?.orientation?.checked) ||
          (!!o?.inscription?.checked && !n?.inscription?.checked) ||
          (!!o?.appointment?.checked && !n?.appointment?.checked) ||
          (!!o?.pmr?.checked && !n?.pmr?.checked) ||
          (!!o?.animal?.checked && !n?.animal?.checked) ||
          (!!o?.price?.checked && !n?.price?.checked);
        if (anyAdded && !anyRemoved) {
          this.modalitiesBadgeClass = "change-tag-added";
          this.modalitiesBadgeKey = "CHANGE_TAG_ADDED";
        } else if (anyRemoved && !anyAdded) {
          this.modalitiesBadgeClass = "change-tag-deleted";
          this.modalitiesBadgeKey = "CHANGE_TAG_DELETED";
        }
      }
    }

    if (
      this.section === PlaceChangesSection.contacts &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      const oldContacts = this.oldPlace.contacts ?? [];
      const newContacts = this.placeChanged.contacts ?? [];
      const key = (c: PlaceContact) => `${c.name}|${c.lastname}|${c.mail}`;
      const oldKeys = new Set(oldContacts.map(key));
      const newKeys = new Set(newContacts.map(key));
      this.contactsAdded = newContacts.filter((c) => !oldKeys.has(key(c)));
      this.contactsRemoved = oldContacts.filter((c) => !newKeys.has(key(c)));
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }

  private buildDiffHtml(oldText: string, newText: string): string {
    if (!oldText && !newText) return "";
    if (!oldText)
      return `<span class="diff-added">${this.escapeHtml(newText)}</span>`;
    if (!newText)
      return `<del class="diff-deleted">${this.escapeHtml(oldText)}</del>`;

    const oldTokens = oldText.split(/(\s+)/);
    const newTokens = newText.split(/(\s+)/);
    const m = oldTokens.length;
    const n = newTokens.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0)
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldTokens[i - 1] === newTokens[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const parts: string[] = [];
    let i = m;
    let j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
        parts.unshift(this.escapeHtml(newTokens[j - 1]));
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        parts.unshift(
          `<span class="diff-added">${this.escapeHtml(newTokens[j - 1])}</span>`
        );
        j--;
      } else {
        parts.unshift(
          `<del class="diff-deleted">${this.escapeHtml(oldTokens[i - 1])}</del>`
        );
        i--;
      }
    }

    return parts.join("");
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
