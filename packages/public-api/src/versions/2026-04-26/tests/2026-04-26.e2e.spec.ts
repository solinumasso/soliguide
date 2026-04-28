import { ModuleRef } from "@nestjs/core";
import { describe, expect, it, vi } from "vitest";

import {
  UpgradePipeline,
  DowngradePipeline,
  VersionPathResolver,
} from "../../../versioning-engine";
import v20260426Definition from "../2026-04-26";
import { V20260426Context, V20260426ContextProvider } from "../runtime/context";

describe("2026-04-26 runtime versioning", () => {
  it("upgrades search requests and downgrades search responses with context", async () => {
    const context: V20260426Context = {
      legacyPlacesById: {
        "42": {
          auto: true,
          close: { actif: false },
          geoZones: [{ slug: "paris" }],
          lieu_id: 42,
          position: {
            addresse: "1 rue Exemple",
            codePostal: "75000",
            complementAdresse: "Bat A",
            departement: "Paris",
            departementCode: "75",
            pays: "fr",
            slugs: { departement: "paris", pays: "france" },
            ville: "Paris",
          },
          publics: { ukrainePrecisions: "Accueil possible" },
          services_all: [{ categorie: "food", jobsList: ["cook"] }],
          sourceLanguage: "fr",
        },
      },
    };
    const contextProvider: V20260426ContextProvider = {
      getContext: vi.fn(() => context),
    };
    const moduleRef = {
      create: vi.fn(async (Provider) => new Provider(contextProvider)),
      get: vi.fn(() => contextProvider),
    } as unknown as ModuleRef;
    const resolver = new VersionPathResolver([v20260426Definition]);

    const upgradedRequest = await new UpgradePipeline(
      moduleRef,
      resolver
    ).apply({
      fromVersion: "2026-01-01",
      payload: {
        category: "food",
        location: { geoType: "CITY", geoValue: "paris" },
        modalities: {
          animal: true,
          appointment: true,
          inconditionnel: true,
          inscription: true,
          orientation: true,
          pmr: true,
          price: true,
          sign: true,
        },
        publics: {
          accueil: 1,
          familialle: ["family"],
          other: ["other"],
        },
        word: "repas",
      },
      resourceName: "search-request",
      toVersion: "2026-04-26",
    });

    expect(upgradedRequest).toEqual({
      categories: ["food"],
      locations: [{ geoType: "CITY", geoValue: "paris" }],
      modalities: {
        acceptsPets: true,
        appointmentRequired: true,
        hasFees: true,
        hasSignLanguage: true,
        isAccessible: true,
        referalRequired: true,
        registrationRequired: true,
        unconditional: true,
      },
      publics: {
        family: ["family"],
        specific: ["other"],
        welcomeType: 1,
      },
      q: "repas",
    });

    const downgradedResponse = await new DowngradePipeline(
      moduleRef,
      resolver
    ).apply({
      fromVersion: "2026-04-26",
      payload: {
        places: [
          {
            lieu_id: 42,
            modalities: {
              accessibility: { wheelchair: true },
              animals: { checked: true },
              referral: { checked: true },
              registration: { checked: true },
              unconditional: true,
            },
            openingHours: { description: "Open" },
            organizationInfo: { name: "Org" },
            position: {
              address: "1 rue Exemple",
              city: "Paris",
              country: "fr",
              department: "Paris",
              departmentCode: "75",
              postalCode: "75000",
              slugs: { country: "france", department: "paris" },
            },
            publics: {
              family: ["family"],
              welcomeType: 1,
            },
            seoUrl: "org-paris",
            services: [
              {
                name: "Meal",
                tempClosure: {
                  active: true,
                  endDate: "2026-05-02",
                  startDate: "2026-05-01",
                },
              },
            ],
            tempInfo: {
              closure: {
                active: true,
                endDate: "2026-05-02",
                startDate: "2026-05-01",
              },
            },
            waypoints: [{ name: "Stop" }],
          },
        ],
      },
      resourceName: "search-response",
      toVersion: "2026-01-01",
    });

    expect(downgradedResponse).toEqual({
      places: [
        {
          auto: true,
          close: { actif: false },
          entity: { name: "Org" },
          geoZones: [{ slug: "paris" }],
          lieu_id: 42,
          modalities: {
            animal: { checked: true },
            inconditionnel: true,
            inscription: { checked: true },
            orientation: { checked: true },
            pmr: { checked: true },
          },
          newhours: { description: "Open" },
          parcours: [{ name: "Stop" }],
          position: {
            address: "1 rue Exemple",
            addresse: "1 rue Exemple",
            city: "Paris",
            codePostal: "75000",
            complementAdresse: "Bat A",
            country: "fr",
            department: "Paris",
            departmentCode: "75",
            departement: "Paris",
            departementCode: "75",
            pays: "fr",
            postalCode: "75000",
            slugs: {
              country: "france",
              departement: "paris",
              department: "paris",
              pays: "france",
            },
            ville: "Paris",
          },
          publics: {
            accueil: 1,
            familialle: ["family"],
            ukrainePrecisions: "Accueil possible",
          },
          seo_url: "org-paris",
          services_all: [
            {
              categorie: "food",
              close: {
                actif: true,
                dateDebut: "2026-05-01",
                dateFin: "2026-05-02",
              },
              jobsList: ["cook"],
              name: "Meal",
            },
          ],
          sourceLanguage: "fr",
          tempInfos: {
            closure: {
              actif: true,
              dateDebut: "2026-05-01",
              dateFin: "2026-05-02",
            },
          },
        },
      ],
    });
    expect(contextProvider.getContext).toHaveBeenCalledTimes(2);
  });
});
