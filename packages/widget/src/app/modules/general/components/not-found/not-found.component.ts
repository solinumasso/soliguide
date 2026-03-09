import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-not-found",
  styleUrls: ["./not-found.component.scss"],
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent implements OnInit {
  constructor(private titleService: Title) {}
  public ngOnInit(): void {
    this.titleService.setTitle("La page demandée n'existe pas");
  }
}
