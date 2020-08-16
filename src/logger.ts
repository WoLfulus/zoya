import stringify = require("safe-json-stringify");
import * as util from "util";
import { Level } from "./levels";
import { IField, IMessage } from "./message";
import { IOptions, IStream, PartialOptions } from "./options";
import { IType, ITypes } from "./types";
import { arrayify } from "./utils";

/**
 * Logger types
 */
export type LoggerTypes = ITypes;

/**
 * Zoya logger function;
 */
export type LogDelegate = (message: any, context?: any) => void;

/**
 * Enhanced log type
 */
export type EnhancedLogger<T> = {
  [P in keyof T]: LogDelegate;
};

/**
 * Logger type
 */
export type Logger<T extends LoggerTypes> = LoggerBase<T> & EnhancedLogger<T>;

/**
 * Zoya
 */
export class LoggerBase<T extends LoggerTypes> {
  /**
   * Create a new logger
   * @param options
   * @param types
   */
  public static create<T extends LoggerTypes>(
    options: PartialOptions<T>
  ): Logger<T> {
    return new LoggerBase<T>(options) as Logger<T>;
  }

  /**
   * Options
   */
  private options: IOptions<T>;

  /**
   * Constructor
   * @param opts
   */
  private constructor(opts: PartialOptions<T>) {
    const { streams, types, ...options } = opts;

    const filledStreams: IStream[] = (streams || []).map(
      ({ stream, level }) => ({
        level: util.isNumber(level) ? level : options.level,
        stream,
      })
    );

    if (!filledStreams.length) {
      throw new Error("Can't create a zoya instance without any loggers");
    }

    const filledTypes: ITypes = Object.entries(types as ITypes)
      .map(([key, type]) => ({
        [key]: {
          id: key,
          level: type.level,
          options: type.options || {},
        },
      }))
      .reduce((previous, current) => Object.assign(previous, current));

    this.options = Object.assign(options, {
      streams: filledStreams,
      types: filledTypes,
    }) as Required<IOptions<T>>;

    Object.entries(this.options.types).forEach(([method, configuration]) => {
      Object.defineProperty(this, method, {
        value: this.writer.bind(this, { id: method, ...configuration }),
      });
    });
  }

  /**
   * Enhances the current logger with more logging types
   * @param types Additional types
   */
  public enhance<E extends LoggerTypes>(types: E): Logger<T & E> {
    const combinedTypes = Object.assign(this.options.types, types) as T & E;
    const combinedOptions: PartialOptions<T & E> = Object.assign(this.options, {
      types: combinedTypes,
    });
    const logger: any = new LoggerBase<T & E>(combinedOptions);
    return logger;
  }

  /**
   * Enables logging
   */
  public get enabled() {
    return this.options.enabled;
  }

  /**
   * Disables logging
   */
  public get disabled() {
    return !this.options.enabled;
  }

  /**
   * Enables logging
   */
  public enable() {
    this.options.enabled = true;
  }

  /**
   * Disables logging
   */
  public disable() {
    this.options.enabled = false;
  }

  /**
   * Message
   * @param message
   * @param streams
   * @param logLevel
   */
  private write(message: IMessage) {
    if (!this.options.enabled) {
      return;
    }
    const output = this.format(message);
    this.options.streams
      .filter(({ level }) => message.type.level >= (level as Level))
      .forEach(({ stream }) => {
        stream.write(output + "\n");
      });
  }

  /**
   * Formats a message
   */
  private format(message: IMessage): string {
    // Add registered fields
    message.fields.push(
      ...(this.options.fields
        .map((field) => arrayify(field(message)))
        .reduce((prev, curr) => prev.concat(curr))
        .filter(
          (field) => typeof field !== "undefined" && field != null
        ) as IField[])
    );

    let formatted = "";
    if (this.options.json) {
      const obj = message.fields
        .filter(({ name }) => typeof name !== "undefined")
        .map(({ name, data }) => ({ [name as string]: data }))
        .reduce((prev, curr) => Object.assign(prev, curr));
      formatted = stringify(obj);
    } else {
      formatted = message.fields
        .filter(({ text }) => typeof text !== "undefined")
        .map(({ text }) => text)
        .join(" ");
    }

    return formatted;
  }

  /**
   * Logger
   * @param type
   * @param scope
   * @param context
   */
  private writer(type: IType, message: string, context?: any): void {
    this.write({
      context,
      fields: [],
      message,
      type,
    });
  }
}
