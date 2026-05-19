import { SeoService } from "./../../../shared/services/seo.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-devenir-benevole",
  templateUrl: "./devenir-benevole.component.html",
  styleUrls: ["./devenir-benevole.component.css"],
})
export class DevenirBenevoleComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  public ngOnInit(): void {
    const title = "Devenir bénévole de Solinum avec JeVeuxAider";
    const description =
      "JeVeuxAider.gouv.fr est la plateforme publique du bénévolat, proposée par la Réserve Civique";

    this.seoService.updateTitleAndTags(title, description, true);
  }
}
