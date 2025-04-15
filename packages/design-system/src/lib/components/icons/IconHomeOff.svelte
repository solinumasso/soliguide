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
<script lang="ts">
  export let size = 16;
  export let role = 'img';
  export let color = '#171717';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 16 16"
>
  <g id="home">
    <path
      id="Vector 5 (Stroke)"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.8479 6.10675C13.8491 6.11332 13.868 6.17477 13.8905 6.3179C13.9204 6.50763 13.9454 6.76527 13.962 7.08913C13.9952 7.73509 13.9905 8.55582 13.954 9.45109C13.8898 11.0293 13.7309 12.7454 13.5423 14H11.6526V11.818C11.6526 10.4188 10.4962 9.35025 9.15201 9.35025L6.84023 9.35025C5.49603 9.35025 4.33963 10.4188 4.33963 11.818V14H2.44698C2.24886 12.7612 2.07127 11.1231 1.99176 9.60082C1.94674 8.73896 1.93459 7.94009 1.96373 7.28798C1.98875 6.72825 2.04104 6.38154 2.08242 6.20865C2.68206 5.47578 3.98984 4.42414 5.40325 3.48981C6.1178 3.01746 6.80274 2.6124 7.34812 2.33205C7.61926 2.19267 7.83468 2.09512 7.98924 2.0358C7.99749 2.03873 8.00612 2.04184 8.01514 2.04514C8.1919 2.1097 8.43529 2.21449 8.7353 2.36072C9.33219 2.65167 10.0748 3.06823 10.8232 3.5466C11.5734 4.02615 12.2977 4.54759 12.871 5.04269C13.485 5.57295 13.7717 5.94344 13.8479 6.10675ZM7.98032 0.5C8.94525 0.5 14.3495 3.59524 15.2172 5.48515C15.7465 6.57617 15.4191 12.0442 14.9448 14.749C14.8672 15.1915 14.4654 15.5 14.0034 15.5H11.1441C10.594 15.5 10.1481 15.0667 10.1481 14.5323V11.818C10.1481 11.2835 9.70212 10.8502 9.15201 10.8502L6.84023 10.8502C6.29013 10.8502 5.84418 11.2835 5.84418 11.818V14.5323C5.84418 15.0667 5.39823 15.5 4.84813 15.5H1.99749C1.53156 15.5 1.12703 15.1863 1.04669 14.7404C0.562811 12.0547 0.156613 6.98665 0.70898 5.56615C0.730854 5.5099 0.759773 5.46179 0.796359 5.41329C2.23851 3.50132 7.02742 0.5 7.98032 0.5Z"
      fill={color}
    />
  </g>
</svg>
