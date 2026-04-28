import {
  fromSingleToArray,
  ResourceChangesFactory,
} from "../../../versioning-engine";
import v20260101SearchRequestSchema from "../../2026-01-01/2026-01-01.search-request.schema.generated";

export const searchRequestChanges: ResourceChangesFactory<
  typeof v20260101SearchRequestSchema,
  "request"
> = ({ patch, remove, rename }) => [
  remove({
    payloadPath: "category",
    upgrade: fromSingleToArray("category", "categories"),
  }),
  remove({
    payloadPath: "location",
    upgrade: fromSingleToArray("location", "locations"),
  }),
  rename({
    payloadPath: "",
    from: "word",
    to: "q",
  }),
  patch({
    title: "Translate modalities search filters to English",
    payloadPath: "",
    changes: [
      rename({ payloadPath: "modalities", from: "animal", to: "acceptsPets" }),
      rename({
        payloadPath: "modalities",
        from: "appointment",
        to: "appointmentRequired",
      }),
      rename({
        payloadPath: "modalities",
        from: "inconditionnel",
        to: "unconditional",
      }),
      rename({
        payloadPath: "modalities",
        from: "inscription",
        to: "registrationRequired",
      }),
      rename({
        payloadPath: "modalities",
        from: "orientation",
        to: "referalRequired",
      }),
      rename({ payloadPath: "modalities", from: "pmr", to: "isAccessible" }),
      rename({ payloadPath: "modalities", from: "price", to: "hasFees" }),
      rename({
        payloadPath: "modalities",
        from: "sign",
        to: "hasSignLanguage",
      }),
    ],
  }),
  patch({
    title: "Translate publics search filters to English",
    payloadPath: "",
    changes: [
      rename({ payloadPath: "publics", from: "accueil", to: "welcomeType" }),
      rename({ payloadPath: "publics", from: "familialle", to: "family" }),
      rename({ payloadPath: "publics", from: "other", to: "specific" }),
    ],
  }),
];
