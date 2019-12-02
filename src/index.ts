import { Logger, LoggerBase, LoggerTypes } from "./logger";
import { DefaultOptions, IDefaultTypes, PartialOptions } from "./options";

/**
 * Exports
 */
export * from "./fields/index";
export * from "./levels";
export * from "./logger";
export * from "./message";
export * from "./options";
export * from "./types";
export * from "./utils";

/**
 * Factory function
 * @param options
 * @param types
 */
export function zoya<T extends LoggerTypes>(
  options: PartialOptions<T> = {}
): Logger<T & IDefaultTypes> {
  return LoggerBase.create(
    Object.assign({}, DefaultOptions, options)
  ) as Logger<IDefaultTypes & T>;
}

/**
 * Default logger
 */
export default zoya();
