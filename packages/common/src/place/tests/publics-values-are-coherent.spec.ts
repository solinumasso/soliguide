import { Publics } from "../../publics/classes/Publics.class";
import { WelcomedPublics } from "../../publics";
import { publicsValuesAreCoherent } from "../../publics/functions/publics-values-are-coherent";
describe("Check if the 'publics' comply with rules", () => {
  it("Should return true because Welcomed publics = inconditionnal", () => {
    const defaultPublics = new Publics();
    expect(publicsValuesAreCoherent(defaultPublics)).toBeTruthy();
  });

  it("Should return true because publics is 'PREFERENTIAL', but whe don't have any changes in default values", () => {
    const defaultPublics = new Publics({
      accueil: WelcomedPublics.PREFERENTIAL,
    });
    expect(publicsValuesAreCoherent(defaultPublics)).toBeFalsy();
  });
  it("Should return false because publics is 'PREFERENTIAL', but age is different than default values", () => {
    const defaultPublics = new Publics({
      accueil: WelcomedPublics.PREFERENTIAL,
      age: {
        min: 19,
        max: 25,
      },
    });
    expect(publicsValuesAreCoherent(defaultPublics)).toBeTruthy();
  });
});
