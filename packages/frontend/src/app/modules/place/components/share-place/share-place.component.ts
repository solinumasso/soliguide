/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Place, THEME_CONFIGURATION } from "../../../../models";
import { Clipboard } from "@angular/cdk/clipboard";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { DEFAULT_MODAL_OPTIONS } from "../../../../shared";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { OriginService } from "../../../shared/services/origin.service";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-share-place",
  templateUrl: "./share-place.component.html",
  styleUrls: ["./share-place.component.css"],
})
export class SharePlaceComponent
  extends PosthogComponent
  implements AfterViewInit
{
  @Input() public place!: Place;
  @Input() public showAddress = false;

  @ViewChild("shareModal", { static: true })
  public shareModal!: TemplateRef<NgbModalRef>;

  public linkTitle: string;
  public linkUrl: string;
  public linkDescription: string;

  public readonly PLATFORMS_TO_SHARE = [
    "whatsapp",
    "telegram",
    "sms",
    "facebook",
    "email",
  ] as const;

  public readonly faCopy = faCopy;

  constructor(
    private readonly toastrService: ToastrService,
    private readonly modalService: NgbModal,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly originService: OriginService,
    public readonly translateService: TranslateService,
    public readonly clipboard: Clipboard,
    posthogService: PosthogService
  ) {
    super(posthogService, "share-place");
    this.linkTitle = "";
    this.linkUrl = "";
    this.linkDescription = "";
  }

  public ngAfterViewInit(): void {
    this.updateShareLinks();
  }

  public updateShareLinks = (): void => {
    const baseUrl = this.originService.getFrontendUrl();
    this.linkTitle = `${this.place.name} - ${THEME_CONFIGURATION.brandName}`;
    this.linkUrl =
      `${baseUrl}` +
      this.currentLanguageService.currentLanguage +
      "/fiche/" +
      this.place.lieu_id;
    this.linkDescription = (
      this.place.name +
      ", " +
      (this.showAddress
        ? this.place.position.address
        : this.place.position.codePostalPlusVille) +
      " " +
      this.linkUrl
    ).trim();
  };

  public printFiche = (): void => {
    this.captureEvent({ name: "click-print-button" });

    window.print();
  };

  public copyLink = (): void => {
    this.toastrService.success(
      this.translateService.instant("LINK_COPIED_SUCCESSFULLY")
    );
  };

  public open(): void {
    this.modalService.open(this.shareModal, DEFAULT_MODAL_OPTIONS);

    this.captureEvent({ name: "click-share-button" });
  }

  public close(): void {
    this.captureEvent({ name: "click-close-share-modal-button" });

    this.modalService.dismissAll();
  }

  public clickOnPlatform = (
    platform: (typeof this.PLATFORMS_TO_SHARE)[number]
  ) => {
    this.captureEvent({
      name: "click-share-button",
      properties: {
        sharedPlatform: platform,
        sharedMessage: this.linkDescription,
      },
    });
  };
}
