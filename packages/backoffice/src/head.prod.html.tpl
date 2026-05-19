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
{{- /* Template for Caddy to replace dynamic bits of the <head> */ -}}
{{ define "head" }}
<meta name="robots" content="{{ env "SOLIGUIDE_FRONTEND_META_ROBOTS" }}" />
<meta name="viewport" content="initial-scale=1, maximum-scale=4" />
<meta name="description" content="{{ placeholder "soliguide_description" }}" />
<meta property="fb:app_id" content="1163084087233428" />
<meta property="og:type" content="website" />
<meta property="og:title" content="{{ placeholder "soliguide_title" }}" />
<meta property="og:url" content="/" />
<meta property="og:image" content="/images/social.jpg" />
<meta
  property="og:description"
  content="{{ placeholder "soliguide_description" }}"
/>
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@solinum_asso" />
<meta name="twitter:title" content="{{ placeholder "soliguide_title" }}" />
<meta
  name="twitter:description"
  content="{{ placeholder "soliguide_description" }}"
/>
<meta name="twitter:url" content="/" />
<meta name="twitter:image" content="/images/social.jpg" />

<link rel="icon" type="image/x-icon" href="assets/images/icons/favicon.ico" />
<link
  rel="apple-touch-icon"
  sizes="57x57"
  href="assets/images/icons/apple-icon-57x57.png"
/>
<link
  rel="apple-touch-icon"
  sizes="60x60"
  href="assets/images/icons/apple-icon-60x60.png"
/>
<link
  rel="apple-touch-icon"
  sizes="72x72"
  href="assets/images/icons/apple-icon-72x72.png"
/>
<link
  rel="apple-touch-icon"
  sizes="76x76"
  href="assets/images/icons/apple-icon-76x76.png"
/>
<link
  rel="apple-touch-icon"
  sizes="114x114"
  href="assets/images/icons/apple-icon-114x114.png"
/>
<link
  rel="apple-touch-icon"
  sizes="120x120"
  href="assets/images/icons/apple-icon-120x120.png"
/>
<link
  rel="apple-touch-icon"
  sizes="144x144"
  href="assets/images/icons/apple-icon-144x144.png"
/>
<link
  rel="apple-touch-icon"
  sizes="152x152"
  href="assets/images/icons/apple-icon-152x152.png"
/>
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="assets/images/icons/apple-icon-180x180.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="192x192"
  href="assets/images/icons/android-icon-192x192.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="assets/images/icons/favicon-32x32.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="96x96"
  href="assets/images/icons/favicon-96x96.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="assets/images/icons/favicon-16x16.png"
/>
{{ end }}
