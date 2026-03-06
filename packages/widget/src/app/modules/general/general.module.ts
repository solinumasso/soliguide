import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";

import { GcuComponent } from "./components/gcu/gcu.component";
import { HelpSearchComponent } from "./components/help-search/help-search.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PersonalDataProtectionAgreementComponent } from "./components/personal-data-protection-agreement/personal-data-protection-agreement.component";

@NgModule({
  declarations: [
    GcuComponent,
    HelpSearchComponent,
    NotFoundComponent,
    PersonalDataProtectionAgreementComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forRoot([]),
    SharedModule,
    TranslateModule,
  ],
})
export class GeneralModule {}
