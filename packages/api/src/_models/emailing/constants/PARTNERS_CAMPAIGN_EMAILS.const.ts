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
import { Partners } from "../../../partners/enums/partners.enum";
import { PartnerCampaignEmailTemplatesContent } from "../types";
import { RGPD_FOOTER } from "./RGPD_FOOTER.const";

export const PARTNER_CAMPAIGN_EMAIL_TEMPLATE: PartnerCampaignEmailTemplatesContent =
  {
    [Partners.RESTOS]: {
      CAMPAGNE_COMPTES_PRO: {
        content: `<p>
          Comme vous le savez, les Restos du cœur déploient Soliguide sur l’ensemble des associations départementales et lieux d’accueil.         </p>
        <p>
          Soliguide démarre sa campagne de mise à jour saisonnière et pourra contacter directement les associations départementales afin de les accompagner dans la démarche.
        </p>
        <p><strong>🎯 Votre mission :</strong><br>
        <ol>
        <li> Vérifier les informations de votre structure</li>
        <li> Les corriger si besoin</li>
        <li> Indiquer vos périodes de fermeture estivale ou toute autre information utile</li>
        </p>
        <p>👉 Cliquez ici pour accéder au <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">formulaire de mise à jour</a></strong></p>
        <p><strong>💻 Aide et Support</strong><br>
        <li> Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        <li> On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <ul>
        <p>Un grand merci pour votre votre mobilisation !<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à <strong>%EMAIL_SOLIGUIDE%</strong></i></p>
        ${RGPD_FOOTER}`,
        subject: "😱 Prêt pour la mise à jour Soliguide ?",
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        content: `<p>
        Comme vous le savez, les Restos du cœur déploient depuis plusieurs mois Soliguide sur l’ensemble des associations départementales et lieux d’accueil.
      </p>
      <p><strong>N’oubliez pas de mettre à jour vos informations notamment les fermetures temporaires pour cet été.</strong></p>
      <p>
        <strong>🌞 Comment faire ?</strong><br>
        <ol>
        <li> Vérifier les informations de votre structure</li>
        <li> Les corriger si besoin</li>
        <li> Indiquer vos périodes de fermeture estivale ou toute autre information utile</li>
        </p>
        <p>👉 Cliquez ici pour accéder au <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">formulaire de mise à jour</a></strong></p>
        <p><strong>💻 Aide et Support</strong><br>
        <li> Pour vous aider à la prise en main de votre compte, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        <li> Participez aussi à notre prochain webinaire spécial mise à jour saisonnière. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <ul>
      <p>À très vite,<br>
      %NOM_SOLIGUIDE%.<br>
      <i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>
      ${RGPD_FOOTER}`,
        subject: "🌞 Aidez-nous à garder Soliguide à jour pour cet été",
      },
    },
  };

export const PARTNER_CC: Partial<Record<Partners, string>> = {
  [Partners.RESTOS]: "lactudupia@restosducoeur.org",
};
