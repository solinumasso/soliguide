import { UcFirstPipe } from "./uc-first.pipe";

describe("UcFirstPipe", () => {
  it("Test the pipe results with different strings", () => {
    const pipe = new UcFirstPipe();
    expect(pipe).toBeTruthy();

    let result = pipe.transform("test");
    expect(result).toBe("Test");

    result = pipe.transform("");
    expect(result).toBe("");

    result = pipe.transform(" test");
    expect(result).toBe(" test");

    result = pipe.transform("Test");
    expect(result).toBe("Test");
  });
});
