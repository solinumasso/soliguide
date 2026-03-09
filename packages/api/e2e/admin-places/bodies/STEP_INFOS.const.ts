import { CountryCodes } from "@soliguide/common";

export const STEP_INFOS_OK = {
  description:
    "<p>Sed vitae tincidunt arcu. Mauris mauris ex, blandit sit amet dolor ac, maximus fermentum est. Aliquam quis ligula mauris. Sed pretium porta faucibus. Etiam eros orci, malesuada eget pretium sodales, imperdiet in turpis. Nullam auctor aliquet eros, eu feugiat mauris fringilla sed. Maecenas viverra convallis leo ac dictum. Integer ut felis justo. Praesent erat augue, posuere</p><p>&nbsp;non ligula eget, euismod rhoncus nunc. Pellentesque justo justo, sodales eu odio sit amet, blandit tempus lacus. Aliquam eget dapibus lectus. Sed id leo sed massa egestas ultricies et vitae lacus. Mauris euismod nibh id felis molestie, a vestibulum elit gravida. Ut elit magna, fringilla ac velit faucibus, tristique vestibulum ligula. Phasellus dignissim tempor semper. Ut ac ante erat.</p>",
  entity: {
    facebook: "",
    fax: "",
    mail: "exemple@mail.com",
    phones: [
      {
        label: "Numéro de tel 1",
        phoneNumber: "0101010101",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
      {
        label: "Numéro de tel 2",
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
    website: "https://siteinternet.fr",
  },
  country: CountryCodes.FR,
  lieu_id: null,
  name: "[TEST] Seconde structure de test",
};

export const STEP_INFOS_FAIL = {
  description: "<p>TESTTESTTESTTESTTESTTEST</p>",
  entity: {
    facebook: "",
    fax: "",
    mail: "",
    phones: [{ label: null, phoneNumber: null, isSpecialPhoneNumber: false }],
    website: "",
  },
  lieu_id: null,
  name: undefined,
};

export const PATCH_STEP_INFOS_OK = {
  description: "<p>New description</p> ",
  entity: {
    facebook: "",
    fax: "",
    mail: "",
    phones: [
      {
        label: "Marcel",
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
    website: "",
  },
  lieu_id: null,
  name: "Une structure modifiée",
  country: CountryCodes.FR,
};

export const PATCH_STEP_INFOS_UPDATE_OK = {
  description: "<p>New description episode 2</p> ",
  entity: {
    facebook: "",
    fax: "",
    mail: "",
    phones: [
      {
        label: "Jean-Bertrand",
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
    website: "",
  },
  country: CountryCodes.FR,
  lieu_id: null,
  name: "Deux structure modifiée",
};
