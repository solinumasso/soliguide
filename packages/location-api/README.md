<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

![Logo](https://soliguide.fr/assets/images/logo.png)

# Location API

## Features

This API offers all the tools necessary to obtain information on an address.

| Country | Autocomplete | Geocoding |
| ------- | ------------ | --------- |
| France  | ✅           | ✅        |
| Spain   | 🚧           | 🚧        |
| Andorra | 🚧           | 🚧        |
| Belgium | 🚧           | 🚧        |

### What data does the API offer?

The data provided is divided into several administrative layers

- Countries: France, Spain, Belgium, etc.
- Regions: (regions in France and Belgium, autonomy in Spain)
- Departments: in France we speak of departments, in Belgium and Spain of “provinces”
- Addresses and points of interest (POI)
  - A POI is a point element representing a notable place from any point of view, often a possible destination. Example: Stations, stadiums, parks, etc.

## France

We use different governement APIs

- https://geo.api.gouv.fr/decoupage-administratif/regions
- https://geo.api.gouv.fr/decoupage-administratif/departements
- [IGN Geocodage](https://geoservices.ign.fr/documentation/services/api-et-services-ogc/geocodage-20/doc-technique-api-geocodage)
  - Try it: [OpenApi](https://data.geopf.fr/geocodage/openapi)

## Tech Stack

**Server:** NestJS, Express

## Running server in dev mode

```bash
yarn start:dev
```

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

## Annual Maintenance Tasks

### Holiday Data Generation

**IMPORTANT**: The holiday data needs to be regenerated annually to ensure accurate holiday information for the current year.

**Command:**
```bash
yarn generate:holidays-file
```
**When to run:**
- At the beginning of each calendar year (January)
- Whenever holiday definitions change for supported countries

**What it does:**
This command generates and updates the holiday calendar data used by the location API to provide accurate holiday information for various regions and countries.
