export const SIGNUP_OK = {
  lastname: "Test",
  mail: "test@test.test",
  name: "test",
  password: "P4s$W0rD",
};

export const SIGNUP_FAIL = {
  lastname: "Test",
  mail: "non working email :'(",
  name: "test",
  password: "P4s$W0rD",
};

export const SIGNUP_TRANSLATOR_OK = {
  passwordConfirmation: "Azerty01!",
  languages: ["fa"],
  lastname: "traducteur",
  mail: "mathis01@soliguide.dev",
  name: "Mathis01",
  password: "Azerty01!",
  translator: true,
};

export const SIGNUP_TRANSLATOR_FAIL = {
  passwordConfirmation: "000",
  languages: ["fa"],
  lastname: "traducteur",
  mail: "mathis01@soliguide.dev",
  name: "Mathis01",
  password: "000",
  translator: true,
};
