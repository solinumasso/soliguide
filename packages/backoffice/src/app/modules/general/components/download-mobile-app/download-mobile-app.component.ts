import { Component, OnInit } from "@angular/core";
import { format } from "date-fns";

import {
  IS_BOT,
  IS_WEBVIEW_APP,
  globalConstants,
  getMobileAppLink,
} from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-download-mobile-app",
  templateUrl: "./download-mobile-app.component.html",
  styleUrls: ["./download-mobile-app.component.css"],
})
export class DownloadMobileAppComponent implements OnInit {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly IS_BOT = IS_BOT;

  public mobileLink: string | null = null;

  ngOnInit(): void {
    const lastTimeDownloadProposed = globalConstants.getItem("APP_SUGGESTION");
    const today = format(new Date(), "dd/MM/yyyy");

    if (lastTimeDownloadProposed !== today) {
      this.mobileLink = getMobileAppLink();
    } else {
      this.mobileLink = null;
    }
  }

  public closeApp(): void {
    const today = format(new Date(), "dd/MM/yyyy");
    globalConstants.setItem("APP_SUGGESTION", today);
    this.mobileLink = null;
  }
}
