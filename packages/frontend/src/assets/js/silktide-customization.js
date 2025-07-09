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
    showBackground: false,
  },
  cookieIcon: {
    position: "bottomLeft",
  },
  cookieTypes: [
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
        console.log("Posthog cookies accepted");
      },
      onReject: function () {
        gtag("consent", "update", {
          analytics_storage: "denied",
        });

        console.log("Posthog cookies rejected");

        delete window.posthog;

        // !(function (t, e) {
        //   var o, n, p, r;
        //   e.__SV ||
        //     ((window.posthog = e),
        //     (e._i = []),
        //     (e.init = function (i, s, a) {
        //       function g(t, e) {
        //         var o = e.split(".");
        //         2 == o.length && ((t = t[o[0]]), (e = o[1])),
        //           (t[e] = function () {
        //             t.push(
        //               [e].concat(Array.prototype.slice.call(arguments, 0))
        //             );
        //           });
        //       }
        //       ((p = t.createElement("script")).type = "text/javascript"),
        //         (p.crossOrigin = "anonymous"),
        //         (p.async = !0),
        //         (p.src =
        //           s.api_host.replace(
        //             ".i.posthog.com",
        //             "-assets.i.posthog.com"
        //           ) + "/static/array.js"),
        //         (r =
        //           t.getElementsByTagName("script")[0]).parentNode.insertBefore(
        //           p,
        //           r
        //         );
        //       var u = e;
        //       for (
        //         void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
        //           u.people = u.people || [],
        //           u.toString = function (t) {
        //             var e = "posthog";
        //             return (
        //               "posthog" !== a && (e += "." + a),
        //               t || (e += " (stub)"),
        //               e
        //             );
        //           },
        //           u.people.toString = function () {
        //             return u.toString(1) + ".people (stub)";
        //           },
        //           o =
        //             "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(
        //               " "
        //             ),
        //           n = 0;
        //         n < o.length;
        //         n++
        //       )
        //         g(u, o[n]);
        //       e._i.push([i, s, a]);
        //     }),
        //     (e.__SV = 1));
        // })(document, window.posthog || []);
        // posthog.init(window.CURRENT_DATA.posthogApiKey, {
        //   api_host: "https://eu.i.posthog.com",
        //   persistence: "memory",
        //   autocapture: false,
        //   session_idle_timeout_seconds: 1800, // 30 minutes
        //   session_recording: {
        //     maskAllInputs: true,
        //     maskInputFn: function (text, element) {
        //       if (element && element.dataset.record === "true") {
        //         return text;
        //       }
        //       return "*".repeat(text.trim().length);
        //     },
        //   },
        // });
      },
    },
    {
      id: "chat",
      name: "Chat",
      description: "<p>These cookies provide the use of the chat.</p>",
      required: false,
      onAccept: function () {
        gtag("consent", "update", {
          functionality_storage: "granted",
        });
        dataLayer.push({
          event: "consent_accepted_chat",
        });

        var zE = window.zE;

        try {
          zE("messenger:set", "cookies", true);
          zE("messenger", "show");
        } catch (e) {}
      },
      onReject: function () {
        gtag("consent", "update", {
          functionality_storage: "denied",
        });

        var zE = window.zE;

        try {
          zE("messenger:set", "cookies", false);
          zE("messenger", "logoutUser");
        } catch (e) {}
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
