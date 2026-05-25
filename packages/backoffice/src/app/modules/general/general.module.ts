import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";

import { AideComponent } from "./components/aide/aide.component";
import { AideTradComponent } from "./components/aide-trad/aide-trad.component";
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/nav/nav.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { FooterComponent } from "./components/footer/footer.component";
import { GeneralService } from "./services/general.services";

import { SharedModule } from "../shared/shared.module";
import { ChatService } from "../shared/services";

@NgModule({
  declarations: [
    AideComponent,
    AideTradComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
  ],
  exports: [NotFoundComponent, NavComponent, FooterComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    SharedModule,
    TranslateModule,
  ],
  providers: [GeneralService, ChatService],
})
export class GeneralModule {} // skipcq: JS-0327
