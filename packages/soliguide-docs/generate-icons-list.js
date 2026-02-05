#!/usr/bin/env node
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

const fs = require('fs')
const path = require('path')

const iconsDir = path.join(__dirname, '../icons-generator/icons/svg')
const outputFile = path.join(__dirname, 'icons-list.json')

try {
  // Read all files in the icons directory
  const files = fs.readdirSync(iconsDir)

  // Filter only SVG files (exclude .license files)
  const svgFiles = files.filter(
    (file) => file.endsWith('.svg') && !file.endsWith('.svg.license')
  )

  // Sort alphabetically
  svgFiles.sort()

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(svgFiles, null, 2))

  console.log(`✅ Generated icons-list.json with ${svgFiles.length} icons`)
} catch (error) {
  console.error('❌ Error generating icons list:', error.message)
  process.exit(1)
}
