import { NgModule } from "@angular/core";
import { Router } from "@angular/router";

/**
 * NgModule as workaround for "Navigation triggered outside Angular zone" in tests
 *
 * https://github.com/angular/angular/issues/47236
 */
@NgModule()
// skipcq: JS-0327
export class FixNavigationTriggeredOutsideAngularZoneNgModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_router: Router) {} // skipcq: JS-0358, JS-0321
}
