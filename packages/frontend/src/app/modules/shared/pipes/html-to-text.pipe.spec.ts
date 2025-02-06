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
import { HtmlToTextPipe } from "./html-to-text.pipe";

describe("HtmlToTextPipe", () => {
  let pipe: HtmlToTextPipe;

  beforeEach(() => {
    pipe = new HtmlToTextPipe();
  });

  it("should transform HTML to plain text", () => {
    expect(pipe.transform("<p>Foo</p><p>Bar</p>")).toEqual("Foo Bar");
  });

  it("should transform HTML to plain text", () => {
    const html =
      "<p>Aurore est une association de lutte contre l'exclusion agissant au niveau national. Le restaurant social permet &#224; des personnes en situation de pr&#233;carit&#233; de s'alimenter. Les usagers doivent se munir d&#8217;une carte mensuelle d&#233;livr&#233;e par les services sociaux de leur arrondissement</p><p>Possibilit&#233; de panier repas sur les temps du service pour les familles, les &#233;tudiants...</p><p>&#160;</p><p>Un espace d&#233;di&#233; est r&#233;serv&#233; aux familles : mise &#224; disposition de chaises hautes, d'un parc et de jouets</p><p>&#160;</p><p>Le restaurant ne ferme ni l'&#233;t&#233;, ni l'hiver, ni les dimanches ou les jours f&#233;ri&#233;s.</p>";

    const expected =
      "Aurore est une association de lutte contre l'exclusion agissant au niveau national. Le restaurant social permet à des personnes en situation de précarité de s'alimenter. Les usagers doivent se munir d’une carte mensuelle délivrée par les services sociaux de leur arrondissement Possibilité de panier repas sur les temps du service pour les familles, les étudiants... Un espace dédié est réservé aux familles : mise à disposition de chaises hautes, d'un parc et de jouets Le restaurant ne ferme ni l'été, ni l'hiver, ni les dimanches ou les jours fériés.";
    const result = pipe.transform(html);
    expect(result).toEqual(expected);
  });

  it("should transform complex HTML to plain text", () => {
    const html = `<div _ngcontent-wqf-c126="" class="place_description"><div _ngcontent-wqf-c126="" class="pb-3 ng-star-inserted"><b _ngcontent-wqf-c126="">Organisation</b> : Mana Ara<!----><!----><!----><!----><!----><!----></div><!----><app-display-publics-inline _ngcontent-wqf-c126="" _nghost-wqf-c110=""><div _ngcontent-wqf-c110="" class="ng-star-inserted"><b _ngcontent-wqf-c110="" class="ng-star-inserted"><fa-icon _ngcontent-wqf-c110="" class="ng-fa-icon me-2"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" class="svg-inline--fa fa-users" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg></fa-icon> Accueil inconditionnel </b><!----><!----><div _ngcontent-wqf-c110="" class="my-1 ng-star-inserted"><b _ngcontent-wqf-c110=""><fa-icon _ngcontent-wqf-c110="" class="ng-fa-icon me-2"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" class="svg-inline--fa fa-circle-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></fa-icon> Autre information importante : </b><i _ngcontent-wqf-c110="">Ce programme est accessible aux personnes ayant un quotient familial CAF inférieur ou égal à 750€, en présentant la carte grise du véhicule.</i></div><!----></div><!----><!----></app-display-publics-inline><app-display-modalities-inline _ngcontent-wqf-c126="" _nghost-wqf-c112=""><div _ngcontent-wqf-c112="" class="ng-star-inserted"><!----><!----><div _ngcontent-wqf-c112="" class="my-2 ng-star-inserted"><b _ngcontent-wqf-c112=""><fa-icon _ngcontent-wqf-c112="" aria-hidden="true" class="ng-fa-icon me-2"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="door-open" class="svg-inline--fa fa-door-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"></path></svg></fa-icon> Sur inscription </b><span _ngcontent-wqf-c112="" class="ng-star-inserted"> : Inscrivez-vous ici : https://manaara.org/prescripteurs/</span><!----></div><!----><div _ngcontent-wqf-c112="" class="my-2 ng-star-inserted"><b _ngcontent-wqf-c112=""><fa-icon _ngcontent-wqf-c112="" aria-hidden="true" class="ng-fa-icon me-2"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="door-open" class="svg-inline--fa fa-door-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"></path></svg></fa-icon> Sur rendez-vous</b><span _ngcontent-wqf-c112="" class="ng-star-inserted"> : Un rendez-vous vous sera donné après l'acceptation de votre dossier pour faire un devis en centre-auto</span><!----></div><!----><div _ngcontent-wqf-c112="" class="my-2 ng-star-inserted"><b _ngcontent-wqf-c112=""><fa-icon _ngcontent-wqf-c112="" aria-hidden="true" class="ng-fa-icon me-2"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="euro-sign" class="svg-inline--fa fa-euro-sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M48.1 240c-.1 2.7-.1 5.3-.1 8v16c0 2.7 0 5.3 .1 8H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H60.3C89.9 419.9 170 480 264 480h24c17.7 0 32-14.3 32-32s-14.3-32-32-32H264c-57.9 0-108.2-32.4-133.9-80H256c17.7 0 32-14.3 32-32s-14.3-32-32-32H112.2c-.1-2.6-.2-5.3-.2-8V248c0-2.7 .1-5.4 .2-8H256c17.7 0 32-14.3 32-32s-14.3-32-32-32H130.1c25.7-47.6 76-80 133.9-80h24c17.7 0 32-14.3 32-32s-14.3-32-32-32H264C170 32 89.9 92.1 60.3 176H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H48.1z"></path></svg></fa-icon> Participation financière requise </b><!----></div><!----><!----><!----><!----></div><!----></app-display-modalities-inline><app-display-languages _ngcontent-wqf-c126="" _nghost-wqf-c113=""><div _ngcontent-wqf-c113="" class="py-2 ng-star-inserted"><b _ngcontent-wqf-c113="">Langue(s) parlée(s) :</b><span _ngcontent-wqf-c113="" class="ng-star-inserted"> Français<!----></span><!----></div><!----></app-display-languages><div _ngcontent-wqf-c126="" class="py-2"><p>Mana Ara est un programme solidaire de Norauto pour permettre à tous de réparer sa voiture.</p><p>Sous certaines conditions de revenus, vous obtiendrez un devis dans l'un des garages participant près de chez vous pour effectuer les réparations nécessaires sur votre véhicule.</p><p>Contactez-vous pour bénéficier de ce programme.</p></div></div>`;

    const expected =
      "Organisation : Mana Ara Accueil inconditionnel Autre information importante : Ce programme est accessible aux personnes ayant un quotient familial CAF inférieur ou égal à 750€, en présentant la carte grise du véhicule. Sur inscription : Inscrivez-vous ici : https://manaara.org/prescripteurs/ Sur rendez-vous : Un rendez-vous vous sera donné après l'acceptation de votre dossier pour faire un devis en centre-auto Participation financière requise Langue(s) parlée(s) : Français Mana Ara est un programme solidaire de Norauto pour permettre à tous de réparer sa voiture. Sous certaines conditions de revenus, vous obtiendrez un devis dans l'un des garages participant près de chez vous pour effectuer les réparations nécessaires sur votre véhicule. Contactez-vous pour bénéficier de ce programme.";
    const result = pipe.transform(html);
    expect(result).toEqual(expected);
  });

  it("should return an empty string for null input", () => {
    const result = pipe.transform(null);
    expect(result).toEqual("");
  });

  it("should return an empty string for undefined input", () => {
    const result = pipe.transform(undefined);
    expect(result).toEqual("");
  });
});
