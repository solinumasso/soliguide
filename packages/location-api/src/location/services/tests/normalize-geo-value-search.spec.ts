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

import { Test, TestingModule } from "@nestjs/testing";
import { FrenchAddressService } from "../french-address.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

describe("FrenchAddressService - normalizeGeoValueSearch", () => {
  let service: FrenchAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrenchAddressService,
        {
          provide: HttpService,
          useValue: {}, // Mock if needed for other tests
        },
        {
          provide: ConfigService,
          useValue: {}, // Mock if needed
        },
      ],
    }).compile();

    service = module.get<FrenchAddressService>(FrenchAddressService);
  });

  describe("Normal cases - special cities with postal code", () => {
    it('should normalize "paris 75012" to "75012 paris"', () => {
      expect(service.normalizeGeoValueSearch("paris 75012")).toBe(
        "75012 paris"
      );
    });

    it('should normalize "marseille 13001" to "13001 marseille"', () => {
      expect(service.normalizeGeoValueSearch("marseille 13001")).toBe(
        "13001 marseille"
      );
    });

    it('should normalize "lyon 69001" to "69001 lyon"', () => {
      expect(service.normalizeGeoValueSearch("lyon 69001")).toBe("69001 lyon");
    });

    it('should handle multiple spaces "paris  75012" to "75012 paris"', () => {
      expect(service.normalizeGeoValueSearch("paris  75012")).toBe(
        "75012 paris"
      );
    });
  });

  describe("Search must not be modified with those values", () => {
    it('should leave "saint martin 24001" unchanged', () => {
      expect(service.normalizeGeoValueSearch("saint martin 24001")).toBe(
        "saint martin 24001"
      );
    });

    it('should leave "nice 06000" unchanged', () => {
      expect(service.normalizeGeoValueSearch("nice 06000")).toBe("nice 06000");
    });

    it('should leave "town with space 75012" unchanged', () => {
      expect(service.normalizeGeoValueSearch("town with space 75012")).toBe(
        "town with space 75012"
      );
    });
  });

  describe("Cases without postal code or invalid format", () => {
    it('should leave "paris" unchanged (no postal code)', () => {
      expect(service.normalizeGeoValueSearch("paris")).toBe("paris");
    });

    it('should leave "75012" unchanged (no city)', () => {
      expect(service.normalizeGeoValueSearch("75012")).toBe("75012");
    });

    it('should leave "paris75012" unchanged (no space)', () => {
      expect(service.normalizeGeoValueSearch("paris75012")).toBe("paris75012");
    });

    it('should leave "paris 7501" unchanged (postal code too short)', () => {
      expect(service.normalizeGeoValueSearch("paris 7501")).toBe("paris 7501");
    });

    it('should leave "paris 750123" unchanged (postal code too long)', () => {
      expect(service.normalizeGeoValueSearch("paris 750123")).toBe(
        "paris 750123"
      );
    });

    it('should leave "paris abc12" unchanged (non-numeric postal code)', () => {
      expect(service.normalizeGeoValueSearch("paris abc12")).toBe(
        "paris abc12"
      );
    });
  });

  describe("Edge cases and weird inputs", () => {
    it('should leave "75012 paris" unchanged (already inverted)', () => {
      expect(service.normalizeGeoValueSearch("75012 paris")).toBe(
        "75012 paris"
      );
    });

    it('should leave "paris 75012 extra" unchanged (extra text)', () => {
      expect(service.normalizeGeoValueSearch("paris 75012 extra")).toBe(
        "paris 75012 extra"
      );
    });

    it('should leave "ville-75012" unchanged (hyphen instead of space)', () => {
      expect(service.normalizeGeoValueSearch("ville-75012")).toBe(
        "ville-75012"
      );
    });

    it('should leave "paris 75012, france" unchanged (comma)', () => {
      expect(service.normalizeGeoValueSearch("paris 75012, france")).toBe(
        "paris 75012, france"
      );
    });
  });
});
