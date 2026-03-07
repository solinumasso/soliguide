import {
  CountryCodes,
  getCountryFromTheme,
  SupportedLanguagesCode,
  Themes,
} from "@soliguide/common";
import {
  ExpressRequest,
  ExpressResponse,
  FRONT_URLS_MAPPINGS,
} from "../../_models";
import { handleLanguageByTheme } from "../../middleware/request/services";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";
import {
  AmqpContactFormEvent,
  Exchange,
  RoutingKey,
  amqpEventsSender,
} from "../../events";

export const emailContact = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const country: CountryCodes = req.bodyValidated.country;
  const theme =
    Object.values(Themes).find((t) => getCountryFromTheme(t) === country) ??
    Themes.SOLIGUIDE_FR;
  const locale = handleLanguageByTheme(theme) ?? SupportedLanguagesCode.FR;
  const frontendUrl = FRONT_URLS_MAPPINGS[theme];

  const payload = new AmqpContactFormEvent({
    name: req.bodyValidated.name,
    email: req.bodyValidated.email,
    subject: req.bodyValidated.subject,
    message: req.bodyValidated.message,
    country,
    territory: req.bodyValidated.department ?? null,
    locale,
    frontendUrl,
    theme,
  });

  try {
    PosthogClient.instance.capture({
      event: TRACKED_EVENTS.API_SEND_CONTACT_EMAIL,
      req,
      properties: {
        contactForm: payload,
      },
    });

    await amqpEventsSender.sendToQueue<AmqpContactFormEvent>(
      Exchange.CONTACT_FORM,
      `${RoutingKey.CONTACT_FORM}.form-submitted`,
      payload,
      req.log
    );

    req.log.info({ payload }, "CONTACT_FORM_EVENT_SENT_TO_QUEUE");

    return res.status(200).json({ message: "EMAIL_CONTACT_SENT" });
  } catch (e) {
    req.log.error(e, "SEND_EMAIL_CONTACT_FAILED");
    return res.status(500).json({ message: "SEND_EMAIL_CONTACT_FAILED" });
  }
};
