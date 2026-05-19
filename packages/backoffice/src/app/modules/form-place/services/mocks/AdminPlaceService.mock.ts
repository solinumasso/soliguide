import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  WelcomedPublics,
} from "@soliguide/common";

import { Observable, of, throwError } from "rxjs";

import { ApiError, Service, Place } from "../../../../models";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";

export class MockAdminPlaceService {
  public patchPublics(placeToPatch: Place): Observable<Place> {
    if (placeToPatch.publics.accueil !== WelcomedPublics.UNCONDITIONAL) {
      const errors: ApiError = new ApiError("Erreurs dans les publics");

      if (
        placeToPatch.publics.gender.length === GENDER_DEFAULT_VALUES.length &&
        placeToPatch.publics.administrative.length ===
          ADMINISTRATIVE_DEFAULT_VALUES.length &&
        placeToPatch.publics.familialle.length ===
          FAMILY_DEFAULT_VALUES.length &&
        placeToPatch.publics.other.length === 0 &&
        (placeToPatch.publics.showAge === false ||
          (placeToPatch.publics.age.min === 0 &&
            placeToPatch.publics.age.max === 99))
      ) {
        errors.error.push({
          value: placeToPatch.publics.accueil,
          msg: "NO_PUBLICS_VARIATION",
          path: "publics.accueil",
          location: "body",
        });

        errors.status = 400;
      } else {
        if (placeToPatch.publics.gender.length === 0) {
          errors.error.push({
            value: [],
            msg: "NO_GENDER_SELECTED",
            path: "publics.gender",
            location: "body",
          });

          errors.status = 400;
        }
        if (placeToPatch.publics.administrative.length === 0) {
          errors.error.push({
            value: [],
            msg: "NO_ADMINISTRATIVE_STATUS_SELECTED",
            path: "publics.administrative",
            location: "body",
          });

          errors.status = 400;
        }
        if (placeToPatch.publics.familialle.length === 0) {
          errors.error.push({
            value: [],
            msg: "NO_FAMILY_STATUS_SELECTED",
            path: "publics.familialle",
            location: "body",
          });

          errors.status = 400;
        }
      }

      if (errors.error.length > 0) {
        return throwError(() => errors);
      }
    }

    return of(placeToPatch);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getPlace(lieu_id: string, _admin = false): Observable<Place> {
    if (parseInt(lieu_id, 10) === ONLINE_PLACE_MOCK.lieu_id) {
      return of(ONLINE_PLACE_MOCK);
    }

    return throwError(() => new ApiError("MARAUDE_NOT_FOUND"));
  }

  public patchServices(
    _lieuId: number,
    services: Service[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _isCampaign = false
  ) {
    for (const service of services) {
      if (service.publics.accueil !== WelcomedPublics.UNCONDITIONAL) {
        const errors: ApiError = new ApiError("Erreurs dans les publics");

        if (
          service.publics.gender.length === GENDER_DEFAULT_VALUES.length &&
          service.publics.administrative.length ===
            ADMINISTRATIVE_DEFAULT_VALUES.length &&
          service.publics.familialle.length === FAMILY_DEFAULT_VALUES.length &&
          service.publics.other.length === 0 &&
          (service.publics.showAge === false ||
            (service.publics.age.min === 0 && service.publics.age.max === 99))
        ) {
          errors.error.push({
            value: service.publics.accueil,
            msg: "NO_PUBLICS_VARIATION",
            path: "services_all.0.publics.accueil",
            location: "body",
          });

          errors.status = 400;
        } else {
          if (service.publics.gender.length === 0) {
            errors.error.push({
              value: [],
              msg: "NO_GENDER_SELECTED",
              path: "services_all.0.publics.gender",
              location: "body",
            });

            errors.status = 400;
          }
          if (service.publics.administrative.length === 0) {
            errors.error.push({
              value: [],
              msg: "NO_ADMINISTRATIVE_STATUS_SELECTED",
              path: "services_all.0.publics.administrative",
              location: "body",
            });

            errors.status = 400;
          }
          if (service.publics.familialle.length === 0) {
            errors.error.push({
              value: [],
              msg: "NO_FAMILY_STATUS_SELECTED",
              path: "services_all.0.publics.familialle",
              location: "body",
            });

            errors.status = 400;
          }
        }

        if (errors.error.length > 0) {
          return throwError(() => errors);
        }
      }
    }
    return of(ONLINE_PLACE_MOCK);
  }
}
