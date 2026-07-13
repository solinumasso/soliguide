window.silktideConfig = {
  background: {
    showBackground: false,
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
        gtag("consent", "update", {
          security_storage: "granted",
        });
        dataLayer.push({
          event: "consent_accepted_necessary",
        });
      },
    },
    {
      id: "analytics",
      name: "Analytical",
      description:
        "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
      defaultValue: false,
      onAccept: function () {
        gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
        dataLayer.push({
          event: "consent_accepted_analytics",
        });
        dataLayer.push({
          event: "consent_accepted_advertising",
        });

        document.dispatchEvent(
          new CustomEvent("ConsentChanged", {
            detail: {
              type: "analytics",
              value: "granted",
            },
          })
        );
      },
      onReject: function () {
        gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });

        document.dispatchEvent(
          new CustomEvent("ConsentChanged", {
            detail: {
              type: "analytics",
              value: "denied",
            },
          })
        );
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

        document.dispatchEvent(
          new CustomEvent("ConsentChanged", {
            detail: {
              type: "chat",
              value: "granted",
            },
          })
        );
      },
      onReject: function () {
        gtag("consent", "update", {
          functionality_storage: "denied",
        });

        document.dispatchEvent(
          new CustomEvent("ConsentChanged", {
            detail: {
              type: "chat",
              value: "denied",
            },
          })
        );
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
    },
  },
  onPreferencesClose: function () {
    document.dispatchEvent(new Event("PreferencesClosed"));
  },
  onAcceptAll: function () {
    document.dispatchEvent(new Event("AcceptAll"));
  },
  onAcceptAllPreferences: function () {
    document.dispatchEvent(new Event("AcceptAllPreferences"));
  },
  onRejectAll: function () {
    document.dispatchEvent(new Event("RejectAll"));
  },
  onRejectAllPreferences: function () {
    document.dispatchEvent(new Event("RejectAllPreferences"));
  },
  onPreferencesCloseWithButton: function () {
    document.dispatchEvent(new Event("PreferencesClosedWithButton"));
  },
};
