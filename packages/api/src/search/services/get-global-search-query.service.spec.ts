import { User } from "../../_models";
import { getGlobalSearchQuery } from "./get-global-search-query.service";

describe("getGlobalSearchQuery", () => {
  it("Should return object with placeId and mail", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: 1,
        lieu_id: 19,
        mail: "aa@aa.fr",
      },
      ["lieu_id", "mail"],
      {} as User
    );

    expect(test).toEqual({
      lieu_id: 19,
      mail: {
        $options: "i",
        $regex: /.*aa@aa\.fr.*/,
      },
    });
  });

  it("Should return object without mail because it's empty", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: 1,
        lieu_id: 19,
        mail: "",
      },
      ["lieu_id", "mail"],
      {} as User
    );

    expect(test).toEqual({ lieu_id: 19 });
  });

  it("Should return object without mail because it's empty", () => {
    const test = getGlobalSearchQuery(
      {
        object: { key: "value" },
        lieu_id: 19,
        mail: "",
      },
      ["lieu_id", "mail", "object"],
      {} as User
    );

    expect(test).toEqual({ lieu_id: 19, object: { key: "value" } });
  });

  it("Should return object without null values", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: null,
        lieu_id: null,
        mail: "",
      },
      ["lieu_id", "mail", "xxx"],
      {} as User
    );

    expect(test).toEqual({});
  });
});
