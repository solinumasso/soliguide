import {
  CountryCodes,
  parsePhoneNumber,
  phoneUtil,
  type Themes,
} from "@soliguide/common";
import libPhoneNumber from "google-libphonenumber";
import type {
  InvitationPopulate,
  ModelWithId,
  User,
  UserPopulateType,
} from "../../_models";
import { AmqpEvent, SynchroAirtableEvent } from "../interfaces";
import { AmqpUserEvent } from "./AmqpUserEvent.class";

const { PhoneNumberFormat, PhoneNumberType } = libPhoneNumber;

export class AmqpSynchroAirtableUserEvent
  extends AmqpUserEvent
  implements AmqpEvent, SynchroAirtableEvent
{
  public entityType: "USER";

  public deleted: boolean;

  public countries: CountryCodes[];

  public parsedPhone?: string;

  public mobileNumber?: string;

  public landlineNumber?: string;

  public createdAt: Date | null;

  public lastLogin: Date | null;

  public invitationUrl: string | null;

  constructor(
    user: UserPopulateType | ModelWithId<User>,
    frontendUrl: string,
    theme: Themes | null,
    deleted = false
  ) {
    super(user, frontendUrl, theme);

    this.entityType = "USER";

    this.deleted = deleted;

    if (this.phone && this.phone.phoneNumber) {
      this.parsedPhone =
        parsePhoneNumber(this.phone, this.phone.countryCode as CountryCodes) ??
        "";

      try {
        const parsed = phoneUtil.parse(
          this.phone.phoneNumber,
          this.phone.countryCode.toLowerCase()
        );
        const e164 = phoneUtil.format(parsed, PhoneNumberFormat.E164);
        const type = phoneUtil.getNumberType(parsed);

        if (type === PhoneNumberType.FIXED_LINE) {
          this.landlineNumber = e164;
        } else if (
          type === PhoneNumberType.MOBILE ||
          type === PhoneNumberType.FIXED_LINE_OR_MOBILE
        ) {
          this.mobileNumber = e164;
        }
      } catch (_e) {
        // invalid phone — skip
      }
    }

    this.createdAt = user.verifiedAt ?? user.createdAt ?? null;

    this.lastLogin = user.lastLogin ?? null;

    const pendingInvitation = (
      user.invitations as InvitationPopulate[] | undefined
    )?.find((inv) => inv.pending && inv.token);

    this.invitationUrl = pendingInvitation?.token
      ? `${frontendUrl}/register/${pendingInvitation.token}`
      : null;
  }
}
