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
import {
  Inject,
  Injectable,
  // Renderer2,
  // RendererFactory2
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { User } from "../../users/classes/user.class";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  // private readonly renderer: Renderer2;

  constructor(
    // private readonly rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    // this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public loadScript(): void {
    if (THEME_CONFIGURATION.chatWebsiteId != null && !this.isScriptLoaded()) {
      console.log("chat should be loaded");
      // window["ZENDESK_COOKIE_EXPIRE"] = 15778800; // 15778800 = 6 months
      // const script = this.renderer.createElement("script");
      // this.renderer.setAttribute(
      //   script,
      //   "src",
      //   `https://static.zdassets.com/ekr/snippet.js?key=${THEME_CONFIGURATION.chatWebsiteId}`
      // );
      // this.renderer.setAttribute(script, "id", "ze-snippet");
      // const head = this.document.head;
      // this.renderer.appendChild(head, script);
    }
  }

  public isScriptLoaded(): boolean {
    return !!this.document.querySelector(
      `script[src='https://static.zdassets.com/ekr/snippet.js?key=${THEME_CONFIGURATION.chatWebsiteId}']`
    );
  }

  // Delete chat session cookie and refresh page
  // skipcq: JS-0105
  public resetSession(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zE = (window as any).zE as any; // skipcq: JS-0323
    zE("messenger:set", "cookies", false);
    zE("messenger", "logoutUser");
  }

  public async openChat(user?: User): Promise<void> {
    if (!this.isScriptLoaded()) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zE = (window as any).zE as any; // skipcq: JS-0323
    let counter = 0;

    while (!zE && counter < 3) {
      await new Promise((f) => setTimeout(f, 1000));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zE = (window as any).zE as any; // skipcq: JS-0323
      counter++;
    }

    if (!zE) {
      return;
    }

    zE("messenger:set", "cookies", true);
    zE("messenger", "open");

    // Only for pros
    if (user?.pro) {
      zE("messenger:set", "conversationTags", ["PROS"]);
      zE("messenger:set", "conversationFields", [
        { id: "ORGA_NOM", value: user.currentOrga?.name ?? "NULL" },
        {
          id: "ORGA_TERRITOIRE",
          value: user.currentOrga?.territories[0] ?? "NULL",
        },
        { id: "TYPE_COMPTE", value: "PRO" },
        { id: "USER_PRENOM", value: user.name },
        { id: "USER_NOM", value: user.lastname },
      ]);
    }
  }
}
