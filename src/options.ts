import { blue, gray, magenta, red, underline, yellow, green } from "chalk";
import { Writable } from "stream";
import {
  badge,
  context,
  label,
  level,
  message,
  scope,
  separator,
} from "./fields";
import { Level } from "./levels";
import { Field } from "./message";
import { IType, ITypes } from "./types";

/**
 * Stream
 */
export interface IStream {
  level?: Level;
  stream: Writable;
}

/**
 * Zoya options
 */
export interface IOptions<T extends ITypes> {
  json: boolean;
  enabled: boolean;
  streams: IStream[];
  fields: Field[];
  level: Level;
  types: T;
}

/**
 * Partial options
 */
export type PartialOptions<T extends ITypes> = Partial<IOptions<T>>;

/**
 * Default types
 */
export interface IDefaultTypes extends ITypes {
  trace: IType;
  debug: IType;
  info: IType;
  warn: IType;
  error: IType;
  fatal: IType;
}

/**
 * Default logger types
 */
export const DefaultTypes = {
  debug: {
    level: Level.debug,
    options: {
      badge: "beetle",
      label: {
        name: "debug",
        transformer: (text: string) => underline(magenta(text)),
      },
    },
  },
  error: {
    level: Level.error,
    options: {
      badge: "x",
      label: {
        name: "error",
        transformer: (text: string) => underline(red(text)),
      },
    },
  },
  failed: {
    level: Level.error,
    options: {
      badge: "x",
      label: {
        name: "failed",
        transformer: (text: string) => underline(red(text)),
      },
    },
  },
  fatal: {
    level: Level.fatal,
    options: {
      badge: "sos",
      label: {
        name: "fatal",
        transformer: (text: string) => underline(red(text)),
      },
    },
  },
  info: {
    level: Level.info,
    options: {
      badge: "large_blue_circle",
      label: {
        name: "info",
        transformer: (text: string) => underline(blue(text)),
      },
    },
  },
  success: {
    level: Level.info,
    options: {
      badge: "heavy_check_mark",
      label: {
        name: "success",
        transformer: (text: string) => underline(green(text)),
      },
    },
  },
  trace: {
    level: Level.trace,
    options: {
      badge: "stopwatch",
      label: {
        name: "trace",
        transformer: (text: string) => underline(gray(text)),
      },
    },
  },
  warn: {
    level: Level.warn,
    options: {
      badge: "warning",
      label: {
        name: "warning",
        transformer: (text: string) => underline(yellow(text)),
      },
    },
  },
};

/**
 * Default fields
 */
export const DefaultFields = [
  scope({
    scopes: ["zoya"],
  }),
  separator(),
  badge(),
  label({
    minLength: 7,
  }),
  level(),
  message(),
  context(),
];

/**
 * Default streams
 */
export const DefaultStreams = [
  {
    level: Level.all,
    stream: process.stdout,
  },
];

/**
 * Default options
 */
export const DefaultOptions: IOptions<IDefaultTypes> = {
  enabled: true,
  fields: DefaultFields,
  json: false,
  level: Level.info,
  streams: DefaultStreams,
  types: DefaultTypes,
};
