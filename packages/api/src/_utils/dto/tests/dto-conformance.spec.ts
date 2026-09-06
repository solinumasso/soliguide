import { CountryCodes, UserStatus } from "@soliguide/common";

import { buildBodyForField, collectDtos } from "../../tests/collect-dtos";
import {
  ARRAY_SMUGGLING,
  HTML_INJECTIONS,
  MONGO_INJECTIONS,
  NODE_INJECTIONS,
} from "../../tests/injection-payloads";
import { runDto } from "../../tests/run-dto";

/**
 * The contract every DTO of the API owes, checked on all of them at once rather than
 * one spec at a time: whatever a client sends, a chain records a validation error and
 * the route answers 400. It never lets an exception escape, which express-validator
 * turns into a 500 when it comes from a `customSanitizer`.
 *
 * This is the generic form of `bail()`. Placing a bail before every sanitizer is a
 * convention, and a convention is only as good as the next review. This spec turns it
 * into a rule the build enforces, on every DTO, including the ones written later.
 */

// A representative payload of each family, kept short since it runs against every
// field of every DTO
const CONFORMANCE_PAYLOADS = [
  ...MONGO_INJECTIONS.filter(({ label }) =>
    [
      "$ne null",
      "$gt empty string",
      "$regex match all",
      "$where javascript",
    ].includes(label)
  ),
  ...NODE_INJECTIONS.filter(({ label }) =>
    [
      "null",
      "empty string",
      "number zero",
      "false",
      "NaN",
      "large number",
      "prototype key constructor",
      "prototype key __proto__",
      "prototype pollution payload",
      "object with broken toString",
      "array-like object",
      "very long string",
      "null byte",
      "path traversal",
      "date instance",
      "empty object",
      "nested object",
    ].includes(label)
  ),
  ...HTML_INJECTIONS.filter(({ label }) =>
    ["script tag", "img onerror", "anchor javascript scheme"].includes(label)
  ),
  ...ARRAY_SMUGGLING,
];

// Chains that read the caller rather than the payload need one to read
const CALLER = {
  user: {
    _id: "507f1f77bcf86cd799439011",
    status: UserStatus.ADMIN_SOLIGUIDE,
    mail: "admin@solinum.org",
    areas: {},
    organizations: [],
  },
  isAdmin: true,
};

/**
 * The DTO fields that still let an exception escape, and therefore still answer 500
 * instead of 400. This is the work list of the branch, frozen so the suite stays green
 * while it shrinks, and so no NEW field can join it unnoticed.
 *
 * An entry is asserted to still fail: fixing a field makes its line fail here, which is
 * the signal to delete it from this list. The list only ever gets shorter.
 */
const KNOWN_UNSAFE = new Set([
  "general/dto/contactEmail.dto.ts / contactEmailDto::message",
  "general/dto/contactEmail.dto.ts / contactEmailDto::subject",
  "organization/dto/createOrga.dto.ts / baseEditOrganizationDto::fax",
  "organization/dto/createOrga.dto.ts / orgaDto::fax",
  "place/dto/administrative.dto.ts / administrativeDto::publics",
  "place/dto/age.dto.ts / ageDto::publics",
  "place/dto/date.dto.ts / dateDto::date",
  "place/dto/family.dto.ts / familyDto::publics",
  "place/dto/gender.dto.ts / genderDto::publics",
  "place/dto/modalities.dto.ts / modalitiesDto::modalities.docs",
  "place/dto/other.dto.ts / otherDto::publics",
  "place/dto/parcours.dto.ts / parcoursDto::*.photos",
  "place/dto/publics.dto.ts / publicsDto::publics.description",
  "place/dto/services.dto.ts / servicesDto::services_all",
  "place/dto/services.dto.ts / servicesDto::services_all.*",
  "place/dto/services.dto.ts / servicesDto::services_all.*.categorySpecificFields.activityName",
  "place/dto/services.dto.ts / servicesDto::services_all.*.categorySpecificFields.mobilityAssistanceName",
  "place/dto/services.dto.ts / servicesDto::services_all.*.categorySpecificFields.wellnessActivityName",
  "place/dto/services.dto.ts / servicesDto::services_all.*.close",
  "place/dto/services.dto.ts / servicesDto::services_all.*.close.actif",
  "place/dto/services.dto.ts / servicesDto::services_all.*.description",
  "place/dto/services.dto.ts / servicesDto::services_all.*.differentHours",
  "place/dto/services.dto.ts / servicesDto::services_all.*.differentModalities",
  "place/dto/services.dto.ts / servicesDto::services_all.*.differentPublics",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.closedHolidays",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.description",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.friday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.monday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.saturday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.sunday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.thursday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.tuesday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.hours.wednesday",
  "place/dto/services.dto.ts / servicesDto::services_all.*.isCampaign",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.animal?.checked",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.appointment.checked",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.appointment.precisions",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.docs",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.inconditionnel",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.inscription.checked",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.inscription.precisions",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.orientation.checked",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.orientation.precisions",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.other",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.pmr?.checked",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.thermalComfort",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.thermalComfort.airConditioned",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities.thermalComfort.heated",
  "place/dto/services.dto.ts / servicesDto::services_all.*.modalities?.price",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.accueil",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.administrative.*",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.age",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.age.max",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.age.min",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.description",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.familialle.*",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.gender.*",
  "place/dto/services.dto.ts / servicesDto::services_all.*.publics.other.*",
  "place/dto/services.dto.ts / servicesDto::services_all.*.saturated",
  "place/dto/services.dto.ts / servicesDto::services_all.*.saturated.precision",
  "place/dto/services.dto.ts / servicesDto::services_all.*.saturated.status",
  "place/dto/services.dto.ts / servicesDto::services_all.*.serviceObjectId",
  "search/dto/categories.dto.ts / categoriesDto::categories",
  "search/dto/categories.dto.ts / categoriesToExcludeDto::catToExclude",
  "search/dto/publics.dto.ts / publicsDto::publics.administrative",
  "search/dto/publics.dto.ts / publicsDto::publics.familialle",
  "search/dto/publics.dto.ts / publicsDto::publics.gender",
  "search/dto/publics.dto.ts / publicsDto::publics.other",
  "search/dto/search.dto.ts / searchDto::categories",
  "search/dto/search.dto.ts / searchDto::publics.administrative",
  "search/dto/search.dto.ts / searchDto::publics.familialle",
  "search/dto/search.dto.ts / searchDto::publics.gender",
  "search/dto/search.dto.ts / searchDto::publics.other",
  "search/dto/search.dto.ts / searchDto::updatedAt.value",
  "search/dto/search.dto.ts / searchDto::word",
  "search/dto/searchAdmin.dto.ts / searchAdminDto::autonomy",
  "search/dto/searchAdmin.dto.ts / searchAdminDto::catToExclude",
  "search/dto/searchAdmin.dto.ts / searchAdminDto::updatedByUserAt.value",
  "search/dto/searchAdmin.dto.ts / searchAdminDto::word",
  "search/dto/searchAdmin.dto.ts / searchAdminForOrgasDto::word",
  "search/dto/searchUpdatedAt.dto.ts / searchUpdatedAtDto::updatedAt.value",
  "temp-info/dto/start-and-end-date.dto.ts / startAndEndDateDto::dateDebut",
  "temp-info/dto/start-and-end-date.dto.ts / startAndEndDateDto::dateFin",
  "temp-info/dto/temp-info.dto.ts / baseTempInfoDto::dateDebut",
  "temp-info/dto/temp-info.dto.ts / baseTempInfoDto::dateFin",
  "temp-info/dto/temp-info.dto.ts / baseTempInfoDto::description",
  "temp-info/dto/temp-info.dto.ts / tempInfoInServicesDto::*",
  "temp-info/dto/temp-info.dto.ts / tempInfoInServicesDto::isCampaign",
  "user/dto/changeUserTerritory.dto.ts / changeUserTerritoryDto::territories",
  "user/dto/commonUserForm.dto.ts / commonUserFormDto::phone",
  "user/dto/inviteUser.dto.ts / inviteUserDto::phone",
  "user/dto/patchUser.dto.ts / patchMyAccountDto::phone",
  "user/dto/patchUser.dto.ts / patchUserDto::phone",
  "user/dto/patchUser.dto.ts / patchUserFromContactDto::phone",
  "user/dto/signup.dto.ts / signupAfterInvitationDto::phone",
  "user/dto/signup.dto.ts / signupDto::phone",
  "user/dto/signup.dto.ts / signupTranslatorDto::phone",
]);

const dtos = collectDtos();

describe("every DTO of the API", () => {
  it("should have been collected", () => {
    // Guards against a refactor that silently empties this suite
    expect(dtos.length).toBeGreaterThan(30);
  });

  describe.each(dtos)("$file / $name", ({ file, name, chains, fields }) => {
    it.each(fields)(
      "should answer 400 rather than 500 for every hostile value of %s",
      async (field) => {
        const escaped: { label: string; message: string }[] = [];

        for (const { label, value } of CONFORMANCE_PAYLOADS) {
          const result = await runDto(chains, {
            body: {
              // Several chains read a sibling country to decide what they accept
              country: CountryCodes.FR,
              ...buildBodyForField(field, value),
            },
            context: CALLER,
          });

          if (result.thrown) {
            escaped.push({ label, message: result.thrown.message });
          }
        }

        if (KNOWN_UNSAFE.has(`${file} / ${name}::${field}`)) {
          // Still to fix. Once it is, this assertion fails, which is the reminder
          // to remove the entry from KNOWN_UNSAFE.
          expect(escaped.length).toBeGreaterThan(0);
          return;
        }

        expect(
          escaped.map(
            ({ label, message }) =>
              `the payload "${label}" escaped the chain: ${message}`
          )
        ).toEqual([]);
      }
    );
  });
});
