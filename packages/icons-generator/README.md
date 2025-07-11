<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2025 Solinum

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

### Create icon font from png files

## Steps

- Name your icons files with the css name you want them to have (id category)
- Add your icons files (JPG !) to the icons folder at the root of the project
- If your icon is a PNG file, convert it to JPG
- open terminal
- run `cd path/to/folder`
- run `yarn install`
- run `yarn start`
- Copy fonts/categories-icons.ttf to soliguide projects assets/fonts/icons/categories-icons.ttf
- Copy fonts/categories-icons.woff2 to soliguide projects assets/fonts/icons/categories-icons.woff2
- Copy fonts/categories-icons.woff to soliguide projects assets/fonts/icons/categories-icons.woff
- Edit fonts/categories-icons.scss to add good path for fonts : "../fonts/icons/categories-icons.ttf" instead of "../fonts/icons/icons.ttf"
- Copy fonts/categories-icons.scss to soliguide projects assets/css/categories-icons.scss
