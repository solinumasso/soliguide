import { initializeCategoriesByTheme, Themes } from "./src";

beforeAll(() => {
  initializeCategoriesByTheme(Themes.SOLIGUIDE_FR);
});
