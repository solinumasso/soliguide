import { CountryCodes, parsePhoneNumber, type Themes } from "@soliguide/common";
import type { ModelWithId, User, UserPopulateType } from "../../_models";
import { AmqpEvent, SynchroAirtableEvent } from "../interfaces";
import { AmqpUserEvent } from "./AmqpUserEvent.class";

export class AmqpSynchroAirtableUserEvent
  extends AmqpUserEvent
  implements AmqpEvent, SynchroAirtableEvent
{
  public entityType: "USER";

  public deleted: boolean;

  public countries: CountryCodes[];

  public parsedPhone?: string;

  constructor(
    user: UserPopulateType | ModelWithId<User>,
    frontendUrl: string,
    theme: Themes | null,
    deleted = false
  ) {
    super(user, frontendUrl, theme);

    this.entityType = "USER";

    this.deleted = deleted;

    if (this.phone) {
      this.parsedPhone =
        parsePhoneNumber(this.phone, this.phone.countryCode as CountryCodes) ??
        "";
    }
  }
}
