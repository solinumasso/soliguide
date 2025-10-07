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
import { FrenchAddress } from "../sources/FR/interfaces/FrenchAddress.interface";

export type Example = {
  input: string[];
  expectedOutput: FrenchAddress["label"][];
  coordinates?: { latitude: number; longitude: number };
};

export const BOROUGH_FR_MOCK: {
  paris: Record<string, Example>;
  marseille: Record<string, Example>;
  lyon: Record<string, Example>;
} = {
  paris: {
    "75001": {
      input: ["75001", "paris-75001", "Paris%20(75001)"],
      expectedOutput: ["Paris", "Paris 1er Arrondissement", "Paris (75001)"],
    },
    "75002": {
      input: ["75002", "paris-75002", "Paris%202e%20Arrondissement"],
      expectedOutput: ["Paris 2e Arrondissement"],
    },
    "75003": {
      input: ["75003", "paris-75003", "Paris%203e%20Arrondissement"],
      expectedOutput: ["Paris 3e Arrondissement"],
    },
    "75004": {
      input: ["75004", "paris-75004", "Paris%204e%20Arrondissement"],
      expectedOutput: ["Paris 4e Arrondissement"],
    },
    "75005": {
      input: ["75005", "paris-75005", "Paris%205e%20Arrondissement"],
      expectedOutput: ["Paris 5e Arrondissement"],
    },
    "75006": {
      input: ["75006", "paris-75006", "Paris%206e%20Arrondissement"],
      expectedOutput: ["Paris 6e Arrondissement"],
    },
    "75007": {
      input: ["75007", "paris-75007", "Paris%207e%20Arrondissement"],
      expectedOutput: ["Paris 7e Arrondissement"],
    },
    "75008": {
      input: ["75008", "paris-75008", "Paris%208e%20Arrondissement"],
      expectedOutput: ["Paris 8e Arrondissement"],
    },
    "75009": {
      input: ["75009", "paris-75009", "Paris%209e%20Arrondissement"],
      expectedOutput: ["Paris 9e Arrondissement"],
    },
    "75010": {
      input: ["75010", "paris-75010", "Paris%2010e%20Arrondissement"],
      expectedOutput: ["Paris 10e Arrondissement"],
    },
    // 75011-paris doesn't work only for this district in Paris
    "75011": {
      input: ["75011", "Paris%2011e%20Arrondissement"],
      expectedOutput: ["Paris 11e Arrondissement"],
    },
    "75012": {
      input: ["75012", "paris-75012", "Paris%2012e%20Arrondissement"],
      expectedOutput: ["Paris 12e Arrondissement"],
    },
    "75013": {
      input: ["75013", "paris-75013", "Paris%2013e%20Arrondissement"],
      expectedOutput: ["Paris 13e Arrondissement"],
    },
    "75014": {
      input: ["75014", "paris-75014", "Paris%2014e%20Arrondissement"],
      expectedOutput: ["Paris 14e Arrondissement"],
    },
    "75015": {
      input: ["75015", "paris-75015", "Paris%2015e%20Arrondissement"],
      expectedOutput: ["Paris 15e Arrondissement"],
    },
    "75016": {
      input: ["75016", "paris-75016", "Paris%2016e%20Arrondissement"],
      expectedOutput: ["Paris 16e Arrondissement"],
    },
    "75017": {
      input: ["75017", "paris-75017", "Paris%2017e%20Arrondissement"],
      expectedOutput: ["Paris 17e Arrondissement"],
    },
    "75018": {
      input: ["75018", "paris-75018", "Paris%2018e%20Arrondissement"],
      expectedOutput: ["Paris 18e Arrondissement"],
    },
    "75019": {
      input: ["75019", "paris-75019", "Paris%2019e%20Arrondissement"],
      expectedOutput: ["Paris 19e Arrondissement"],
    },
    "75020": {
      input: ["75020", "paris-75020", "Paris%2020e%20Arrondissement"],
      expectedOutput: ["Paris 20e Arrondissement"],
    },
  },
  marseille: {
    "13001": {
      input: ["13001", "marseille-13001", "Marseille%20(13001)"],
      expectedOutput: [
        "Marseille",
        "Marseille 1er Arrondissement",
        "Marseille (13001)",
      ],
    },
    "13002": {
      input: ["13002", "marseille-13002", "Marseille%202e%20Arrondissement"],
      expectedOutput: ["Marseille 2e Arrondissement"],
    },
    "13003": {
      input: ["13003", "marseille-13003", "Marseille%203e%20Arrondissement"],
      expectedOutput: ["Marseille 3e Arrondissement"],
    },
    "13004": {
      input: ["13004", "marseille-13004", "Marseille%204e%20Arrondissement"],
      expectedOutput: ["Marseille 4e Arrondissement"],
    },
    "13005": {
      input: ["13005", "marseille-13005", "Marseille%205e%20Arrondissement"],
      expectedOutput: ["Marseille 5e Arrondissement"],
    },
    "13006": {
      input: ["13006", "marseille-13006", "Marseille%206e%20Arrondissement"],
      expectedOutput: ["Marseille 6e Arrondissement"],
    },
    "13007": {
      input: ["13007", "marseille-13007", "Marseille%207e%20Arrondissement"],
      expectedOutput: ["Marseille 7e Arrondissement"],
    },
    "13008": {
      input: ["13008", "marseille-13008", "Marseille%208e%20Arrondissement"],
      expectedOutput: ["Marseille 8e Arrondissement"],
    },
    "13009": {
      input: ["13009", "marseille-13009", "Marseille%209e%20Arrondissement"],
      expectedOutput: ["Marseille 9e Arrondissement"],
    },
    "13010": {
      input: ["13010", "marseille-13010", "Marseille%2010e%20Arrondissement"],
      expectedOutput: ["Marseille 10e Arrondissement"],
    },
    // 13011-marseille doesn't work only for this district in Marseille
    "13011": {
      input: ["13011", "Marseille%2011e%20Arrondissement"],
      expectedOutput: ["Marseille 11e Arrondissement"],
    },
    "13012": {
      input: ["13012", "marseille-13012", "Marseille%2012e%20Arrondissement"],
      expectedOutput: ["Marseille 12e Arrondissement"],
    },
    "13013": {
      input: ["13013", "marseille-13013", "Marseille%2013e%20Arrondissement"],
      expectedOutput: ["Marseille 13e Arrondissement"],
    },
    "13014": {
      input: ["13014", "marseille-13014", "Marseille%2014e%20Arrondissement"],
      expectedOutput: ["Marseille 14e Arrondissement"],
    },
    "13015": {
      input: ["13015", "marseille-13015", "Marseille%2015e%20Arrondissement"],
      expectedOutput: ["Marseille 15e Arrondissement"],
    },
    "13016": {
      input: ["13016", "marseille-13016", "Marseille%2016e%20Arrondissement"],
      expectedOutput: ["Marseille 16e Arrondissement"],
    },
  },
  lyon: {
    "69001": {
      input: ["69001", "lyon-69001", "Lyon%20(69001)"],
      expectedOutput: ["Lyon", "Lyon 1er Arrondissement", "Lyon (69001)"],
    },
    "69002": {
      input: ["69002", "lyon-69002", "Lyon%202e%20Arrondissement"],
      expectedOutput: ["Lyon 2e Arrondissement"],
    },
    "69003": {
      input: ["69003", "lyon-69003", "Lyon%203e%20Arrondissement"],
      expectedOutput: ["Lyon 3e Arrondissement"],
    },
    "69004": {
      input: ["69004", "lyon-69004", "Lyon%204e%20Arrondissement"],
      expectedOutput: ["Lyon 4e Arrondissement"],
    },
    "69005": {
      input: ["69005", "lyon-69005", "Lyon%205e%20Arrondissement"],
      expectedOutput: ["Lyon 5e Arrondissement"],
    },
    "69006": {
      input: ["69006", "lyon-69006", "Lyon%206e%20Arrondissement"],
      expectedOutput: ["Lyon 6e Arrondissement"],
    },
    "69007": {
      input: ["69007", "lyon-69007", "Lyon%207e%20Arrondissement"],
      expectedOutput: ["Lyon 7e Arrondissement"],
    },
    "69008": {
      input: ["69008", "lyon-69008", "Lyon%208e%20Arrondissement"],
      expectedOutput: ["Lyon 8e Arrondissement"],
    },
    "69009": {
      input: ["69009", "lyon-69009", "Lyon%209e%20Arrondissement"],
      expectedOutput: ["Lyon 9e Arrondissement"],
    },
  },
};
