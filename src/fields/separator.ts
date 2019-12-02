import { gray } from "chalk";
import { Field, FieldTextTransformer, IField, IMessage } from "../message";

/**
 * Separator config
 */
export interface ISeparatorConfig {
  separator?: string;
  transformer?: FieldTextTransformer;
}

/**
 * Separator field
 * @param config Field configuration
 */
export default function({
  separator = "»",
  transformer = value => gray(value)
}: ISeparatorConfig = {}): Field {
  const transformed = transformer(separator);
  return function handler(_: IMessage): IField {
    return { text: transformed };
  };
}
