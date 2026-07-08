import { UserSearchContext } from "@soliguide/common";

// `campaignUserUuid` a `select: false` sur le schéma : il n'apparaît que si on
// le demande explicitement. Il est ajouté aux contextes qui alimentent le sync
// Brevo/Airtable ou qui doivent générer un lien `campaign-temp-forms`.
export const FIELDS_TO_SELECT_FOR_SEARCH: Record<UserSearchContext, string> = {
  MANAGE_PARTNERS:
    "_id blocked areas categoriesLimitations createdAt developer devToken lastname lastLogin mail name territories user_id verified",
  MANAGE_USERS:
    "_id campaignUserUuid createdAt areas invitations lastname lastLogin mail name organizations passwordToken status territories translator user_id verified",
  MANAGE_CAMPAIGN_USERS:
    "_id areas campaignUserUuid createdAt lastname mail name status territories user_id verified",
};
