import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ManageMultipleSelectComponent } from "./components/manage-multiple-select/manage-multiple-select.component";
import { ManagePaginationComponent } from "./components/manage-pagination/manage-pagination.component";
import { ManageSortIconComponent } from "./components/manage-sort-icon/manage-sort-icon.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ManageMultipleSelectComponent,
    ManagePaginationComponent,
    ManageSortIconComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    TranslateModule,
  ],
  exports: [
    ManageMultipleSelectComponent,
    ManagePaginationComponent,
    ManageSortIconComponent,
  ],
})
export class ManageCommonModule {}
