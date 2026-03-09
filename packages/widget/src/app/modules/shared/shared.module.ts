import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UcFirstPipe } from "./pipes/uc-first.pipe";
import { SafeUrlPipe } from "./pipes/safe-url.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";

@NgModule({
  declarations: [SafeUrlPipe, SafeHtmlPipe, UcFirstPipe],
  exports: [SafeUrlPipe, SafeHtmlPipe, UcFirstPipe],
  imports: [CommonModule],
})
export class SharedModule {}
