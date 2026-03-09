import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { PlaceContact } from "@soliguide/common";

import { Subscription } from "rxjs";

import { PlaceContactsService } from "../../services/place-contacts.service";

import { User } from "../../../users/classes";

import { Place } from "../../../../models/place/classes";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-contacts",
  templateUrl: "./display-contacts.component.html",
  styleUrls: ["./display-contacts.component.css"],
})
export class DisplayContactsComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  @Input() public me!: User | null;
  @Input() public place!: Place;
  @Input() public allContacts: PlaceContact[];
  @Input() public template: "public" | "admin" | "historique";

  private readonly subscription: Subscription = new Subscription();

  public ableToSeeContacts: boolean;
  public collapsed: boolean;
  public contacts: PlaceContact[];
  public nContacts: number;
  public nLimit: number;
  public toCollapse: boolean;

  constructor(
    private readonly placeContactsService: PlaceContactsService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-contacts");
    this.ableToSeeContacts = false;
    this.collapsed = false;
    this.contacts = [];
    this.nContacts = 0;
    this.nLimit = 3;
    this.toCollapse = true;
  }

  public ngOnInit(): void {
    if (
      this.me &&
      (this.me.pro || this.me.admin) &&
      this.template !== "historique"
    ) {
      this.ableToSeeContacts = true;

      this.subscription.add(
        this.placeContactsService
          .getPlaceContacts(this.place.lieu_id)
          .subscribe((contacts: PlaceContact[]) => {
            this.contacts = contacts;
            this.nContacts = contacts.length;
            this.toCollapse = this.nContacts > 3;
            this.nLimit = this.toCollapse ? 3 : this.nContacts;
            this.collapsed = this.toCollapse;

            this.updateDefaultPosthogProperties({
              template: this.template,
              contacts: this.contacts,
            });
          })
      );
    } else if (this.template === "historique") {
      this.ableToSeeContacts = true;
      this.contacts = this.allContacts;
      this.nContacts = this.contacts.length;

      this.updateDefaultPosthogProperties({
        template: this.template,
        contacts: this.contacts,
      });
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadMoreContacts = (): void => {
    this.collapsed = !this.collapsed;
    this.nLimit = this.collapsed ? 3 : this.nContacts;

    this.captureEvent({
      name: "click-load-more-less-contacts",
      properties: { toCollapse: this.collapsed },
    });
  };
}
