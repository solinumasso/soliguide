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
silktideCookieBannerManager.updateCookieBannerConfig({
  background: {
    showBackground: true,
  },
  cookieIcon: {
    position: "bottomLeft",
  },
  cookieTypes: [
    {
      id: "necessary",
      name: "Necessary",
      description:
        "<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>",
      required: true,
      onAccept: function () {
        console.log("Add logic for the required Necessary here");
      },
    },
    {
      id: "analytics",
      name: "Analytical",
      description:
        "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
      defaultValue: true,
      onAccept: function () {
        gtag("consent", "update", {
          analytics_storage: "granted",
        });
        dataLayer.push({
          event: "consent_accepted_analytics",
        });
      },
      onReject: function () {
        gtag("consent", "update", {
          analytics_storage: "denied",
        });
      },
    },
    {
      id: "advertising",
      name: "Advertising",
      description:
        "<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>",
      onAccept: function () {
        gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
        dataLayer.push({
          event: "consent_accepted_advertising",
        });
      },
      onReject: function () {
        gtag("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      },
    },
  ],
  text: {
    banner: {
      description:
        '<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href="https://your-website.com/cookie-policy" target="_blank">Cookie Policy.</a></p>',
      acceptAllButtonText: "Accept all",
      acceptAllButtonAccessibleLabel: "Accept all cookies",
      rejectNonEssentialButtonText: "Reject non-essential",
      rejectNonEssentialButtonAccessibleLabel: "Reject non-essential",
      preferencesButtonText: "Preferences",
      preferencesButtonAccessibleLabel: "Toggle preferences",
    },
    preferences: {
      title: "Customize your cookie preferences",
      description:
        "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>",
      creditLinkText: "Get this banner for free",
      creditLinkAccessibleLabel: "Get this banner for free",
    },
  },
});
