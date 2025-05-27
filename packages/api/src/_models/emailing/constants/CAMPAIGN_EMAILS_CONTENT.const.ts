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
import {
  AllCampaignEmailTemplatesContent,
  CampaignEmailTemplatesContent,
} from "../types";

import { RGPD_FOOTER } from "./RGPD_FOOTER.const";

export const CAMPAIGN_EMAILS_CONTENT: AllCampaignEmailTemplatesContent = {
  MAJ_ETE_2022: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Nous espérons que vous vous portez bien ?</p>
      <p>Les congés d’été arrivent à grands pas !</p>
      <p><strong style="color: #E65A46">En cas de changement d’horaires et/ou d’ouverture, pourriez-vous mettre à jour vos informations sur Soliguide ?</strong></p>
      <p><strong style="color: #E65A46; text-decoration: underline">Si vous n’avez aucun changement, il est important de l’indiquer aussi.</strong></p>
      <p>
        👉 Si vous n’avez pas de changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>
        👉 Si vous avez un changement à faire sur l’une ou plusieurs de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>Si vous êtes administrateur, n’hésitez pas à relayer l’information auprès des autres structures.</p>
      <p>Un grand merci pour votre engagement; des milliers de professionnels, bénévoles, bénéficiaires utilisent Soliguide et ces informations sont cruciales.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%. Des tutoriels sont disponibles sur <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide"><strong>la page aide</strong></a> de votre espace.</i></p>
      ${RGPD_FOOTER}`,
      subject: "🌻 Mettez à jour vos informations d’été sur Soliguide",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Nous espérons que vous vous portez bien ?</p>
      <p>Les congés d’été arrivent à grands pas !</p>
      <p><strong style="color: #E65A46">En cas de changement d’horaires et/ou d’ouverture, pourriez-vous mettre à jour vos informations sur Soliguide ?</strong></p>
      <p><strong style="color: #E65A46; text-decoration: underline">Si vous n’avez aucun changement, il est important de l’indiquer aussi.</strong></p>
      <p>
        👉 Vous pouvez modifier ces informations via votre <strong>compte Soliguide (gratuit)</strong>. Pour créer un compte, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>cliquer sur le lien suivant</u></strong></a>.
      </p>
      <p>Une fois votre compte activé, vous pourrez modifier vos fiches directement et accéder à des informations privilégiées telles qu’un annuaire de contacts professionnels.</p>
      <p>Un grand merci pour votre engagement; des milliers de professionnels, bénévoles, bénéficiaires utilisent Soliguide et ces informations sont cruciales.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%<i/></p>
      ${RGPD_FOOTER}`,
      subject: "🌻 Mettez à jour vos informations d’été sur Soliguide",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, je n’ai pas eu de retour suite à mon précédent mail ?</p>
      <p><strong>Pourriez-vous mettre à jour vos informations sur Soliguide ?</strong></p>
      <p>Sans réponse de votre part, nous devrons passer votre fiche hors ligne (non visible par les utilisateurs) afin de garantir la qualité de notre base de données.</p>
      <p>
        👉 Si vous n’avez aucun changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>
        👉 Si vous avez un changement à faire sur l’une de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>Je reste bien entendu disponible si besoin,</p>
      <p>Merci d’avance et excellente journée.</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%.</i></p>
      ${RGPD_FOOTER}`,
      subject:
        "🌻 Informez vos bénéficiaires et interlocuteurs professionnels de l’action sociale",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, je n’ai pas eu de retour suite à mon précédent mail ?</p>
      <p><strong>Pourriez-vous indiquer si vous avez des changements <span style="text-decoration: underline">ou non</span> pour cet été ?</strong></p>
      <p>Cette mise à jour est très importante ; elle permet de garantir une bonne information sur notre site et donc aux utilisateurs. Sans réponse, nous serons malheureusement contraints de dépublier vos fiches (donc non visibles par les utilisateurs).</p>
      <p>
        👉 Vous pouvez modifier ces informations via votre <strong>compte Soliguide (gratuit)</strong>. Pour créer un compte, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>cliquer sur le lien suivant</u></strong></a>.
      </p>
      <p>Je reste bien entendu disponible si besoin.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>
      ${RGPD_FOOTER}`,
      subject:
        "📅 Informez vos bénéficiaires et interlocuteurs professionnels de l’action sociale",
    },
    RELANCE_DESESPOIR_COMPTES_PRO: {
      content: `<p>Bonjour,</>
      <p>Vous avez actuellement des fiches présentant une ou plusieurs structures sur Soliguide.fr</p>
      <p>Sauf erreur, nous n’avons pas détecté d’action de votre part pour la mise à jour des informations de cet été.</p>
      <p><strong>Pouvez-vous vous assurer que les éléments renseignés sont à jour ?</strong></p>
      <p>
        👉 Si vous n’avez aucun changement, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>
        👉 Si vous avez un changement à faire sur l’une de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>Cette mise à jour est très importante ; elle permet de garantir une bonne information sur notre site et donc aux utilisateurs. Sans réponse, nous serons malheureusement contraints de dépublier vos fiches (donc non visibles par les utilisateurs).</p>
      <p>Si vous avez des questions, n’hésitez pas à répondre à ce mail.</p>
      <p>À bientôt,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      ${RGPD_FOOTER}`,
      subject: "🌧️ Vos fiches sur Soliguide expirent prochainement",
    },
    RELANCE_DESESPOIR_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>J’ai tenté de vous joindre par téléphone car votre compte n’est toujours pas actif sur Soliguide.</p>
      <p>Le compte Soliguide est <strong>gratuit</strong> et permet de mettre à jour vos informations pour informer les bénéficiaires et professionnels de l’action sociale.</p>
      <p>
        👉 <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>Je crée mon compte Soliguide</u></strong></a>.
      </p>
      <p>Avec votre compte, vous pourrez <strong>mettre à jour les informations de votre lieu pour cet été</strong>. Sans réponse de votre part, nous devrons malheureusement passer la fiche hors ligne (donc non visible par vos bénéficiaires et professionnels de l’action sociale) afin de garantir la qualité de notre base de données.</p>
      <p>
        👉 <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>Je mets mes informations à jour sur Soliguide</u></strong></a>.
      </p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>
      ${RGPD_FOOTER}`,
      subject: "⏰ Avez-vous activé votre compte Soliguide ?",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, vous n’avez pas mis à jour toutes vos informations sur Soliguide :</p>
      <p>
        👉 Pour poursuivre votre mise à jour, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      ${RGPD_FOOTER}`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  MAJ_ETE_2023: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        L’été arrive à grands pas et c’est l’heure de la mise à jour de Soliguide !</p>
        <p><strong>Pourriez-vous vérifier vos informations sur Soliguide ? Si vous n’avez aucun changement, il est important de l’indiquer aussi</strong> (et comme ça on arrêtera de vous écrire 😉).</p>
        <p>👉 Si vous n’avez <strong>pas de changement</strong> ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous avez un changement à faire sur l’une ou plusieurs de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement. Si vous êtes <strong>administrateur</strong>, n’hésitez pas à relayer l’information auprès des autres structures.</p>
        <p>💻 Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/WN_4qlktJ0oTBy476MNhV9tGA#/registration?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=webinar&utm_user_ic=%USER_ID%"><strong>ici</strong></a>.<br>
        💁 On vous partage toutes nos ressources <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_page_body&utm_user_ic=%USER_ID%"><strong>ici</strong></a>.</p>
        <p>Un grand merci pour votre coopération ; la qualité de l’information est essentielle !<br>
        %NOM_SOLIGUIDE%<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong><i>. Des tutoriels sont disponibles sur </i><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_page_footer&utm_user_ic=%USER_ID%">la page aide</a><i> de votre espace.</i></p>
        ${RGPD_FOOTER}`,
      subject: "🌻 Mettez à jour vos informations d’été sur Soliguide",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,<br>
        Nous espérons que vous allez bien. Nous sommes ravis que votre organisation soit répertoriée sur notre site Soliguide et nous voulons nous assurer que les informations que nous publions sont à jour et précises.</p>
        <p>Afin de vérifier les informations publiées, vous pouvez accéder à votre compte sur Soliguide (promis tout est gratuit). Ce compte vous permet également d’avoir accès à des informations privilégiées comme un annuaire professionnel.</p>
        <p>👉 Pour créer <strong>votre compte Soliguide</strong>, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%"><strong><u>cliquer sur ce lien</u></strong></a><br>
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement</p>
        <p>💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/WN_4qlktJ0oTBy476MNhV9tGA#/registration?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=webinar&utm_user_ic=%USER_ID%">ici</a></strong>.<br>
        💁 Et on vous partage toutes nos ressources <strong><a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_sheet&utm_user_ic=%USER_ID%">ici</a></strong>.</p>
        <p>Merci d’avance et excellente journée,<br>
        %NOM_SOLIGUIDE%<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong></p>
        ${RGPD_FOOTER}`,
      subject: "💻 Inscrivez-vous sur Soliguide, la cartographie solidaire !",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        😿 je n’ai pas eu de retour suite à mon précédent mail ?<br>
        Votre structure est référencée sur Soliguide et nous vous en remercions. Nous avons besoin de savoir si les informations publiées sont correctes et à jour.<br>
        <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet été</strong> (fermetures temporaires etc) <strong>?</strong><br>
        Sans réponse de votre part, nous devrons passer votre fiche hors ligne afin de garantir les bonnes orientations.</p>
        <p>👉 Si vous n’avez <strong>pas de changement</strong> ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous avez un changement à faire, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement.</p>
        <p>💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_page_body&utm_user_ic=%USER_ID%"><strong>ici</strong></a>.<br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/WN_4qlktJ0oTBy476MNhV9tGA#/registration?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=webinar&utm_user_ic=%USER_ID%"><strong>ici</strong></a></p>
        <p>Je reste bien entendu disponible si besoin,<br>
        Merci d’avance et excellente journée.<br>
        %NOM_SOLIGUIDE%<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong>.</p>
        ${RGPD_FOOTER}`,
      subject: "🙋 Pas de nouvelles, bonnes nouvelles ?",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,<br>
        Je n’ai pas eu de retour suite à mon précédent mail ?<br>
        Votre structure est référencée sur Soliguide et nous vous en remercions. Nous avons besoin de savoir si les informations publiées sont correctes et à jour pour garantir la bonne orientation des utilisateurs.<br>
        <strong>Pourriez-vous vérifier vos informations ?</strong></p>
        <p>👉 Pour créer votre <strong>compte gratuit Soliguide</strong>, il suffit de <strong><a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%"><u>cliquer sur ce lien</u></a></strong>.<br>
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement.</p>
        <p>Cette mise à jour est très importante ; elle permet de garantir une bonne information sur notre site et donc aux utilisateurs. Sans réponse, nous serons malheureusement contraints de dépublier vos fiches.</p>
        <p>💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par  <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/WN_4qlktJ0oTBy476MNhV9tGA#/registration?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=webinar&utm_user_ic=%USER_ID%">ici</a>.</strong><br>
        💁 Et on vous partage toutes nos ressources <strong><a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_sheet&utm_user_ic=%USER_ID%">ici</a></strong></p>
        <p>Je reste bien entendu disponible si besoin. Merci d’avance et excellente journée,<br>
        %NOM_SOLIGUIDE%<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong>.</p>
        ${RGPD_FOOTER}`,
      subject: "📅 Vos informations sur Soliguide sont-elles à jour ?",
    },
    RELANCE_DESESPOIR_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        Vous avez actuellement des fiches présentant une ou plusieurs structures sur Soliguide.fr<br>
        Cependant, nous avons remarqué que les informations publiées sur votre organisation datent de quelques mois et pourraient ne plus être à jour. Nous comprenons que les circonstances peuvent changer rapidement et nous voulons nous assurer que les informations disponibles sur Soliguide sont aussi précises et à jour que possible.</p>
        <p>Nous vous encourageons donc à prendre <strong>quelques minutes</strong> pour mettre à jour les informations de votre organisation sur Soliguide. Cela inclut des informations telles que les horaires d'ouverture, les services proposés, les coordonnées et autres informations pertinentes.</p>
        <p>👉 Pour remplir le formulaire, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=fill_form&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a>.</p>
        <p>Si vous avez besoin d'aide, n'hésitez pas à nous contacter et nous serons heureux de vous aider.</p>
        <p>Nous apprécions votre contribution à Soliguide et nous sommes convaincus que ces mises à jour aideront les personnes en situation de précarité à trouver les ressources dont elles ont besoin. Nous vous remercions à l'avance pour votre coopération et nous restons à votre disposition pour toute question ou préoccupation.</p>
        <p>A bientôt,<br>
        %NOM_SOLIGUIDE%</p>
        ${RGPD_FOOTER}`,
      subject: "🌧️ Vos fiches sur Soliguide expirent prochainement",
    },
    RELANCE_DESESPOIR_INVITATIONS: {
      content: `<p>Bonjour,<br>
        J’ai tenté de vous joindre par téléphone car votre compte n’est toujours pas actif sur Soliguide.<br>
        Le compte Soliguide est <strong>gratuit</strong> et permet de mettre à jour vos informations pour <a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2023/04/Mesure-dimpact-Soliguide-2022_VDVF.pdf?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=impact_sheet&utm_user_ic=%USER_ID%">informer les bénéficiaires et professionnels de l’action sociale</a>.</p>
        <p>👉 <strong><a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">Je m’inscris sur Soliguide</a></strong></p>
        <p>Avec votre compte, vous pouvez <strong>mettre à jour les informations de votre structure pour cet été</strong>. Sans réponse de votre part, nous devrons malheureusement passer la fiche hors ligne (non visible par vos bénéficiaires et professionnels de l’action sociale) afin de garantir une bonne orientation.</p>
        <p>👉 <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=fill_form&utm_user_ic=%USER_ID%">Je mets à jour mes informations sur Soliguide</a></strong></p>
        <p>Merci d’avance et excellente journée,<br>
        %NOM_SOLIGUIDE%<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong>.</p>
        ${RGPD_FOOTER}`,
      subject: "⏰ Avez-vous activé votre compte Soliguide ?",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,<br>
        Sauf erreur, vous n’avez pas terminé votre mise à jour sur Soliguide :<br>
        👉 Pour poursuivre votre mise à jour, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=fill_form&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        Merci d’avance et excellente journée,<br>
        %NOM_SOLIGUIDE%</p>
        ${RGPD_FOOTER}`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  MAJ_ETE_2024: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        L’été approche à <strike>grands</strike> petits pas et c’est l’heure de la mise à jour Soliguide !</p>
        <p><strong>Pourriez-vous vérifier vos informations sur Soliguide ?</strong> Si vous n’avez aucun changement, il est aussi important de l’indiquer.</p>
        <p>👉 Si vos informations sont à jour, que vous n’avez pas de changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous avez un changement à faire sur l’une ou plusieurs de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 La catégorie Alimentation évolue : de nouvelles informations sur les <strong>services d’aide alimentaire</strong> sont disponibles ! Si vous proposez des services d'aide alimentaire, pensez également à compléter et à mettre à jour vos services.</p>
        <p><strong>Aide et Support</strong><br>
        💻 Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <p>Un grand merci pour votre coopération ; la qualité de l’information est essentielle !<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong><i>. Des tutoriels sont disponibles sur </i><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=help_page_footer&utm_user_ic=%USER_ID%">la page aide</a><i> de votre espace.</i></p>
        ${RGPD_FOOTER}`,
      subject: "💪 Etes-vous prêts pour la mise à jour été de Soliguide ?",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,<br>
        Nous espérons que vous allez bien ? Votre organisation est répertoriée sur le site Soliguide.fr et nous voulons nous assurer que les informations sont à jour et précises.</p>
        <p>Afin de vérifier les informations publiées, vous pouvez <strong>accéder à votre compte</strong> sur Soliguide (promis tout est gratuit). Ce compte vous permet également d’avoir accès à des informations privilégiées.</p>
        <p>👉 Pour créer <strong>votre compte Soliguide</strong>, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%"><strong><u>cliquer sur ce lien</u></strong></a><br>
        👉 <strong>Vérifiez ensuite vos informations</strong> et indiquez si vous avez des changements temporaires pour cet été dans votre espace.</p>
        <p><strong>Agissez dès maintenant</strong><br>
        Nous vous encourageons à vérifier ces informations le plus tôt possible pour maximiser l'efficacité de nos services auprès des personnes en difficulté et associations.</p>
        <p><strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <p>Excellente journée,<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong></p>
        ${RGPD_FOOTER}`,
      subject: "💻 Inscrivez-vous sur Soliguide !",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        😿 je n’ai pas eu de retour suite à mon précédent mail ?<br>
        Votre structure est référencée sur Soliguide et nous vous en remercions. Nous avons besoin de savoir si les informations publiées sont correctes et à jour. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet été</strong> (fermetures temporaires etc) <strong>?</strong></p>
        <p>Sans réponse de votre part, nous devrons passer votre fiche hors ligne afin de garantir les bonnes orientations. Si vous n’avez aucun changement, il est important de l’indiquer aussi.</p>
        <p>👉 Si vos informations sont bien à jour, que vous n’avez pas de changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous avez un changement à faire, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous proposez des <strong>services d'aide alimentaire</strong>, pensez également à compléter et à mettre à jour vos services.</p>
        <p><strong>Aide et Support</strong><br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <p>Je reste bien entendu disponible si besoin,<br>
        À bientôt.<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong></p>
        ${RGPD_FOOTER}`,
      subject: "🙋 Pas de nouvelles, bonnes nouvelles ?",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,<br>
        Votre structure est référencée sur le site Soliguide.fr et nous vous en remercions ! Nous avons besoin de savoir si les informations publiées sont correctes et à jour.</p>
        <p><strong>🌟 Pourquoi cette vérification est essentielle ?</strong></p>
        <ul>
        <li>L’été est une période où beaucoup de changements se produisent dans les horaires et services des structures.</li>
        <li>Les personnes en difficulté et acteurs de la Solidarité qui utilisent Soliguide comptent sur des informations précises.</li>
        </ul>
        <p><strong>🎯 Voici comment vous pouvez aider (2 étapes):</strong></p>
        <ol>
        <li><strong>Créez votre compte Soliguide</strong> : il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%"><strong><u>cliquer sur ce lien</u></strong></a></li>
        <li><strong>Vérifiez et mettez à jour vos informations</strong> via le formulaire dédié de votre espace. Si les informations sont à jour et que vous n’avez aucun changement cet été, il est aussi important de l’indiquer.</li>
        </ol>
        <p><strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <p>Je reste bien entendu disponible si besoin. Excellente journée,<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong></p>
        ${RGPD_FOOTER}`,
      subject: "📅 Vos informations sur Soliguide sont-elles à jour ?",
    },
    RELANCE_DESESPOIR_COMPTES_PRO: {
      content: `<p>Bonjour,<br>
        Votre structure est référencée sur Soliguide et nous vous en remercions. Nous avons besoin de savoir si les informations publiées sont correctes et à jour. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet été</strong> (fermetures temporaires etc) <strong>?</strong></p>
        <p>👉 Si vos informations sont bien à jour, que vous n’avez pas de changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous avez un changement à faire, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        👉 Si vous proposez des <strong>services d'aide alimentaire</strong>, pensez également à compléter et à mettre à jour vos services.</p>
        <p><strong>Aide et Support</strong><br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide">ici</a></strong>.</p>
        <p>Je reste bien entendu disponible si besoin,<br>
        <p>A bientôt,<br>
        %NOM_SOLIGUIDE%.<br>
        <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong></p>
        ${RGPD_FOOTER}`,
      subject:
        "⌚ Plus que quelques jours pour mettre à jour votre fiche Soliguide",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,<br>
        Sauf erreur, vous n’avez pas terminé votre mise à jour sur Soliguide :<br>
        👉 Pour finaliser votre mise à jour, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=fill_form&utm_user_ic=%USER_ID%"><strong><u>cliquez ici</u></strong></a><br>
        Si vous n’avez aucun changement, il est important de l’indiquer aussi.<br>
        Excellente journée,<br>
        %NOM_SOLIGUIDE%.</p>
        ${RGPD_FOOTER}`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  MAJ_HIVER_2022: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Les fêtes de fin d’année arrivent à grands pas et c’est l’heure de la mise à jour !</p>
      <p>
        <strong style="color: #E65A46">Pourriez-vous mettre à jour et vérifier vos informations sur Soliguide ?<br>
        <u>En cas de changement d’horaires et/ou d’ouverture, pourriez-vous mettre à jour vos informations sur Soliguide ?</u></strong>
      </p>
      <p>
        👉 Si vous n’avez <strong>pas</strong> de changement ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong>cliquez ici</strong></a>.<br>
        👉 Si vous avez un changement à faire sur l’une ou plusieurs de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong>cliquez ici</strong></a>.<br>
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement.<br>
        👉 Si vous êtes <strong>administrateur</strong>, n’hésitez pas à relayer l’information auprès des autres structures.<br>
      </p>
      <p>Un grand merci pour votre engagement; la qualité de l’information est essentielle.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%. Des tutoriels sont disponibles sur <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide"><strong>la page aide</strong></a> de votre espace.</i></p>
      ${RGPD_FOOTER}`,
      subject: "🥶 Mettez à jour vos informations d’hiver sur Soliguide",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Les fêtes de fin d’année arrivent à grands pas et c’est l’heure de la mise à jour hivernale !</p>
      <p>
        <strong style="color: #E65A46">Pourriez-vous mettre à jour et vérifier vos informations sur <u>Soliguide</u> ?<br>
        <u>Si vous n’avez aucun changement, il est important de l’indiquer aussi.</u></strong>
      </p>
      <p>
        👉 Vous pouvez modifier ces informations via votre <strong>compte Soliguide (gratuit)</strong>. Pour créer un compte, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>cliquer sur le lien suivant</u></strong></a>.<br>
        Une fois votre compte activé, vous pourrez modifier vos fiches directement et accéder à des informations privilégiées telles qu’un annuaire de contacts professionnels.
      </p>
      <p>Un grand merci pour votre engagement; la qualité de l’information publiée sur Soliguide est essentielle.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%<i/></p>
      ${RGPD_FOOTER}`,
      subject: "🥶 Mettez à jour vos informations d’hiver sur Soliguide",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, je n’ai pas eu de retour suite à mon précédent mail ?</p>
      <p>Votre structure est référencée sur Soliguide et nous avons besoin de savoir si les informations publiées sont correctes. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet hiver (fermetures temporaires etc) ?</strong></p>
      <p>Sans réponse de votre part, nous devrons passer votre fiche hors ligne (non visible par les utilisateurs) afin de garantir la qualité de notre base de données 🥶</p>
      <p>
        👉 Si vous n’avez <strong>pas de changement</strong> ou pas encore l’information, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.<br>
        👉 Si vous avez un changement à faire, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.<br>
        👉 Si vous n’êtes pas le bon interlocuteur, n’hésitez pas à transférer ce mail ou nous répondre directement.
      </p>
      <p>Je reste bien entendu disponible si besoin,</p>
      <p>Merci d’avance et excellente journée.</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%.</i></p>
      ${RGPD_FOOTER}`,
      subject: "🥶 Pas de nouvelles, bonnes nouvelles ?",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, je n’ai pas eu de retour suite à mon précédent mail ?</p>
      <p>Votre structure est référencée sur Soliguide et nous avons besoin de savoir si les informations publiées sont correctes. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet hiver (fermetures temporaires etc) ?</strong></p>
      <p>👉 Vous pouvez modifier ces informations via votre <strong>compte Soliguide (gratuit)</strong>. Pour créer un compte, il suffit de <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>cliquer sur le lien suivant</u></strong></a>.</p>
      <p>Cette mise à jour est très importante ; elle permet de garantir une bonne information sur notre site et donc aux utilisateurs. Sans réponse, nous serons malheureusement contraints de dépublier vos fiches ( non visibles par les utilisateurs).</p>
      <p>
        👉 Je crée <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>mon compte Soliguide</u></strong></a>.
        👉 Si vous n’êtes <strong>pas le bon interlocuteur</strong>, n’hésitez pas à transférer ce mail ou nous répondre directement
      </p>
      <p>Je reste bien entendu disponible si besoin.</p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>
      ${RGPD_FOOTER}`,
      subject: "📅 Vous n’avez aucun changement cet hiver ?",
    },
    RELANCE_DESESPOIR_COMPTES_PRO: {
      content: `<p>Bonjour,</>
      <p>Vous avez actuellement des fiches présentant une ou plusieurs structures sur Soliguide.fr</p>
      <p>Sauf erreur, nous n’avons pas détecté d’action de votre part pour la mise à jour des informations 🥶.</p>
      <p><strong>Pouvez-vous vous assurer que les éléments renseignés sont à jour ?</strong></p>
      <p>
        👉 Si vous n’avez <strong>aucun changement</strong>, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.<br>
        👉 Si vous avez un changement à faire sur l'une de vos fiches, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.<br>
        👉 Si vous n’êtes pas le bon interlocuteur, n’hésitez pas à transférer ce mail ou nous répondre directement.
      </p>
      <p>Cette mise à jour est très importante ; elle permet de garantir une bonne information sur notre site et donc aux utilisateurs. Sans réponse, nous serons malheureusement contraints de dépublier vos fiches ( non visibles par les utilisateurs).</p>
      <p>Si vous avez des questions, n’hésitez pas à répondre à ce mail.</p>
      <p>À bientôt,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      ${RGPD_FOOTER}`,
      subject: "🌧️ Vos fiches sur Soliguide expirent prochainement",
    },
    RELANCE_DESESPOIR_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>J’ai tenté de vous joindre par téléphone car votre compte n’est toujours pas actif sur Soliguide.</p>
      <p>Le compte Soliguide est <strong>gratuit</strong> et permet de mettre à jour vos informations pour informer les bénéficiaires et professionnels de l’action sociale.</p>
      <p>
        👉 <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>Je crée mon compte Soliguide</u></strong></a>.
      </p>
      <p>Avec votre compte, vous pourrez <strong>mettre à jour les informations de votre lieu pour cet hiver</strong>. Sans réponse de votre part, nous devrons malheureusement passer la fiche hors ligne (donc non visible par vos bénéficiaires et professionnels de l’action sociale) afin de garantir la qualité de notre base de données.</p>
      <p>
        👉 <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation"><strong><u>Je mets mes informations à jour sur Soliguide</u></strong></a>.
      </p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>
      ${RGPD_FOOTER}`,
      subject: "⏰ Avez-vous activé votre compte Soliguide ?",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, vous n’avez pas terminé votre mise à jour sur Soliguide :</p>
      <p>
        👉 Pour poursuivre votre mise à jour, <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign"><strong><u>cliquez ici</u></strong></a>.
      </p>
      <p>Merci d’avance et excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      ${RGPD_FOOTER}`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  MAJ_HIVER_2023: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>L’hiver arrive à grands pas et c’est l’heure de la mise à jour de Soliguide !</p>
      <p><strong>Pourriez-vous vérifier vos informations sur Soliguide ?</strong> Si vous n’avez aucun changement, il est aussi important de l’indiquer.</p>
      <p>
        👉 Si vos informations sont à jour, que vous n’avez pas de changement ou pas encore l’information, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        👉 Si vous avez un changement à faire sur l’une ou plusieurs de vos fiches, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.
      </p>
      <p>Un grand merci pour votre coopération ; la qualité de l’information est essentielle !</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%. Des tutoriels sont disponibles sur <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=footer&utm_user_ic=%USER_ID%">la page aide</a></strong> de votre espace.</i></p>`,
      subject: "💪 Etes-vous prêts pour la mise à jour hiver de Soliguide ?",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Nous espérons que vous allez bien ? Votre organisation est répertoriée sur le site Soliguide.fr et nous voulons nous assurer que les informations sont à jour et précises.</p>
      <p>Afin de vérifier les informations publiées, vous pouvez <strong>accéder à votre compte sur Soliguide</strong> (promis tout est gratuit). Ce compte vous permet aussi d’avoir accès à des informations privilégiées comme un annuaire professionnel.</p>
      <p>
        👉 Pour créer <strong>votre compte Soliguide</strong>, il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.<br>
        👉 <strong>Vérifiez ensuite vos informations</strong> et indiquez si vous avez des changements temporaires pour cet hiver dans votre espace.
      </p>
      <p>
        <strong>Agissez dès maintenant</strong><br>
        Nous vous encourageons à vérifier ces informations le plus tôt possible pour maximiser l'efficacité de nos services auprès des personnes en difficulté et associations.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Et on vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf">ici</a></strong>.
      </p>
      <p>Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "💻 Inscrivez-vous sur Soliguide !",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>😿 je n’ai pas eu de retour suite à mon précédent mail ?</p>
      <p>Votre structure est référencée sur Soliguide et nous vous en remercions. Nous avons besoin de savoir si les informations publiées sont correctes et à jour. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des modifications pour cet hiver</strong> (fermetures temporaires etc) <strong>?</strong></p>
      <p>Sans réponse de votre part, nous devrons passer votre fiche hors ligne afin de garantir les bonnes orientations. Si vous n’avez aucun changement, il est important de l’indiquer aussi.</p>
      <p>
        👉 Si vos informations sont bien à jour, que vous n’avez pas de changement ou pas encore l’information, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        👉 Si vous avez un changement à faire, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.<br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
      </p>
      <p>Je reste bien entendu disponible si besoin,</p>
      <p>A bientôt.</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "🙋 Pas de nouvelles, bonnes nouvelles ?",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Votre structure est référencée sur le site Soliguide.fr et nous vous en remercions ! Nous avons besoin de savoir si les informations publiées sont correctes et à jour.</p>
      <p>
        <strong>🌟 Pourquoi cette vérification est essentielle ?</strong><br>
        - La fin d’année est une période où beaucoup de changements se produisent dans les horaires et services des structures,<br>
        - Les personnes en difficulté et acteurs de la Solidarité comptent sur des informations précises.
      </p>
      <p>
        <strong>🎯 Voici comment vous pouvez aider (2 étapes) :</strong><br>
        1. <strong>Créez votre compte Soliguide</strong> : il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.<br>
        2. <strong>Vérifiez et mettez à jour vos informations</strong> via le formulaire dédié de votre espace. Si les informations sont à jour et que vous n’avez aucun changement cet hiver, il est aussi important de l’indiquer.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain <strong>webinaire</strong> ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Et on vous partage toutes nos <strong>ressources et tutos <a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf">ici</a></strong>.
      </p>
      <p>Je reste bien entendu disponible si besoin. Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "📅 Vos informations sur Soliguide sont-elles à jour ?",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, vous n’avez pas terminé votre mise à jour sur Soliguide :</p>
      <p>
        👉 Pour finaliser votre mise à jour, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        Si vous n’avez aucun changement, il est important de l’indiquer aussi.
      </p>
      <p>Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  END_YEAR_2024: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Ding ding : C’est l’heure de la mise à jour de Soliguide !</p>
      <p><strong>Vérifiez vos informations en quelques minutes avec <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">ce formulaire</a></strong> Si vous n’avez aucun changement, il est important de l’indiquer.</p>
      <p>
        <strong>Pourquoi c’est important ?</strong><br>
        Des informations à jour facilitent l'accès à vos services pour les personnes en précarité, et les acteurs de la solidarité qui les orientent.
      </p>
      <p>
      <strong>C’est simple et rapide :</strong><br>
        👉 Si vous n’avez pas de changement, fermetures ou changement d'horaires exceptionnelles (congés) ou pas encore l’information, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        👉 Si vous avez un changement à faire, des fermetures temporaires ou des changements d'horaires à renseigner, sur l’une ou plusieurs de vos fiches, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.
      </p>
      <p>Un grand merci pour votre coopération ; la qualité de l’information est essentielle !</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%. Des tutoriels sont disponibles sur <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=footer&utm_user_ic=%USER_ID%">la page aide</a></strong> de votre espace.</i></p>`,
      subject: "😱 Etes-vous prêt.e.s pour la mise à jour Soliguide ?",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Votre organisation est répertoriée sur Soliguide[lien soliguide.fr] et nous voulons nous assurer que les informations sont bien à jour.</p>
      <p>Afin de vérifier les informations publiées, vous pouvez accéder à votre compte sur Soliguide (gratuit).</p>
      <p>
      <strong>Comment faire ?</strong><br>
        👉 Pour créer <strong>votre compte Soliguide</strong>, il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.<br>
        👉 <strong>Vérifiez ensuite vos informations</strong> et indiquez si vous avez des changements temporaires pour la fin d’année dans votre espace.
      </p>
      <p>
        <strong>Agissez dès maintenant</strong><br>
        Nous vous encourageons à vérifier ces informations le plus tôt possible pour maximiser l'efficacité de nos services auprès des personnes en difficulté et associations.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Et on vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf">ici</a></strong>.
      </p>
      <p>Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "💻 Inscrivez-vous sur Soliguide et actualisez vos informations",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Nous vous avons récemment sollicité pour savoir si les informations publiées de votre structure sont correctes et à jour. <strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des fermetures temporaires ou changement d’horaires ?</strong></p>
      <p>Sans retour, nous devrons passer votre fiche hors ligne afin de garantir les bonnes orientations. Si vous n’avez aucun changement, il est important de l’indiquer.</p>
      <p>
      <strong>Comment faire ?</strong><br>
        👉 Si vos informations sont bien à jour, que vous n’avez pas de changement, fermetures exceptionnelles (congés) ou pas encore l’information, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=no_changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        👉 Si vous avez un changement à faire, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.<br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
      </p>
      <p>Je reste bien entendu disponible si besoin,</p>
      <p>A bientôt.</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "🙋 Pas de nouvelles, bonnes nouvelles ?",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Nous vous avons récemment sollicité pour savoir si les informations publiées sur Soliguide sont correctes et à jour pour permettre d’orienter les publics.</p>
      <p>
        <strong>🌟 Pourquoi cette vérification est essentielle ?</strong><br>
        - La fin d’année est une période où beaucoup de changements se produisent dans les horaires et services des structures,<br>
        - Les personnes en difficulté et acteurs de la Solidarité comptent sur des informations précises et actualisées.
      </p>
      <p>
        <strong>🎯 Comment faire ?</strong><br>
        1. <strong>Créez votre compte Soliguide</strong> : il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.<br>
        2. <strong>Vérifiez et mettez à jour vos informations</strong> via le formulaire dédié de votre espace. Si les informations sont à jour et que vous n’avez aucun changement (fermetures temporaires ou autres), il est aussi important de l’indiquer.
      </p>
      <p>
        <strong>Aide et Support</strong><br>
        💻 Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain <strong>webinaire</strong> ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        💁 Et on vous partage toutes nos <strong>ressources et tutos <a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf">ici</a></strong>.
      </p>
      <p>Je reste bien entendu disponible si besoin. Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "📅 Vos informations sur Soliguide sont-elles à jour ?",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,</p>
      <p>Sauf erreur, vous n’avez pas terminé votre mise à jour sur Soliguide :</p>
      <p>
        👉 Pour finaliser votre mise à jour, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        Si vous n’avez aucun changement, il est important de l’indiquer aussi.
      </p>
      <p>Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
  MID_YEAR_2025: {
    CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Vous avez une structure référencée sur Soliguide.</p>
      <p>👉<strong>Prenez quelques minutes pour vérifier les informations publiées depuis <a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">ce formulaire</a>.</strong> Indiquez également vos <strong>fermetures ou changements pour cet été.</strong></p>
      <p>
        🌞 <strong>Pourquoi c’est important ?</strong><br>
        L’été approche, et il est essentiel que les personnes en difficulté puissent compter sur des informations fiables, ainsi que celles et ceux qui les orientent.
      </p>
      <p>
      🎯 <strong>Votre mission :</strong><br>
      <ol>
        <li>Vérifier les informations de votre structure</li>
        <li>Les corriger si besoin</li>
        <li>Indiquer vos périodes de fermeture estivale ou toute autre information utile</li>
        </ol>
      </p>
      <p>👉 Cliquez ici pour accéder au <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">formulaire de mise à jour</a></strong></p>
      <p>
        <strong>💻 Aide et Support</strong><br>
      <ul>
        <li>Pour vous aider à remplir le formulaire, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        <li>On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.
      </ul>
        </p>
      <p>Un grand merci pour votre mobilisation !</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "😱 Prêt pour la mise à jour Soliguide ?",
    },
    CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Votre organisation est répertoriée sur <strong><a target="_blank" rel="noopener noreferrer" href="https://www.soliguide.fr">Soliguide</a></strong> et nous voulons nous assurer que les informations sont bien à jour.</p>
      <p>Afin de vérifier les informations publiées, vous pouvez accéder à votre compte sur Soliguide (gratuit).</p>
      <p>
      <strong>Comment faire ?</strong><br>
        👉 Pour créer <strong>votre compte Soliguide</strong>, il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.<br>
        👉 <strong>Vérifiez ensuite vos informations</strong> et indiquez si vous avez des changements temporaires pour cet été dans votre espace.
      </p>
      <p>
        <strong>Agissez dès maintenant</strong><br>
        Nous vous encourageons à vérifier ces informations le plus tôt possible pour maximiser l'efficacité de nos services auprès des personnes en difficulté et associations.
      </p>
      <p>
        <strong>💻 Aide et Support</strong><br>
      <ul>
        <li>Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        <li>On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.
      </ul>
      </p>
      <p>Excellente journée,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "💻 Inscrivez-vous sur Soliguide et actualisez vos informations",
    },
    RELANCE_CAMPAGNE_COMPTES_PRO: {
      content: `<p>Bonjour,</p>
      <p>Nous vous avons récemment sollicité pour savoir si les informations publiées de votre structure sont correctes et à jour sur Soliguide.</p>
      <p><strong>Pourriez-vous vérifier vos informations et indiquer si vous avez des fermetures temporaires ou d’autres changements pour cet été ?</strong></p>
      <p>
      <strong>🌞 Comment faire ?</strong><br>
      <ol>
        <li> Vérifier les informations de votre structure</li>
        <li> Les corriger si besoin</li>
        <li> Indiquer vos périodes de fermeture estivale ou toute autre information utile</li>
      </ol>
      </p>
      <p>👉 Cliquez ici pour accéder à votre <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=changes&utm_user_ic=%USER_ID%">formulaire de mise à jour</a></strong></p>
      <p>
        <strong>💻 Aide et Support</strong><br>
        💁 Pour vous aider à la prise en main de votre compte, on vous partage nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.<br>
        💻 Participez aussi à notre prochain webinaire spécial mise à jour. Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
      </p>
      <p>À très vite,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "🌞 Aidez-nous à garder Soliguide à jour pour cet été",
    },
    RELANCE_CAMPAGNE_INVITATIONS: {
      content: `<p>Bonjour,</p>
      <p>Nous vous avons récemment sollicité pour savoir si les informations publiées sur Soliguide sont correctes et à jour.</p>
      <p>
        <strong>🌟 Pourquoi cette vérification est essentielle ?</strong><br>
        <ul>
        <li>L’été est une période où beaucoup de changements se produisent dans les horaires et services des structures,</li>
        <li>Les personnes en difficulté et acteurs de la Solidarité comptent sur des informations précises et actualisées.</li>
      </ul>
      </p>
      <p>
        <strong>🎯 Comment faire ?</strong><br>
        <ol>
        <li> <strong>Créez votre compte Soliguide</strong> : il suffit de <strong>cliquer sur <a target="_blank" rel="noopener noreferrer" href="https://lien_invitation?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=create_account&utm_user_ic=%USER_ID%">ce lien</a></strong>.</li>
        <li> <strong>Vérifiez et mettez à jour vos informations</strong> via le formulaire dédié de votre espace. Si les informations sont à jour et que vous n’avez aucun changement (fermetures temporaires ou autres), il est aussi important de l’indiquer.</li>
        </ol>
      </p>
      <p>
        <strong>💻 Aide et Support</strong><br>
      <ul>
        <li>Pour vous aider à créer votre compte et découvrir les fonctionnalités, on vous invite à notre prochain webinaire ! Pour s’inscrire, c’est par <strong><a target="_blank" rel="noopener noreferrer" href="https://zoom.us/webinar/register/7216898420109/WN_gn7lx7IsTneAkRo5DW2qtQ#/">ici</a></strong>.<br>
        <li>On vous partage toutes nos ressources et tutos <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/aide?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_location=chore_message&utm_user_ic=%USER_ID%">ici</a></strong>.
      </ul>
      </p>
      <p>À très vite,</p>
      <p>%NOM_SOLIGUIDE%.</p>
      <p><i>Une question ? un problème ? écrivez-nous à %EMAIL_SOLIGUIDE%</i></p>`,
      subject: "🌞 Aidez-nous à garder Soliguide à jour pour cet été",
    },
    RELANCE_TERMINER_MAJ: {
      content: `<p>Bonjour,</p>
      <p>Vous n’avez pas terminé votre mise à jour sur Soliguide :</p>
      <p>
        👉 Pour finaliser votre mise à jour, <strong><a target="_blank" rel="noopener noreferrer" href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_user_ic=%USER_ID%">cliquez ici</a></strong>.<br>
        Si vous n’avez aucun changement, il est important de l’indiquer aussi.
      </p>
      <p>Merci pour votre mobilisation !</p>
      <p>%NOM_SOLIGUIDE%.</p>`,
      subject: "💪 Terminez votre mise à jour sur Soliguide",
    },
  },
};

export const REMIND_ME_CAMPAIGN_MAILS_CONTENT: CampaignEmailTemplatesContent = {
  REMIND_ME: {
    content: `<p>Bonjour, </p>
    <p>Vous avez indiqué que vous vouliez être rappelé pour mettre à jour vos structures sur Soliguide à cette date.</p>
    <p>Vous pouvez cliquer sur <a href="https://soliguide.fr/fr/campaign?utm_source=soliguide&utm_medium=$email&utm_campaign=%CAMPAIGN_NAME%&utm_term=%EMAIL_TYPE%&utm_content=remind_me&utm_user_ic=%USER_ID%">ce lien</a> pour les mettre à jour.</p>
    <p>Merci pour votre aide.</p>
    <p>Nous vous souhaitons une excellente journ&eacute;e.</p>
    <p>%NOM_SOLIGUIDE%</p>
    <p>
      <i>Une question ? un problème ? écrivez-nous à </i><strong>%EMAIL_SOLIGUIDE%</strong><i>. Des tutoriels sont disponibles sur </i
      ><a target="_blank" rel="noopener noreferrer" href="https://www.solinum.org/wp-content/uploads/2021/12/Tutoriel-utilisation-des-comptes-professionnels-Soliguide.pdf"
        ><i><strong>la page aide</strong></i></a
      ><i> de votre espace. </i>
    </p>
    ${RGPD_FOOTER}`,
    subject: "Rappel de mise à jour de vos structures",
  },
};
