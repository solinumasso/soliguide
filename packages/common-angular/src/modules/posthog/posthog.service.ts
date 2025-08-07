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
import { Injectable, OnDestroy } from "@angular/core";
import posthog, { type PostHog, type PostHogConfig } from "posthog-js";
import { from, map, type Observable, Subscription } from "rxjs";

import { PosthogConfig } from "./posthog-config";
import type { PosthogProperties } from "./posthog-properties.type";

@Injectable({
  providedIn: "root",
})
export class PosthogService implements OnDestroy {
  // We should not call posthog.identity before posthog.init is loaded
  private readonly _posthogInstance: Promise<PostHog | null>;
  private readonly subscription: Subscription;
  public readonly enabled: boolean;

  public constructor(private readonly posthogConfig: PosthogConfig) {
    this.subscription = new Subscription();
    this.enabled =
      this.posthogConfig.posthogUrl.length !== 0 &&
      typeof this.posthogConfig.posthogApiKey !== "undefined" &&
      this.posthogConfig.posthogApiKey.length !== 0;

    this._posthogInstance = new Promise<PostHog | null>((resolve) => {
      if (!this.enabled || !this.posthogConfig.posthogApiKey) {
        return resolve(null);
      }
      // Reference documentation: https://posthog.com/docs/integrate/client/js#config
      posthog.init(
        this.posthogConfig.posthogApiKey,
        this.getConfig(resolve),
        this.posthogConfig.posthogLibraryName
      );
    });
  }

  private getConfig(
    loaded?: (posthogInstance: PostHog) => void,
    processProperties?: (
      properties: PosthogProperties,
      event_name: string
    ) => PosthogProperties
  ): Partial<PostHogConfig> {
    return {
      api_host: this.posthogConfig.posthogUrl,
      autocapture: false,
      ip: false,
      debug: this.posthogConfig.posthogDebug,
      disable_session_recording: false,
      loaded,
      persistence: "memory",
      session_idle_timeout_seconds: 1800, // 30 minutes
      sanitize_properties: processProperties,
      session_recording: {
        maskAllInputs: true,
        maskInputFn: (text, element) => {
          if (element?.dataset.record === "true") {
            return text;
          }
          return "*".repeat(text.trim().length);
        },
      },
    };
  }

  public setProcessProperties(
    processProperties?: (
      properties: PosthogProperties,
      event_name: string
    ) => PosthogProperties
  ): void {
    this.subscription.add(
      this.posthogInstance.subscribe((posthogInstance) => {
        posthogInstance?.set_config(
          this.getConfig(undefined, processProperties)
        );
      })
    );
  }

  public get posthogInstance(): Observable<PostHog | null> {
    return from(this._posthogInstance);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getUserDistinctId(): Observable<string | null> {
    return this.posthogInstance.pipe(
      map((posthogInstance) => {
        if (!this.enabled) {
          return null;
        }

        if (!posthogInstance) {
          return null;
        }
        return posthogInstance.get_distinct_id();
      })
    );
  }

  public getUserSessionId(): Observable<string | null> {
    return this.posthogInstance.pipe(
      map((posthogInstance) => {
        if (!this.enabled) {
          return null;
        }

        if (!posthogInstance) {
          return null;
        }
        return posthogInstance.get_session_id();
      })
    );
  }

  public capture(eventName: string, properties?: PosthogProperties): void {
    if (this.enabled) {
      this.posthogInstance.subscribe((posthogInstance) => {
        if (posthogInstance) {
          posthogInstance.capture(eventName, properties);
        }
      });
    }
  }

  public identify(userId: string, properties?: PosthogProperties): void {
    if (this.enabled) {
      this.posthogInstance.subscribe((posthogInstance) => {
        if (posthogInstance) {
          posthogInstance.identify(userId, properties);
        }
      });
    }
  }
}
