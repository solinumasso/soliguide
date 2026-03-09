import { generateRegexTerritories } from "./territory-search.functions";

describe("Construction d'une regex sans ses options pour prendre en compte le fait qu'un utilisateur peut être sur plusieurs territoires", () => {
  describe("Utilisateur sur le 75, le 92, le 982 et le 2A", () => {
    const regexStr = generateRegexTerritories(["75", "92", "974", "2A"]);
    it("Renvoyer la chaîne '75\\d{3}|92\\d{3}'", () => {
      expect(regexStr).toBe("75\\d{3}|92\\d{3}|974\\d{2}|20\\d{3}");
    });

    it("Être valide, car on teste la RegExp avec un territoire contenu dedans", () => {
      const regex = new RegExp(regexStr, "i");
      expect(regex.test("75013")).toBe(true); // Paris 13ème
      expect(regex.test("20260")).toBe(true); // Calvi in south Corsica
      expect(regex.test("97400")).toBe(true); // Saint-Denis in lLa Réunion
    });
  });
});
