import type { Themes } from "@soliguide/common";

import type { ModelWithId, User, UserPopulateType } from "../../_models";
import { AmqpUser } from "./AmqpUser.class";
import { AmqpEvent } from "../interfaces";

export class AmqpUserEvent extends AmqpUser implements AmqpEvent {
  public frontendUrl: string;
  public theme: Themes | null;
  public isUpdateCampaignOn: boolean;

  constructor(
    user: UserPopulateType | ModelWithId<User>,
    frontendUrl: string,
    theme: Themes | null,
    isUpdateCampaignOn?: boolean
  ) {
    super(user);
    this.frontendUrl = frontendUrl;
    this.theme = theme;
    this.isUpdateCampaignOn = Boolean(isUpdateCampaignOn);
  }
}
