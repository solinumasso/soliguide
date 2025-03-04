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
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { environment } from "../../../../environments/environment";
import { MetaTag } from "../../../shared";

@Injectable({
  providedIn: "root",
})
export class SeoService {
  constructor(
    private metaService: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  public updateTitleAndTags(
    title: string,
    description: string,
    follow = false
    // image: string = null
  ) {
    // Nettoyage des espaces inutiles
    title = title.replace(/\s\s+/g, " ").trim();
    description = description.replace(/\s\s+/g, " ").trim();

    // Mise à jour du titre
    this.titleService.setTitle(title);

    this.generateMetasTags(title, description, follow);

    // Mise à jour de la balise canonical
    this.createLinkForCanonicalURL();
  }

  public createLinkForCanonicalURL() {
    const link: HTMLLinkElement = this.doc.createElement("link");
    let element: HTMLLinkElement =
      this.doc.querySelector("link[rel='canonical']") || null;
    if (element === null) {
      element = this.doc.createElement("link") as HTMLLinkElement;
      this.doc.head.appendChild(link);
    }
    element.setAttribute("rel", "canonical");
    element.setAttribute("href", this.doc.URL);
  }

  public generateMetasTags(
    title: string,
    description: string,
    follow = true
  ): void {
    description =
      description.length > 155
        ? description.substring(0, 155) + "..."
        : description;

    const robots =
      follow && environment.environment === "PROD"
        ? { name: "robots", content: "index, follow" }
        : { name: "robots", content: "noindex, nofollow" };

    const tags: MetaTag[] = [
      { name: "description", content: description },
      { name: "og:title", content: title },
      { name: "twitter:title", content: title },
      { name: "og:description", content: description },
      { name: "twitter:description", content: description },
      { name: "twitter:url", content: this.doc.URL },
      { name: "og:url", content: this.doc.URL },
      robots,
    ];

    // Mise à jour de tous les tags
    tags.forEach((tag: MetaTag) => {
      this.metaService.updateTag(tag);
    });
  }
}
