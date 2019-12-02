import { zoya } from "../src";

describe("factory", () => {
  it("can create new instances", () => {
    const instance = zoya();
    expect(instance).toBeTruthy();
  });

  it("can create customized instances", () => {
    const instance = zoya({});
    expect(instance).toBeTruthy();
  });
});
