import { PassThrough } from "stream";
import defaultLogger, { Level, zoya } from "../src";

import stripColor = require("strip-color");

describe("configs", () => {
  /**
   * Default options
   */
  describe("default options", () => {
    const instance = zoya();

    it("default options should have logger enabled", () => {
      expect(instance.enabled).toBe(true);
    });

    it("can enable and disable the instance", () => {
      instance.disable();
      expect(instance.enabled).toBe(false);
      instance.enable();
      expect(instance.enabled).toBe(true);
      instance.disable();
      expect(instance.enabled).toBe(false);
    });
  });

  /**
   * Default options
   */
  describe("default logger", () => {
    it("can write to default loggers", () => {
      defaultLogger.trace("trace");
      defaultLogger.debug("debug");
      defaultLogger.info("info");
      defaultLogger.warn("warn");
      defaultLogger.error("error");
      defaultLogger.fatal("fatal");
    });
  });

  /**
   * Enhancements
   */
  describe("enhancements", () => {
    it("should enhance the existing logger", () => {
      const instance = zoya();
      const enhanced = instance.enhance({
        hello: {
          level: Level.info
        }
      });
      expect(instance.hello).toBeUndefined();
      expect(enhanced.hello).toBeInstanceOf(Function);
    });
  });

  /**
   * Custom options
   */
  describe("custom options", () => {
    /**
     * Create stream instance
     */
    const instance = zoya({
      enabled: false,
      level: Level.info
    });

    it("should be disabled", () => {
      expect(instance.enabled).toBe(false);
      expect(instance.disabled).toBe(true);
    });
  });

  /**
   * Streams
   */
  describe("stream writing", () => {
    function createInstance(settings = {}) {
      const data: string[] = [];
      const write = jest.fn((chunk: any) => {
        data.push(chunk);
        return true;
      });

      const writer = new PassThrough();
      writer.write = write;

      const instance = zoya(
        Object.assign(
          {
            enabled: true,
            level: Level.info,
            streams: [
              {
                level: Level.info,
                stream: writer
              }
            ]
          },
          settings
        )
      );

      return { data, instance };
    }

    it("should be disabled", () => {
      const { instance } = createInstance({ enabled: false });
      expect(instance.enabled).toBe(false);
      expect(instance.disabled).toBe(true);
    });

    it("should create even without invalid level", () => {
      createInstance({
        streams: [
          {
            level: "hello"
          }
        ]
      });
    });

    it("should not be able to create without a stream", () => {
      expect.assertions(1);
      try {
        createInstance({ streams: null });
      } catch (err) {
        expect(err.message).toBe(
          "Can't create a zoya instance without any loggers"
        );
      }
    });

    it("should not write to stream when disabled", () => {
      const { instance, data } = createInstance({ enabled: false });
      instance.info("hello");
      expect(data).toHaveLength(0);
    });

    it("should write to stream when enabled", () => {
      const { instance, data } = createInstance();
      instance.info("hello");
      expect(data).toHaveLength(1);
    });

    it("should respect the logging levels", () => {
      const { instance, data } = createInstance();
      instance.trace("hello");
      instance.debug("hello");
      instance.info("hello");
      instance.warn("hello");
      expect(data).toHaveLength(2);
    });

    it("should print json", () => {
      const { instance, data } = createInstance({
        json: true
      });
      instance.info("hello");
      expect(data).toHaveLength(1);
      expect(JSON.parse(data[0])).toStrictEqual({
        label: "info",
        level: 3,
        message: "hello",
        scope: ["zoya"]
      });
    });

    it("should print text", () => {
      const { instance, data } = createInstance();
      instance.info("hello");
      expect(stripColor(data[0])).toBe("[zoya] » 🔵  info    hello\n");
    });

    it("should print context", () => {
      const { instance, data } = createInstance();
      instance.info("hello", 12345);
      expect(stripColor(data[0])).toBe("[zoya] » 🔵  info    hello 12345\n");
    });
  });
});
