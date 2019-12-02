import * as utils from "../src/utils";

describe("utils", () => {
  describe("arrayify", () => {
    it("should return an empty array in case of undefined value", () => {
      expect(utils.arrayify(undefined as any)).toStrictEqual([]);
    });

    it("should transform values to array", () => {
      expect(utils.arrayify(0)).toStrictEqual([0]);
      expect(utils.arrayify("hello")).toStrictEqual(["hello"]);
      expect(utils.arrayify(false)).toStrictEqual([false]);
      expect(utils.arrayify(null)).toStrictEqual([null]);
      expect(utils.arrayify(1.0)).toStrictEqual([1.0]);
      expect(utils.arrayify({ a: 1, b: 2 })).toStrictEqual([{ a: 1, b: 2 }]);
    });

    it("should keep arrays as it is", () => {
      expect(utils.arrayify([])).toStrictEqual([]);
      expect(utils.arrayify([{ a: 1, b: 2 }])).toStrictEqual([{ a: 1, b: 2 }]);
      expect(utils.arrayify([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    });
  });

  describe("longest", () => {
    it("should return the longest string", () => {
      expect(utils.longestLength([])).toEqual(0);
      expect(utils.longestLength(["abc", "ab", "a"])).toEqual(3);
      expect(utils.longestLength(["a", "ab", "abc"])).toEqual(3);
      expect(utils.longestLength(["a", "b"])).toEqual(1);
    });
  });

  describe("padStart", () => {
    it("should fill the start of a string to the specified length", () => {
      expect(utils.padStart("hello", 10)).toEqual("     hello");
    });

    it("shouldn't cut a string if length is lower", () => {
      expect(utils.padStart("hello", 3)).toEqual("hello");
    });

    it("should fill with other strings", () => {
      expect(utils.padStart("hello", 10, "x")).toEqual("xxxxxhello");
    });

    it("should pad with lenthier values", () => {
      expect(utils.padStart("hello", 10, "xyz")).toEqual("xyzxyhello");
    });

    it("should do nothing if filler is empty", () => {
      expect(utils.padStart("hello", 10, "")).toEqual("hello");
    });

    it("should fallback on environments without String.prototype.padStart", () => {
      const padStart = String.prototype.padStart;
      delete String.prototype.padStart;
      expect(utils.padStart("hello", 10, "x")).toEqual("xxxxxhello");
      String.prototype.padStart = padStart;
    });
  });

  describe("padEnd", () => {
    it("should fill the start of a string to the specified length", () => {
      expect(utils.padEnd("hello", 10)).toEqual("hello     ");
    });

    it("shouldn't cut a string if length is lower", () => {
      expect(utils.padEnd("hello", 3)).toEqual("hello");
    });

    it("should fill with other strings", () => {
      expect(utils.padEnd("hello", 10, "x")).toEqual("helloxxxxx");
    });

    it("should pad with lenthier values", () => {
      expect(utils.padEnd("hello", 10, "xyz")).toEqual("helloxyzxy");
    });

    it("should do nothing if filler is empty", () => {
      expect(utils.padEnd("hello", 10, "")).toEqual("hello");
    });

    it("should fallback on environments without String.prototype.padEnd", () => {
      const padEnd = String.prototype.padEnd;
      delete String.prototype.padEnd;
      expect(utils.padEnd("hello", 10, "x")).toEqual("helloxxxxx");
      String.prototype.padEnd = padEnd;
    });
  });
});
