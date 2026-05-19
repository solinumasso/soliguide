describe("ThemeService", () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it("CURRENT_DATA not defined in html (in window)", () => {
    windowSpy.mockImplementation(() => ({}));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(() => require("./theme.service").themeService.getTheme()).toThrow(
      new Error("Theme not defined")
    );
  });

  it("Theme not defined in html (in window)", () => {
    windowSpy.mockImplementation(() => ({
      CURRENT_DATA: {},
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(() => require("./theme.service").themeService.getTheme()).toThrow(
      new Error("Theme not defined")
    );
  });

  it("Theme defined wrongly in html (in window)", () => {
    windowSpy.mockImplementation(() => ({
      CURRENT_DATAS: {
        THEME: "foo bar",
      },
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(() => require("./theme.service").themeService.getTheme()).toThrow(
      new Error("Theme not defined")
    );
  });

  it("Theme should be text from html (in window)", () => {
    windowSpy.mockImplementation(() => ({
      CURRENT_DATA: {
        THEME: "foo bar",
      },
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(require("./theme.service").themeService.getTheme()).toBe("foo bar");
  });
});
