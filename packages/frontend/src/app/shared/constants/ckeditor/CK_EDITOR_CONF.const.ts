import { THEME_CONFIGURATION } from "../../../models/themes";

export const CK_EDITOR_CONF = {
  toolbar: ["bold", "link", "italic", "bulletedList", "numberedList"],
  placeholder: "",
  language: THEME_CONFIGURATION.defaultLanguage,
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
    decorators: {
      openInNewTab: {
        mode: "manual",
        label: "Ouvrir dans un nouvel onglet",
        attributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      },
    },
  },
};
