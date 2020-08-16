import { gray } from "chalk";
import stringify = require("safe-json-stringify");
import { Field, FieldTextTransformer, IField, IMessage } from "../message";

/**
 * Context config
 */
export interface IContextConfig {
  name?: string;
  transformer?: FieldTextTransformer;
}

/**
 * Context field
 * @param config Field configuration
 */
export default function ({
  name = "context",
  transformer = (value) => gray(value),
}: IContextConfig = {}): Field {
  return function handler(message: IMessage): IField | null {
    if (typeof message.context === "undefined") {
      return null;
    }
    return {
      data: message.context,
      name,
      text: transformer(stringify(message.context, null, 2)),
    };
  };
}
