import {
  SupportedLanguagesCode,
  UserStatus,
  UserStatusNotLogged,
  UserTypeLogged,
} from "@soliguide/common";
import {
  ExpressRequest,
  UserForLogs,
  PartialUserForLogs,
  UserFactory,
  NotLoggedUserType,
} from "../../../_models";
import { generateFullName } from "../../../_utils";
import { getUserLanguageFromRequest } from "./get-user-language-from-request";

export const getUserForLogs = (req: ExpressRequest): UserForLogs => {
  const user = req.user;

  // Where does the user come from: mobile? soliguide? other?
  const origin = req.requestInformation.originForLogs;
  let language = req.requestInformation.language ?? SupportedLanguagesCode.FR;

  if (req?.params?.lang) {
    const languageSelectedByUser = getUserLanguageFromRequest(req);
    req.requestInformation.language = languageSelectedByUser;
    language = languageSelectedByUser;
  }

  const partialUserForLogs: PartialUserForLogs = {
    language,
    orgaId: null,
    orgaName: null,
    origin,
    status: UserStatusNotLogged.NOT_LOGGED,
    referrer: req.requestInformation.referer,
    role: null,
    territory: null,
    user_id: null,
  };

  if (!user?.isLogged()) {
    const userForLogs = {
      ...partialUserForLogs,
    } as UserForLogs;

    if (req.body?.widgetId) {
      userForLogs.orgaName = req.body.widgetId;
      userForLogs.status = UserStatus.WIDGET_USER;
      userForLogs.userName = req.body.widgetId;
    }

    req.user = UserFactory.createUser({
      type: UserTypeLogged.NOT_LOGGED,
      status: userForLogs.status,
    } as NotLoggedUserType);

    return userForLogs;
  }

  const userForLogs: UserForLogs = {
    ...partialUserForLogs,
    email: user.mail,
    status: user.status,
    territory: user.territories[0] ?? null, // TODO: deprecated, have to replace with areas
    userName: generateFullName(user.name, user.lastname),
    user_id: user.user_id >= 0 ? user.user_id : null,
  };

  if (user.organizations?.length > 0) {
    const currentOrga = user.selectedOrgaIndex;

    userForLogs.orgaId =
      user.organizations[currentOrga]?.organization_id >= 0
        ? user.organizations[currentOrga].organization_id
        : null;
    userForLogs.orgaName = user.organizations[currentOrga]?.name ?? null;
    userForLogs.territory =
      user.organizations[currentOrga]?.territories[0] ?? null;
    userForLogs.role =
      user.userRights.filter(
        (userRight: { organization_id: number }) =>
          userRight.organization_id === userForLogs.orgaId
      )[0]?.role ?? null;
  }

  return userForLogs;
};
