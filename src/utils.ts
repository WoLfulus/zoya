import stripColor = require("strip-color");

/**
 * Arrayify a value
 * @param obj Value
 */
export function arrayify<T>(obj: T[] | T): T[] {
  if (typeof obj === "undefined") {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj;
  }
  return [obj];
}

/**
 * Gets the longest string
 * @param values
 */
export function longestLength(values: string[]): number {
  return values.reduce((a, b) => {
    const value = stripColor(b).length;
    return a > value ? a : value;
  }, 0);
}

/**
 * Left pads a value
 * @param value
 * @param length
 */
export function padStart(
  value: string,
  length: number,
  filler: string = " "
): string {
  if (filler.length <= 0) {
    return value;
  }
  if (value.length >= length) {
    return value;
  }
  if (String.prototype.padStart) {
    return value.padStart(length, filler);
  }
  length -= value.length;
  return `${filler.repeat(length / filler.length).substr(0, length)}${value}`;
}

/**
 * Right pads a value
 * @param value
 * @param length
 */
export function padEnd(
  value: string,
  length: number,
  filler: string = " "
): string {
  if (filler.length <= 0) {
    return value;
  }
  if (value.length >= length) {
    return value;
  }
  if (String.prototype.padEnd) {
    return value.padEnd(length, filler);
  }
  length -= value.length;
  return `${value}${filler.repeat(length / filler.length).substr(0, length)}`;
}
