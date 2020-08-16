import { white } from "chalk";
import { Field, FieldTextTransformer, IField, IMessage } from "../message";

import stringify = require("safe-json-stringify");

/**
 * Message config
 */
export interface IMessageConfig {
  name?: string;
  transformer?: FieldTextTransformer;
}

/**
 * Message field
 * @param config Field configuration
 */
export default function ({
  name = "message",
  transformer = (value) => white(value),
}: IMessageConfig = {}): Field {
  return function handler(message: IMessage): IField {
    return {
      data: message.message,
      name,
      text:
        typeof message.message === "object"
          ? transformer(stringify(message.message))
          : transformer(message.message),
    };
  };
}
