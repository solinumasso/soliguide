/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPlaceDetails } from './placeDetails';
import { samplePlace, samplePlaceTransformed } from './placeDetailsData.mock';
import {
  Categories,
  PlaceOpeningStatus,
  PlaceStatus,
  PUBLICS_LABELS,
  PublicsGender,
  PublicsOther,
  ServiceSaturation,
  SupportedLanguagesCode,
  WelcomedPublics
} from '@soliguide/common';
import { PlaceDetailsInfoType } from './types';
import { getI18nStore, i18nInstance } from '../client/i18n';

describe('Place details Result', () => {
  let modifiedPlace = structuredClone(samplePlace);
  let modifiedPlaceResult = structuredClone(samplePlaceTransformed);
  const category = Categories.FOOD;
  const lang = SupportedLanguagesCode.EN;

  beforeAll(() => {
    getI18nStore();

    return new Promise((resolve) => {
      i18nInstance.on('initialized', resolve);
      setTimeout(resolve, 1000);
    });
  });

  beforeEach(() => {
    modifiedPlace = structuredClone(samplePlace);
    modifiedPlaceResult = structuredClone(samplePlaceTransformed);
  });

  describe('Conversion of one place result', () => {
    it('Data source is correctly mapped', () => {
      const resultItem = buildPlaceDetails(samplePlace, category, lang);
      expect(resultItem).toStrictEqual(samplePlaceTransformed);
    });

    describe('Determination of the status', () => {
      it('Temporarily closed if tempInfos closure is active', () => {
        vi.setSystemTime(new Date('2024-11-15T00:00:00Z'));

        modifiedPlace.isOpenToday = false;
        modifiedPlace.tempInfos.closure.actif = true;
        modifiedPlace.tempInfos.closure.dateDebut = new Date('2024-11-14T00:00:00Z');
        modifiedPlace.tempInfos.closure.dateFin = new Date('2024-11-17T00:00:00Z');

        modifiedPlaceResult.status = PlaceOpeningStatus.TEMPORARILY_CLOSED;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.status).toStrictEqual(modifiedPlaceResult.status);

        vi.useRealTimers();
      });

      it('Closed status if not opened today, has opening hours set, has no opened services, has no active closure', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.newhours.monday.open = true;
        // eslint-disable-next-line camelcase
        modifiedPlace.services_all = modifiedPlace.services_all.map((service) => ({
          ...service,
          isOpenToday: false
        }));
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;

        modifiedPlaceResult.status = PlaceOpeningStatus.CLOSED;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.status).toStrictEqual(modifiedPlaceResult.status);
      });

      it('Partially open if closed, has opening hours set, has opened services, has no active closure', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.newhours.monday.open = true;
        // eslint-disable-next-line camelcase
        modifiedPlace.services_all = modifiedPlace.services_all.map((service) => ({
          ...service,
          isOpenToday: true
        }));
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;

        modifiedPlaceResult.status = PlaceOpeningStatus.PARTIALLY_OPEN;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.status).toStrictEqual(modifiedPlaceResult.status);
      });

      it('Open if is opened today, has ONLINE state, has no active closure', () => {
        modifiedPlace.isOpenToday = true;
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;
        modifiedPlaceResult.status = PlaceOpeningStatus.OPEN;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.status).toStrictEqual(modifiedPlaceResult.status);
      });

      it('Unknown if not open today, has no opening hours, has not DRAFT state', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.newhours.monday = { open: false, timeslot: [] };
        modifiedPlace.newhours.tuesday = { open: false, timeslot: [] };
        modifiedPlace.newhours.wednesday = { open: false, timeslot: [] };
        modifiedPlace.newhours.thursday = { open: false, timeslot: [] };
        modifiedPlace.newhours.friday = { open: false, timeslot: [] };
        modifiedPlace.newhours.saturday = { open: false, timeslot: [] };
        modifiedPlace.newhours.sunday = { open: false, timeslot: [] };
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;

        modifiedPlaceResult.status = PlaceOpeningStatus.UNKNOWN;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.status).toStrictEqual(modifiedPlaceResult.status);
      });
    });

    describe('Determination of today info', () => {
      it('If open today, we have opening hours', () => {
        vi.setSystemTime(new Date(2024, 8, 16)); // It's a monday

        modifiedPlace.isOpenToday = true;
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;
        modifiedPlace.newhours.monday = { open: true, timeslot: [{ start: 902, end: 1901 }] };

        modifiedPlaceResult.status = PlaceOpeningStatus.OPEN;
        modifiedPlaceResult.todayInfo = { openingHours: [{ start: '0902', end: '1901' }] };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.todayInfo).toStrictEqual(modifiedPlaceResult.todayInfo);
      });

      it('If partially open, we have ?? opening hours', () => {
        vi.setSystemTime(new Date(2024, 8, 16)); // It's a monday

        modifiedPlace.newhours.monday.open = true;

        modifiedPlace.isOpenToday = false;
        // eslint-disable-next-line camelcase
        modifiedPlace.services_all = modifiedPlace.services_all.map((service) => ({
          ...service,
          isOpenToday: true
        }));
        modifiedPlace.tempInfos.closure.actif = false;

        modifiedPlaceResult.status = PlaceOpeningStatus.PARTIALLY_OPEN;
        modifiedPlaceResult.todayInfo = { openingHours: [{ end: '2015', start: '1930' }] };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.todayInfo).toStrictEqual(modifiedPlaceResult.todayInfo);
      });

      it('If temporarily closed, it is closed for holidays and we get the dates', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.tempInfos.closure.actif = true;
        modifiedPlace.tempInfos.closure.dateDebut = new Date('2024-04-01T00:00:00.000Z');
        modifiedPlace.tempInfos.closure.dateFin = new Date('2024-11-30T23:59:59.000Z');

        modifiedPlaceResult.status = PlaceOpeningStatus.TEMPORARILY_CLOSED;
        modifiedPlaceResult.todayInfo = {
          closingDays: {
            end: '2024-11-30T23:59:59.000Z',
            start: '2024-04-01T00:00:00.000Z'
          }
        };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.todayInfo).toStrictEqual(modifiedPlaceResult.todayInfo);
      });

      it('If closed, we do not have hours information', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.newhours.monday.open = true;
        // eslint-disable-next-line camelcase
        modifiedPlace.services_all = modifiedPlace.services_all.map((service) => ({
          ...service,
          isOpenToday: false
        }));
        modifiedPlace.tempInfos.closure.actif = false;
        modifiedPlace.status = PlaceStatus.ONLINE;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.todayInfo).toStrictEqual({});
      });

      it('If unknown state, we do not have hours information', () => {
        modifiedPlace.isOpenToday = false;
        modifiedPlace.newhours.monday = { open: false, timeslot: [] };
        modifiedPlace.newhours.tuesday = { open: false, timeslot: [] };
        modifiedPlace.newhours.wednesday = { open: false, timeslot: [] };
        modifiedPlace.newhours.thursday = { open: false, timeslot: [] };
        modifiedPlace.newhours.friday = { open: false, timeslot: [] };
        modifiedPlace.newhours.saturday = { open: false, timeslot: [] };
        modifiedPlace.newhours.sunday = { open: false, timeslot: [] };
        modifiedPlace.status = PlaceStatus.ONLINE;
        modifiedPlace.tempInfos.closure.actif = false;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.todayInfo).toStrictEqual({});
      });
    });

    describe('Determination of opening hours', () => {
      it('if the place has multiple timeslots, all should be present', () => {
        modifiedPlace.newhours.monday = {
          open: true,
          timeslot: [
            { start: 0, end: 600 },
            { start: 900, end: 1800 },
            { start: 2015, end: 2359 }
          ]
        };
        modifiedPlace.newhours.thursday = {
          open: true,
          timeslot: [
            { start: 900, end: 1200 },
            { start: 2000, end: 2359 }
          ]
        };

        modifiedPlaceResult.hours.monday = [
          { start: '0000', end: '0600' },
          { start: '0900', end: '1800' },
          { start: '2015', end: '2359' }
        ];
        modifiedPlaceResult.hours.thursday = [
          { start: '0900', end: '1200' },
          { start: '2000', end: '2359' }
        ];

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.hours).toStrictEqual(modifiedPlaceResult.hours);
      });

      it('if the place has empty timeslots, all should be present', () => {
        modifiedPlace.newhours.monday = {
          open: true,
          timeslot: []
        };
        modifiedPlace.newhours.thursday = {
          open: true,
          timeslot: []
        };

        modifiedPlaceResult.hours.monday = [];
        modifiedPlaceResult.hours.thursday = [];

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.hours).toStrictEqual(modifiedPlaceResult.hours);
      });
    });

    describe('Determination of the address', () => {
      it("should be the address when it's not on orientation", () => {
        const result = buildPlaceDetails(samplePlace, category, lang);
        expect(result.address).toStrictEqual(samplePlaceTransformed.address);
      });

      it("should be the postal code and the city when it's on orientation", () => {
        modifiedPlace.modalities.orientation.checked = true;
        modifiedPlace.modalities.inconditionnel = false;

        modifiedPlaceResult.address = `${modifiedPlace.position.postalCode}, ${modifiedPlace.position.city}`;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.address).toStrictEqual(modifiedPlaceResult.address);
      });

      it('should be the address and the additionnal info if there is some', () => {
        modifiedPlace.position.additionalInformation = '3e porte sur la droite';

        modifiedPlaceResult.address = `${modifiedPlace.position.address} - ${modifiedPlace.position.additionalInformation}`;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.address).toStrictEqual(modifiedPlaceResult.address);
      });
    });
  });

  describe('Determination of the place info', () => {
    const STANDARD_INFO_INDEX = {
      publics: 0,
      morePrecisionsPublics: 1,
      modalitiesDefault: 1,
      modalitiesOrientation: 1,
      modalitiesAppointment: 2,
      modalitiesInscription: 3,
      morePrecisionsModalities: 2,
      modalitiesPrice: 2,
      modalitiesDisabled: 3,
      modalitiesAnimals: 4,
      spokenLanguages: 2,
      specificServices: 3
    };

    describe('Determination of the publics', () => {
      describe('Determination of the welcome type', () => {
        it('should be correct for unconditional welcome', () => {
          modifiedPlace.publics.accueil = WelcomedPublics.UNCONDITIONAL;
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].type =
            PlaceDetailsInfoType.WELCOME_UNCONDITIONAL;

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Unconditional welcome</b>'
          );
        });

        it('should be correct for preferential welcome', () => {
          modifiedPlace.publics.accueil = WelcomedPublics.PREFERENTIAL;
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].type =
            PlaceDetailsInfoType.WELCOME_UNCONDITIONAL_CUSTOM;

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Unconditional welcome adapted to </b>.'
          );
        });

        it('should be correct for exclusive welcome', () => {
          modifiedPlace.publics.accueil = WelcomedPublics.EXCLUSIVE;
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].type =
            PlaceDetailsInfoType.WELCOME_EXCLUSIVE;

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>.'
          );
        });
      });

      it('should add the publics specification only if there is some', () => {
        modifiedPlace.publics.accueil = WelcomedPublics.EXCLUSIVE;
        modifiedPlace.publics.gender = [PublicsGender.women];
        modifiedPlace.publics.other = [PublicsOther.violence, PublicsOther.lgbt];

        modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].type =
          PlaceDetailsInfoType.WELCOME_EXCLUSIVE;
        modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
          { key: PUBLICS_LABELS.gender[PublicsGender.women].toUpperCase() },
          { key: PUBLICS_LABELS.other[PublicsOther.violence]!.toUpperCase() },
          { key: PUBLICS_LABELS.other[PublicsOther.lgbt]!.toUpperCase() }
        ];

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
          '<b>Exclusive welcome: </b>women, victim of violence, lgbt+.'
        );
      });

      describe('Determination of the age value', () => {
        beforeEach(() => {
          modifiedPlace.publics.accueil = WelcomedPublics.EXCLUSIVE;
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].type =
            PlaceDetailsInfoType.WELCOME_EXCLUSIVE;
        });

        it("shouldn't setup age if age is between 0 and 99", () => {
          modifiedPlace.publics.age = { min: 0, max: 99 };

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>.'
          );
        });

        it('should setup age with specific key if the min is 0 and max is not 99', () => {
          modifiedPlace.publics.age = { min: 0, max: 76 };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
            { key: 'PUBLICS_AGE_TO_XX_MAX', params: { max: '76' } }
          ];

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>people up to 76 years old.'
          );
        });

        it('should setup age with specific key if the min is not 0 and max is 99', () => {
          modifiedPlace.publics.age = { min: 12, max: 99 };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
            { key: 'PUBLICS_AGE_FROM_XX', params: { min: '12' } }
          ];

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>people at least 12 years old.'
          );
        });

        it('should setup age with specific key if the min is 0 and max is 18', () => {
          modifiedPlace.publics.age = { min: 0, max: 18 };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
            { key: 'PUBLICS_AGE_MINORS' }
          ];

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>minors (under 18).'
          );
        });

        it('should setup age with specific key if the min is 18 and max is 99', () => {
          modifiedPlace.publics.age = { min: 18, max: 99 };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
            { key: 'PUBLICS_AGE_MAJORS' }
          ];

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>adults.'
          );
        });

        it('should setup age with specific key in any other case', () => {
          modifiedPlace.publics.age = { min: 12, max: 76 };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.publics].description = [
            { key: 'PUBLICS_AGE_RANGE', params: { min: '12', max: '76' } }
          ];

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.publics].translatedText).toStrictEqual(
            '<b>Exclusive welcome: </b>people aged from 12 to 76 years.'
          );
        });
      });

      it('should add the precisions for publics if there is some', () => {
        modifiedPlace.publics.description = 'We have many other specific publics';
        modifiedPlaceResult.info[STANDARD_INFO_INDEX.morePrecisionsPublics] = {
          type: PlaceDetailsInfoType.PUBLICS_MORE_INFO,
          tags: [],
          needTranslation: false,
          description: [{ key: 'We have many other specific publics' }]
        };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(
          result.info[STANDARD_INFO_INDEX.morePrecisionsPublics].translatedText
        ).toBeUndefined();
      });
    });

    describe('Determination of the modalities', () => {
      describe('Determination of the modalities type and description', () => {
        it('should be the correct key when the modalities is unconditionnal', () => {
          modifiedPlace.modalities.inconditionnel = true;

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault].type =
            PlaceDetailsInfoType.ACCESS_FREE;

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );
        });

        it('should be the correct key when the modalities is orientation with or without precision', () => {
          modifiedPlace.modalities.inconditionnel = false;
          modifiedPlace.modalities.orientation = { checked: true, precisions: null };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault] = {
            type: PlaceDetailsInfoType.ACCESS_ORIENTATION,
            description: [],
            tags: [],
            needTranslation: true
          };

          let result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );

          modifiedPlace.modalities.orientation.precisions = 'test orientation';

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault].description = [
            { key: 'test orientation' }
          ];

          result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );
        });

        it('should be the correct key when the modalities is inscription', () => {
          modifiedPlace.modalities.inconditionnel = false;
          modifiedPlace.modalities.inscription = { checked: true, precisions: null };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault] = {
            type: PlaceDetailsInfoType.REGISTRATION,
            description: [],
            tags: [],
            needTranslation: true
          };

          let result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );

          modifiedPlace.modalities.inscription.precisions = 'test inscription';
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault].description = [
            { key: 'test inscription' }
          ];

          result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );
        });

        it('should be the correct key when the modalities is appointment', () => {
          modifiedPlace.modalities.inconditionnel = false;
          modifiedPlace.modalities.appointment = { checked: true, precisions: null };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault] = {
            type: PlaceDetailsInfoType.APPOINTMENT,
            description: [],
            tags: [],
            needTranslation: true
          };

          let result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );

          modifiedPlace.modalities.appointment.precisions = 'test appointment';
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault].description = [
            { key: 'test appointment' }
          ];

          result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDefault]
          );
        });

        it('should be the correct keys in the correct order when the modalities are cumulated', () => {
          modifiedPlace.modalities.inconditionnel = false;
          modifiedPlace.modalities.orientation = { checked: true, precisions: null };
          modifiedPlace.modalities.inscription = { checked: true, precisions: null };
          modifiedPlace.modalities.appointment = { checked: true, precisions: null };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesOrientation] = {
            type: PlaceDetailsInfoType.ACCESS_ORIENTATION,
            description: [],
            tags: [],
            needTranslation: true
          };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesInscription] = {
            type: PlaceDetailsInfoType.REGISTRATION,
            description: [],
            tags: [],
            needTranslation: true
          };
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesAppointment] = {
            type: PlaceDetailsInfoType.APPOINTMENT,
            description: [],
            tags: [],
            needTranslation: true
          };

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesOrientation]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesOrientation]
          );
          expect(result.info[STANDARD_INFO_INDEX.modalitiesInscription]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesInscription]
          );
          expect(result.info[STANDARD_INFO_INDEX.modalitiesAppointment]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesAppointment]
          );
        });
      });

      it('should add the precisions for modalities if there is some', () => {
        modifiedPlace.modalities.other = 'some precisions';
        modifiedPlaceResult.info[STANDARD_INFO_INDEX.morePrecisionsModalities] = {
          type: PlaceDetailsInfoType.MODALITIES_MORE_INFO,
          description: [{ key: 'some precisions' }],
          tags: [],
          needTranslation: true
        };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.info[STANDARD_INFO_INDEX.morePrecisionsModalities]).toStrictEqual(
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.morePrecisionsModalities]
        );
      });

      describe('Determination of the specific access modalities', () => {
        it('should add the price, disabled and animals precisions if there is some', () => {
          modifiedPlace.modalities.price = { checked: true, precisions: 'price precisions' };
          modifiedPlace.modalities.animal = { checked: true };
          modifiedPlace.modalities.pmr = { checked: true };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesPrice] = {
            type: PlaceDetailsInfoType.PRICE,
            tags: [],
            description: [{ key: 'price precisions' }],
            needTranslation: true
          };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesAnimals] = {
            type: PlaceDetailsInfoType.ANIMALS,
            tags: [],
            description: [],
            needTranslation: true
          };

          modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDisabled] = {
            type: PlaceDetailsInfoType.PMR,
            tags: [],
            description: [],
            needTranslation: true
          };

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.info[STANDARD_INFO_INDEX.modalitiesPrice]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesPrice]
          );

          expect(result.info[STANDARD_INFO_INDEX.modalitiesAnimals]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesAnimals]
          );

          expect(result.info[STANDARD_INFO_INDEX.modalitiesDisabled]).toStrictEqual(
            modifiedPlaceResult.info[STANDARD_INFO_INDEX.modalitiesDisabled]
          );
        });
      });
    });

    describe('Determination of the spoken languages', () => {
      it('should be empty if there is no languages', () => {
        modifiedPlace.languages = [];

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.info[STANDARD_INFO_INDEX.spokenLanguages]).toBeUndefined();
      });

      it('should be correctly set with the good keys', () => {
        modifiedPlace.languages = ['es', 'fr', 'en', 'lsf'];

        modifiedPlaceResult.info[STANDARD_INFO_INDEX.spokenLanguages] = {
          type: PlaceDetailsInfoType.LANGUAGES_SPOKEN,
          tags: [],
          description: [
            { key: 'LANGUE_ES' },
            { key: 'LANGUE_FR' },
            { key: 'LANGUE_EN' },
            { key: 'LANGUE_LSF' }
          ],
          needTranslation: true
        };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.info[STANDARD_INFO_INDEX.spokenLanguages]).toStrictEqual(
          modifiedPlaceResult.info[STANDARD_INFO_INDEX.spokenLanguages]
        );
      });
    });
  });

  describe('Determination of the services', () => {
    it('should have the correct category name', () => {
      modifiedPlace.services_all[0].category = Categories.FOOD_DISTRIBUTION;
      modifiedPlace.services_all[1].category = Categories.DAY_HOSTING;
      modifiedPlace.services_all[2].category = Categories.ADDICTION;

      modifiedPlaceResult.services[0].category = Categories.FOOD_DISTRIBUTION;
      modifiedPlaceResult.services[1].category = Categories.DAY_HOSTING;
      modifiedPlaceResult.services[2].category = Categories.ADDICTION;

      const result = buildPlaceDetails(modifiedPlace, category, lang);
      expect(result.services).toStrictEqual(modifiedPlaceResult.services);
    });

    describe('Determination of the saturation', () => {
      it("should be empty if the services aren't saturated", () => {
        // eslint-disable-next-line camelcase
        modifiedPlace.services_all = modifiedPlace.services_all.map((service) => {
          service.saturated = { status: ServiceSaturation.LOW, precision: null };
          return service;
        });

        modifiedPlaceResult.services = modifiedPlaceResult.services.map((service) => {
          // eslint-disable-next-line fp/no-delete
          delete service.saturation;
          return service;
        });

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.services).toStrictEqual(modifiedPlaceResult.services);
      });

      it('should be the correct value and variant according to saturation', () => {
        modifiedPlace.services_all[0].saturated.status = ServiceSaturation.HIGH;
        modifiedPlace.services_all[1].saturated.status = ServiceSaturation.LOW;
        modifiedPlace.services_all[2].saturated.status = ServiceSaturation.MODERATE;

        modifiedPlaceResult.services[0].saturation = {
          tag: {
            value: `SATURATION_${ServiceSaturation.HIGH}`,
            variant: 'error'
          }
        };
        modifiedPlaceResult.services[2].saturation = {
          tag: {
            value: `SATURATION_${ServiceSaturation.MODERATE}`,
            variant: 'warning'
          }
        };
        // eslint-disable-next-line fp/no-delete
        delete modifiedPlaceResult.services[1].saturation;

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.services).toStrictEqual(modifiedPlaceResult.services);
      });
    });

    it('should get the correct description', () => {
      modifiedPlace.services_all[0].description =
        'OMG is this the description of the first service';
      modifiedPlace.services_all[1].description =
        "I can't believe how great of an adventure it is with this second service";
      modifiedPlace.services_all[2].description = "Oh non it's the last service, goodbye!";

      modifiedPlaceResult.services[0].description =
        'OMG is this the description of the first service';
      modifiedPlaceResult.services[1].description =
        "I can't believe how great of an adventure it is with this second service";
      modifiedPlaceResult.services[2].description = "Oh non it's the last service, goodbye!";

      const result = buildPlaceDetails(modifiedPlace, category, lang);
      expect(result.services).toStrictEqual(modifiedPlaceResult.services);
    });

    describe('Determination of service opening hours', () => {
      beforeEach(() => {
        modifiedPlace.services_all[1].differentHours = true;
      });

      it('if the service has multiple timeslots, all should be present and empty days should be removed', () => {
        modifiedPlace.services_all[1].hours.monday = {
          open: true,
          timeslot: [
            { start: 0, end: 600 },
            { start: 900, end: 1800 },
            { start: 2015, end: 2359 }
          ]
        };
        modifiedPlace.services_all[1].hours.thursday = {
          open: true,
          timeslot: [
            { start: 900, end: 1200 },
            { start: 2000, end: 2359 }
          ]
        };

        modifiedPlace.services_all[1].hours.tuesday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.wednesday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.friday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.saturday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.sunday = { open: false, timeslot: [] };

        modifiedPlaceResult.services[1].hours = {
          monday: [
            { start: '0000', end: '0600' },
            { start: '0900', end: '1800' },
            { start: '2015', end: '2359' }
          ],
          thursday: [
            { start: '0900', end: '1200' },
            { start: '2000', end: '2359' }
          ]
        };

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.services[1].hours).toStrictEqual(modifiedPlaceResult.services[1].hours);
      });

      it('if the service has no hours, it should be empty', () => {
        modifiedPlace.services_all[1].hours.monday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.tuesday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.wednesday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.thursday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.friday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.saturday = { open: false, timeslot: [] };
        modifiedPlace.services_all[1].hours.sunday = { open: false, timeslot: [] };

        modifiedPlaceResult.services[1].hours = {};

        const result = buildPlaceDetails(modifiedPlace, category, lang);
        expect(result.services[1].hours).toStrictEqual(modifiedPlaceResult.services[1].hours);
      });
    });

    describe('Determination of the service info', () => {
      const STANDARD_INFO_INDEX = {
        publics: 0,
        morePrecisionsPublics: 1,
        modalitiesDefault: 0,
        modalitiesOrientation: 0,
        modalitiesAppointment: 1,
        modalitiesInscription: 2,
        morePrecisionsModalities: 1,
        modalitiesPrice: 1,
        modalitiesDisabled: 2,
        modalitiesAnimals: 3
      };

      describe('Determination of the publics', () => {
        beforeEach(() => {
          modifiedPlace.services_all[1].differentPublics = true;
          modifiedPlaceResult.services[1].info = [
            {
              type: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL,
              description: [],
              tags: [],
              needTranslation: false,
              translatedText: '<b>Unconditional welcome</b>'
            }
          ];
        });

        describe('Determination of the welcome type', () => {
          it('should be correct for unconditional welcome', () => {
            modifiedPlace.services_all[1].publics.accueil = WelcomedPublics.UNCONDITIONAL;
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].type =
              PlaceDetailsInfoType.WELCOME_UNCONDITIONAL;

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Unconditional welcome</b>');
          });

          it('should be correct for preferential welcome', () => {
            modifiedPlace.services_all[1].publics.accueil = WelcomedPublics.PREFERENTIAL;
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].type =
              PlaceDetailsInfoType.WELCOME_UNCONDITIONAL_CUSTOM;

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Unconditional welcome adapted to </b>.');
          });

          it('should be correct for exclusive welcome', () => {
            modifiedPlace.services_all[1].publics.accueil = WelcomedPublics.EXCLUSIVE;
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].type =
              PlaceDetailsInfoType.WELCOME_EXCLUSIVE;

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>.');
          });
        });

        it('should add the publics specification only if there is some', () => {
          modifiedPlace.services_all[1].publics.accueil = WelcomedPublics.EXCLUSIVE;
          modifiedPlace.services_all[1].publics.gender = [PublicsGender.women];
          modifiedPlace.services_all[1].publics.other = [PublicsOther.violence, PublicsOther.lgbt];

          modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].type =
            PlaceDetailsInfoType.WELCOME_EXCLUSIVE;
          modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].translatedText =
            '<b>Exclusive welcome: </b>women, victim of violence, lgbt+.';

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(result.services[1].info[STANDARD_INFO_INDEX.publics]).toStrictEqual(
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics]
          );
        });

        describe('Determination of the age value', () => {
          beforeEach(() => {
            modifiedPlace.services_all[1].publics.accueil = WelcomedPublics.EXCLUSIVE;
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].type =
              PlaceDetailsInfoType.WELCOME_EXCLUSIVE;
          });

          it("shouldn't setup age if age is between 0 and 99", () => {
            modifiedPlace.services_all[1].publics.age = { min: 0, max: 99 };

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>.');
          });

          it('should setup age with specific key if the min is 0 and max is not 99', () => {
            modifiedPlace.services_all[1].publics.age = { min: 0, max: 76 };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].description = [
              { key: 'PUBLICS_AGE_TO_XX_MAX', params: { max: '76' } }
            ];

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>people up to 76 years old.');
          });

          it('should setup age with specific key if the min is not 0 and max is 99', () => {
            modifiedPlace.services_all[1].publics.age = { min: 12, max: 99 };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].description = [
              { key: 'PUBLICS_AGE_FROM_XX', params: { min: '12' } }
            ];

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>people at least 12 years old.');
          });

          it('should setup age with specific key if the min is 0 and max is 18', () => {
            modifiedPlace.services_all[1].publics.age = { min: 0, max: 18 };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].description = [
              { key: 'PUBLICS_AGE_MINORS' }
            ];

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>minors (under 18).');
          });

          it('should setup age with specific key if the min is 18 and max is 99', () => {
            modifiedPlace.services_all[1].publics.age = { min: 18, max: 99 };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].description = [
              { key: 'PUBLICS_AGE_MAJORS' }
            ];

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>adults.');
          });

          it('should setup age with specific key in any other case', () => {
            modifiedPlace.services_all[1].publics.age = { min: 12, max: 76 };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.publics].description = [
              { key: 'PUBLICS_AGE_RANGE', params: { min: '12', max: '76' } }
            ];

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.publics].translatedText
            ).toStrictEqual('<b>Exclusive welcome: </b>people aged from 12 to 76 years.');
          });
        });

        it('should add the precisions for publics if there is some', () => {
          modifiedPlace.services_all[1].publics.description = 'We have many other specific publics';

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(
            result.services[1].info[STANDARD_INFO_INDEX.morePrecisionsPublics].description[0].key
          ).toStrictEqual('We have many other specific publics');
        });
      });

      describe('Determination of the modalities', () => {
        beforeEach(() => {
          modifiedPlace.services_all[1].differentModalities = true;
          modifiedPlaceResult.services[1].info = [
            {
              type: PlaceDetailsInfoType.ACCESS_FREE,
              description: [],
              tags: [],
              needTranslation: true
            }
          ];
        });

        describe('Determination of the modalities type and description', () => {
          it('should be the correct key when the modalities is unconditionnal', () => {
            modifiedPlace.services_all[1].modalities.inconditionnel = true;

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault].type =
              PlaceDetailsInfoType.ACCESS_FREE;

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );
          });

          it('should be the correct key when the modalities is orientation with or without precision', () => {
            modifiedPlace.services_all[1].modalities.inconditionnel = false;
            modifiedPlace.services_all[1].modalities.orientation = {
              checked: true,
              precisions: null
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault] = {
              type: PlaceDetailsInfoType.ACCESS_ORIENTATION,
              description: [],
              tags: [],
              needTranslation: true
            };

            let result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );

            modifiedPlace.services_all[1].modalities.orientation.precisions = 'test orientation';

            modifiedPlaceResult.services[1].info[
              STANDARD_INFO_INDEX.modalitiesDefault
            ].description = [{ key: 'test orientation' }];

            result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );
          });

          it('should be the correct key when the modalities is inscription', () => {
            modifiedPlace.services_all[1].modalities.inconditionnel = false;
            modifiedPlace.services_all[1].modalities.inscription = {
              checked: true,
              precisions: null
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault] = {
              type: PlaceDetailsInfoType.REGISTRATION,
              description: [],
              tags: [],
              needTranslation: true
            };

            let result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );

            modifiedPlace.services_all[1].modalities.inscription.precisions = 'test inscription';
            modifiedPlaceResult.services[1].info[
              STANDARD_INFO_INDEX.modalitiesDefault
            ].description = [{ key: 'test inscription' }];

            result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );
          });

          it('should be the correct key when the modalities is appointment', () => {
            modifiedPlace.services_all[1].modalities.inconditionnel = false;
            modifiedPlace.services_all[1].modalities.appointment = {
              checked: true,
              precisions: null
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault] = {
              type: PlaceDetailsInfoType.APPOINTMENT,
              description: [],
              tags: [],
              needTranslation: true
            };

            let result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );

            modifiedPlace.services_all[1].modalities.appointment.precisions = 'test appointment';
            modifiedPlaceResult.services[1].info[
              STANDARD_INFO_INDEX.modalitiesDefault
            ].description = [{ key: 'test appointment' }];

            result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDefault]
            );
          });

          it('should be the correct keys in the correct order when the modalities are cumulated', () => {
            modifiedPlace.services_all[1].modalities.inconditionnel = false;
            modifiedPlace.services_all[1].modalities.orientation = {
              checked: true,
              precisions: null
            };
            modifiedPlace.services_all[1].modalities.inscription = {
              checked: true,
              precisions: null
            };
            modifiedPlace.services_all[1].modalities.appointment = {
              checked: true,
              precisions: null
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesOrientation] = {
              type: PlaceDetailsInfoType.ACCESS_ORIENTATION,
              description: [],
              tags: [],
              needTranslation: true
            };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesInscription] = {
              type: PlaceDetailsInfoType.REGISTRATION,
              description: [],
              tags: [],
              needTranslation: true
            };
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesAppointment] = {
              type: PlaceDetailsInfoType.APPOINTMENT,
              description: [],
              tags: [],
              needTranslation: true
            };

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.modalitiesOrientation]
            ).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesOrientation]
            );
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.modalitiesInscription]
            ).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesInscription]
            );
            expect(
              result.services[1].info[STANDARD_INFO_INDEX.modalitiesAppointment]
            ).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesAppointment]
            );
          });
        });

        it('should add the precisions for modalities if there is some', () => {
          modifiedPlace.services_all[1].modalities.other = 'some precisions';
          modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.morePrecisionsModalities] = {
            type: PlaceDetailsInfoType.MODALITIES_MORE_INFO,
            description: [{ key: 'some precisions' }],
            tags: [],
            needTranslation: true
          };

          const result = buildPlaceDetails(modifiedPlace, category, lang);
          expect(
            result.services[1].info[STANDARD_INFO_INDEX.morePrecisionsModalities]
          ).toStrictEqual(
            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.morePrecisionsModalities]
          );
        });

        describe('Determination of the specific access modalities', () => {
          it('should add the price, disabled and animals precisions if there is some', () => {
            modifiedPlace.services_all[1].modalities.price = {
              checked: true,
              precisions: 'price precisions'
            };
            modifiedPlace.services_all[1].modalities.animal = { checked: true };
            modifiedPlace.services_all[1].modalities.pmr = { checked: true };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesPrice] = {
              type: PlaceDetailsInfoType.PRICE,
              tags: [],
              needTranslation: true,
              description: [{ key: 'price precisions' }]
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesAnimals] = {
              type: PlaceDetailsInfoType.ANIMALS,
              tags: [],
              needTranslation: true,
              description: []
            };

            modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDisabled] = {
              type: PlaceDetailsInfoType.PMR,
              tags: [],
              needTranslation: true,
              description: []
            };

            const result = buildPlaceDetails(modifiedPlace, category, lang);
            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesPrice]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesPrice]
            );

            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesAnimals]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesAnimals]
            );

            expect(result.services[1].info[STANDARD_INFO_INDEX.modalitiesDisabled]).toStrictEqual(
              modifiedPlaceResult.services[1].info[STANDARD_INFO_INDEX.modalitiesDisabled]
            );
          });
        });
      });
    });
  });
});
