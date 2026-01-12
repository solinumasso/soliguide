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

import { HereTransportStation } from "../interfaces/here-station.interface";

export const mockHereTransportStations = {
  onlyExcluded: (): HereTransportStation[] => [
    {
      place: {
        name: "Only BlaBla",
        type: "station",
        location: { lat: 48.8566, lng: 2.3522 },
        id: "here:pds:place:250u09kc-blabla",
      },
      transports: [
        {
          name: "BlaBlaCar Bus",
          mode: "bus",
          color: "#000000",
          textColor: "#ffffff",
          headsign: "XBC",
        },
        {
          name: "FlixBus Express",
          mode: "bus",
          color: "#73d700",
          textColor: "#ffffff",
          headsign: "FLX",
        },
      ],
    },
  ],

  mixedStation: (): HereTransportStation[] => [
    {
      place: {
        name: "Mixed Station",
        type: "station",
        location: { lat: 48.8584, lng: 2.2945 },
        id: "here:pds:place:250u09kc-mixed",
      },
      transports: [
        {
          name: "BlaBlaCar Bus",
          mode: "bus",
          color: "#000000",
          textColor: "#ffffff",
          headsign: "XBC",
        },
        {
          name: "Bus 170",
          mode: "bus",
          color: "#1a4ba0",
          textColor: "#ffffff",
          headsign: "170",
        },
        {
          name: "Metro 1",
          mode: "subway",
          color: "#ffce00",
          textColor: "#000000",
          headsign: "La Défense",
        },
      ],
    },
  ],

  allExcluded: (): HereTransportStation[] => [
    {
      place: {
        name: "Filtered Station",
        type: "station",
        location: { lat: 48.8738, lng: 2.295 },
        id: "here:pds:place:250u09kc-filtered",
      },
      transports: [
        {
          name: "FlixBus",
          mode: "bus",
          color: "#73d700",
          textColor: "#ffffff",
          headsign: "FX",
        },
        {
          name: "Ouibus",
          mode: "bus",
          color: "#0088ce",
          textColor: "#ffffff",
          headsign: "OU",
        },
        {
          name: "BlaBlaCar",
          mode: "bus",
          color: "#00aff5",
          textColor: "#ffffff",
          headsign: "BBC",
        },
        {
          name: "Bus 42",
          mode: "bus",
          color: "#dc9600",
          textColor: "#ffffff",
          headsign: "42",
        },
      ],
    },
  ],

  duplicateStations: (): HereTransportStation[] => [
    {
      place: {
        name: "Gare du Nord",
        type: "station",
        location: { lat: 48.8809, lng: 2.3553 },
        id: "here:pds:place:250u09kc-nord1",
      },
      transports: [
        {
          name: "RER B",
          mode: "cityTrain",
          color: "#5291ce",
          textColor: "#ffffff",
          headsign: "Aéroport CDG",
        },
        {
          name: "Metro 4",
          mode: "subway",
          color: "#a0006e",
          textColor: "#ffffff",
          headsign: "Mairie de Montrouge",
        },
      ],
    },
    {
      place: {
        name: "Gare du Nord",
        type: "station",
        location: { lat: 48.8809, lng: 2.3553 },
        id: "here:pds:place:250u09kc-nord2",
      },
      transports: [
        {
          name: "RER B",
          mode: "cityTrain",
          color: "#5291ce",
          textColor: "#ffffff",
          headsign: "Saint-Rémy-lès-Chevreuse",
        },
        {
          name: "Metro 5",
          mode: "subway",
          color: "#ff7e2e",
          textColor: "#ffffff",
          headsign: "Bobigny",
        },
      ],
    },
  ],

  multiModal: (): HereTransportStation[] => [
    {
      place: {
        name: "Châtelet-Les Halles",
        type: "station",
        location: { lat: 48.8622, lng: 2.347 },
        id: "here:pds:place:250u09kc-chatelet",
      },
      transports: [
        {
          name: "RER A",
          mode: "cityTrain",
          color: "#e2231a",
          textColor: "#ffffff",
          headsign: "Cergy",
        },
        {
          name: "RER B",
          mode: "cityTrain",
          color: "#5291ce",
          textColor: "#ffffff",
          headsign: "Robinson",
        },
        {
          name: "Metro 1",
          mode: "subway",
          color: "#ffce00",
          textColor: "#000000",
          headsign: "Château de Vincennes",
        },
        {
          name: "Metro 4",
          mode: "subway",
          color: "#a0006e",
          textColor: "#ffffff",
          headsign: "Bagneux",
        },
        {
          name: "Metro 7",
          mode: "subway",
          color: "#ff82b4",
          textColor: "#ffffff",
          headsign: "Villejuif",
        },
        {
          name: "Bus 29",
          mode: "bus",
          color: "#82c8e6",
          textColor: "#000000",
          headsign: "Gare Saint-Lazare",
        },
      ],
    },
  ],

  empty: (): HereTransportStation[] => [],

  nullTransports: (): HereTransportStation[] => [
    {
      place: {
        name: "Empty Station",
        type: "station",
        location: { lat: 48.8566, lng: 2.3522 },
        id: "here:pds:place:250u09kc-empty",
      },
      transports: undefined,
    },
  ],
};
