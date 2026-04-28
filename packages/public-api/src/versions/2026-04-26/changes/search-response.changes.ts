import {
  renameAt,
  renameNestedAt,
  restore,
  ResourceChangesFactory,
} from "../../../versioning-engine";
import v20260101SearchResponseSchema from "../../2026-01-01/2026-01-01.search-response.schema.generated";
import {
  accessibilitySchema,
  searchPlacesByTypeSchema,
  tempInfoSchema,
} from "./schemas";

export const searchResponseChanges: ResourceChangesFactory<
  typeof v20260101SearchResponseSchema,
  "response"
> = ({ patch, remove, rename, replaceSchema }) => [
  patch({
    title: "Remove hidden root place fields",
    impact: "breaking",
    payloadPath: "places",
    changes: [
      remove({
        payloadPath: "places.geoZones",
        downgrade: restore("places.geoZones"),
      }),
      remove({
        payloadPath: "places.auto",
        downgrade: restore("places.auto"),
      }),
      remove({
        payloadPath: "places.close",
        downgrade: restore("places.close"),
      }),
    ],
  }),

  remove({
    description:
      "Temporarily hides sourceLanguage while product discussions are unresolved.",
    payloadPath: "places.sourceLanguage",
    downgrade: restore("places.sourceLanguage"),
  }),

  patch({
    title: "Rename root place fields to explicit English names",
    impact: "breaking",
    payloadPath: "",
    changes: [
      rename({
        payloadPath: "places",
        from: "entity",
        to: "organizationInfo",
      }),
      rename({
        payloadPath: "places",
        from: "seo_url",
        to: "seoUrl",
      }),
      rename({
        payloadPath: "places",
        from: "newhours",
        to: "openingHours",
      }),
      rename({
        payloadPath: "places",
        from: "parcours",
        to: "waypoints",
      }),
    ],
  }),

  patch({
    title: "Remove legacy French position aliases",
    impact: "breaking",
    payloadPath: "places",
    changes: [
      remove({
        payloadPath: "places.position.addresse",
        downgrade: restore("places.position.addresse"),
      }),
      remove({
        payloadPath: "places.position.codePostal",
        downgrade: restore("places.position.codePostal"),
      }),
      remove({
        payloadPath: "places.position.complementAdresse",
        downgrade: restore("places.position.complementAdresse"),
      }),
      remove({
        payloadPath: "places.position.departement",
        downgrade: restore("places.position.departement"),
      }),
      remove({
        payloadPath: "places.position.departementCode",
        downgrade: restore("places.position.departementCode"),
      }),
      remove({
        payloadPath: "places.position.pays",
        downgrade: restore("places.position.pays"),
      }),
      remove({
        payloadPath: "places.position.ville",
        downgrade: restore("places.position.ville"),
      }),
      remove({
        payloadPath: "places.position.slugs.departement",
        downgrade: restore("places.position.slugs.departement"),
      }),
      remove({
        payloadPath: "places.position.slugs.pays",
        downgrade: restore("places.position.slugs.pays"),
      }),
    ],
  }),

  patch({
    title: "Rename tempInfos to tempInfo and normalize nested structure",
    payloadPath: "places",
    impact: "breaking",
    changes: [
      replaceSchema({
        payloadPath: "places.tempInfos",
        schema: tempInfoSchema,
        downgrade: renameNestedAt(
          "places.tempInfos",
          ["closure", "hours", "message"],
          {
            active: "actif",
            startDate: "dateDebut",
            endDate: "dateFin",
          }
        ),
      }),
      rename({
        payloadPath: "places",
        from: "tempInfos",
        to: "tempInfo",
      }),
    ],
  }),

  patch({
    title: "Rename services_all to services and reshape closure fields",
    impact: "breaking",
    payloadPath: "places",
    changes: [
      remove({
        payloadPath: "places.services_all.categorie",
        downgrade: restore("places.services_all.categorie"),
      }),
      rename({
        payloadPath: "places.services_all.close",
        from: "actif",
        to: "active",
      }),
      rename({
        payloadPath: "places.services_all.close",
        from: "dateDebut",
        to: "startDate",
      }),
      rename({
        payloadPath: "places.services_all.close",
        from: "dateFin",
        to: "endDate",
      }),
      rename({
        payloadPath: "places.services_all",
        from: "close",
        to: "tempClosure",
      }),
      remove({
        payloadPath: "places.services_all.jobsList",
        downgrade: restore("places.services_all.jobsList"),
      }),
      rename({
        payloadPath: "places",
        from: "services_all",
        to: "services",
      }),
    ],
  }),

  patch({
    title: "Normalize publics fields",
    impact: "breaking",
    payloadPath: "places",
    changes: [
      rename({
        payloadPath: "places.publics",
        from: "accueil",
        to: "welcomeType",
      }),
      rename({
        payloadPath: "places.publics",
        from: "familialle",
        to: "family",
      }),
      remove({
        payloadPath: "places.publics.ukrainePrecisions",
        downgrade: restore("places.publics.ukrainePrecisions"),
      }),
    ],
  }),

  patch({
    title: "Normalize modalities fields",
    impact: "breaking",
    payloadPath: "places",
    changes: [
      rename({
        payloadPath: "places.modalities",
        from: "inconditionnel",
        to: "unconditional",
      }),
      rename({
        payloadPath: "places.modalities",
        from: "inscription",
        to: "registration",
      }),
      rename({
        payloadPath: "places.modalities",
        from: "orientation",
        to: "referral",
      }),
      rename({
        payloadPath: "places.modalities",
        from: "animal",
        to: "animals",
      }),
      replaceSchema({
        payloadPath: "places.modalities.pmr",
        schema: accessibilitySchema,
        downgrade: renameAt("places.modalities.pmr", {
          wheelchair: "checked",
        }),
      }),
      rename({
        payloadPath: "places.modalities",
        from: "pmr",
        to: "accessibility",
      }),
    ],
  }),

  replaceSchema({
    title: "Discriminate place response shape by placeType",
    description:
      "PLACE responses expose position and openingHours but not waypoints. ITINERARY responses expose waypoints but not position or openingHours.",
    payloadPath: "places",
    impact: "breaking",
    schema: searchPlacesByTypeSchema,
  }),
];
