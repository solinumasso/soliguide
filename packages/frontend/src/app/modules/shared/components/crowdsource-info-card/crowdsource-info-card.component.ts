import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import { PlaceChangesSection } from "@soliguide/common";

import { User } from "../../../users/classes/user.class";
import {
  CrowdsourceService,
  CrowdsourcePayload,
  CrowdsourceUserContext,
} from "../../../../shared/services/crowdsource.service";
import {
  CROWDSOURCE_SECTIONS,
  CrowdsourceIconType,
  CrowdsourceSectionConfig,
} from "./crowdsource-sections.config";

const ICON_PATHS: Record<Exclude<CrowdsourceIconType, null>, string> = {
  snowflake:
    "M12 2v20 M17 5l-5 5-5-5 M17 19l-5-5-5 5 M2 12h20 M5 7l5 5-5 5 M19 7l-5 5 5 5",
  flame:
    "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
  clock: "M12 6v6l4 2 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
  "map-pin":
    "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  camera:
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

@Component({
  selector: "app-crowdsource-info-card",
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, TranslateModule],
  templateUrl: "./crowdsource-info-card.component.html",
  styleUrls: ["./crowdsource-info-card.component.css"],
})
export class CrowdsourceInfoCardComponent implements OnInit {
  @Input() public placeId!: number;
  @Input() public section!: PlaceChangesSection;
  @Input() public me: User | null = null;

  public selectedValue: unknown = undefined;
  public comment = "";
  public pseudo = "";
  public sending = false;
  public sent = false;

  constructor(
    private readonly crowdsourceService: CrowdsourceService,
    private readonly toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    if (this.crowdsourceService.hasSubmitted(this.placeId, this.section)) {
      this.sent = true;
    }
  }

  public get config(): CrowdsourceSectionConfig | undefined {
    return CROWDSOURCE_SECTIONS[this.section];
  }

  public get iconPath(): string | null {
    const type = this.config?.iconType;
    return type ? ICON_PATHS[type] : null;
  }

  public get hasSelection(): boolean {
    return this.selectedValue !== undefined;
  }

  public get canSubmit(): boolean {
    if (this.sending || !this.hasSelection) {
      return false;
    }
    return !!this.me || this.pseudo.trim().length > 0;
  }

  public selectOption(value: unknown): void {
    this.selectedValue = value;
  }

  public isSelected(value: unknown): boolean {
    return this.selectedValue === value;
  }

  public submit(): void {
    if (!this.canSubmit) {
      return;
    }

    const payload: CrowdsourcePayload = {
      placeId: this.placeId,
      section: this.section,
      value: this.selectedValue,
      comment: this.comment.trim(),
      pseudo: this.me ? null : this.pseudo.trim() || null,
      user: this.me ? this.buildUserContext(this.me) : null,
    };

    this.sending = true;
    this.crowdsourceService.submit(payload).subscribe({
      next: () => {
        this.sending = false;
        this.sent = true;
      },
      error: () => {
        this.sending = false;
        this.toastr.error("Impossible d'envoyer, réessayez plus tard.");
      },
    });
  }

  private buildUserContext(me: User): CrowdsourceUserContext {
    return {
      userId: me.user_id,
      mail: me.mail,
      name: me.name,
      lastname: me.lastname,
      status: me.status,
      admin: me.admin,
      pro: me.pro,
      organizationName: me.currentOrga?.name ?? null,
    };
  }
}
