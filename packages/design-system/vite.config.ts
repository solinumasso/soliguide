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
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    legacy({
      modernPolyfills: true,
      // Two outputs not supported by sveltekit
      // see https://github.com/sveltejs/kit/issues/9515#issuecomment-2081152895
      renderLegacyChunks: false
    })
  ],
  test: {
    include: ['src/**/*.spec.ts']
  }
});
