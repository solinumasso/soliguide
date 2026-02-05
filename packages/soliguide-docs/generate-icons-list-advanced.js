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

// Map categories to their themes (based on Categories enum)
const CATEGORY_THEMES = {
  'Santé': [
    'health', 'addiction', 'std_testing', 'psychological_support', 'child_care',
    'general_practitioner', 'dental_care', 'pregnancy_care', 'vaccination', 'infirmary',
    'vet_care', 'health_specialists', 'allergology', 'cardiology', 'dermatology',
    'echography', 'endocrinology', 'gastroenterology', 'gynecology', 'kinesitherapy',
    'mammography', 'ophthalmology', 'otorhinolaryngology', 'nutrition', 'pedicure',
    'phlebology', 'pneumology', 'radiology', 'rheumatology', 'urology',
    'speech_therapy', 'stomatology', 'osteopathy', 'acupuncture'
  ],
  'Mobilité': [
    'mobility', 'carpooling', 'provision_of_vehicles', 'chauffeur_driven_transport',
    'mobility_assistance'
  ],
  'Formation et emploi': [
    'training_and_jobs', 'digital_tools_training', 'french_course', 'catalan_course',
    'spanish_course', 'job_coaching', 'integration_through_economic_activity', 'tutoring'
  ],
  'Hygiène et bien-être': [
    'hygiene_and_wellness', 'shower', 'laundry', 'wellness', 'toilets',
    'hygiene_products', 'face_masks', 'hairdresser'
  ],
  'Accompagnement': [
    'counseling', 'legal_advice', 'domiciliation', 'social_accompaniment',
    'public_writer', 'disability_advice', 'administrative_assistance',
    'parent_assistance', 'budget_advice', 'legal_protection'
  ],
  'Technologie': [
    'technology', 'computers_at_your_disposal', 'wifi', 'electrical_outlets_available',
    'telephone_at_your_disposal', 'digital_safe'
  ],
  'Alimentation': [
    'food', 'food_distribution', 'food_packages', 'social_grocery_stores',
    'fountain', 'solidarity_fridge', 'shared_kitchen', 'cooking_workshop',
    'baby_parcel', 'food_voucher', 'community_garden'
  ],
  'Accueil': [
    'welcome', 'day_hosting', 'rest_area', 'babysitting', 'family_area',
    'information_point'
  ],
  'Activités': [
    'activities', 'sport_activities', 'museums', 'libraries', 'other_activities'
  ],
  'Équipement': [
    'equipment', 'luggage_storage', 'solidarity_store', 'clothing'
  ],
  'Logement': [
    'accomodation_and_housing', 'overnight_stop', 'emergency_accommodation',
    'long_term_accomodation', 'citizen_housing', 'access_to_housing'
  ],
  'Animaux': [
    'animal_assitance'
  ]
}

try {
  // Read all files in the icons directory
  const files = fs.readdirSync(iconsDir)

  // Filter only SVG files (exclude .license files)
  const svgFiles = files.filter(
    (file) => file.endsWith('.svg') && !file.endsWith('.svg.license')
  )

  // Group icons by theme
  const iconsByTheme = {}
  const unmapped = []

  svgFiles.forEach(file => {
    const filename = file.replace('.svg', '').replace('_outlined', '')
    let found = false

    for (const [theme, categories] of Object.entries(CATEGORY_THEMES)) {
      if (categories.includes(filename)) {
        if (!iconsByTheme[theme]) {
          iconsByTheme[theme] = []
        }
        iconsByTheme[theme].push(file)
        found = true
        break
      }
    }

    if (!found) {
      unmapped.push(file)
    }
  })

  // Add unmapped icons to "Autres" category
  if (unmapped.length > 0) {
    iconsByTheme['Autres'] = unmapped
  }

  // Sort icons within each theme
  for (const theme in iconsByTheme) {
    iconsByTheme[theme].sort()
  }

  // Write to JSON file
  const output = {
    themes: iconsByTheme,
    total: svgFiles.length,
    mappedCount: svgFiles.length - unmapped.length,
    unmappedCount: unmapped.length
  }

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))

  console.log(`✅ Generated icons-list.json with ${svgFiles.length} icons`)
  console.log(`   📁 ${Object.keys(iconsByTheme).length} themes`)
  console.log(`   ✓ ${output.mappedCount} mapped icons`)
  if (output.unmappedCount > 0) {
    console.log(`   ⚠️  ${output.unmappedCount} unmapped icons`)
  }
} catch (error) {
  console.error('❌ Error generating icons list:', error.message)
  process.exit(1)
}
