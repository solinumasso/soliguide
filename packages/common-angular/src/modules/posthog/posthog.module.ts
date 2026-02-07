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
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from "@angular/core";
import { PosthogAddUserIdHeadersInterceptor } from "./posthog-add-user-id-headers.interceptor";
import { PosthogConfig } from "./posthog-config";
import { PosthogService } from "./posthog.service";

@NgModule({
  providers: [
    PosthogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PosthogAddUserIdHeadersInterceptor,
      multi: true,
    },
  ],
})
export class PosthogModule {
  static forRoot(config: PosthogConfig): ModuleWithProviders<PosthogModule> {
    return {
      ngModule: PosthogModule,
      providers: [{ provide: PosthogConfig, useValue: config }],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule?: PosthogModule) {
    if (parentModule) {
      throw new Error(
        "PosthogModule is already loaded. Import it in the AppModule only"
      );
    }
  }
}
