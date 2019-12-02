import { gray, underline } from "chalk";
import { Field, FieldTextTransformer, IField, IMessage } from "../message";
import { padEnd } from "../utils";

import stripColor = require("strip-color");

/**
 * Label options
 */
export interface ILabelOptionsValue {
  name?: string;
  transformer?: FieldTextTransformer;
}

/**
 * Label interface
 */
export interface ILabelOptions {
  label?: ILabelOptionsValue;
}

/**
 * Label configs
 */
export interface ILabels {
  [index: string]: ILabelOptionsValue;
}

/**
 * Normalized label
 */
interface INormalizedLabel {
  name: string;
  length: number;
  transformed: string;
  type: string;
}

/**
 * Field mapping
 */
interface IFields {
  [name: string]: IField;
}

/**
 * Field config
 */
export interface ILabelConfig {
  minLength?: number;
  transformer?: FieldTextTransformer;
  name?: string;
}

/**
 * Label field
 * @param config Field configuration
 */
export default function({
  minLength: defaultLength = 0,
  transformer: defaultTransformer = text => underline(gray(text)),
  name: defaultName = "label"
}: ILabelConfig = {}): Field {
  const labels: ILabels = {};
  let fields: IFields = {};

  const isLabelMissing = (id: string) => {
    return !(id in labels);
  };

  const registerLabel = (
    id: string,
    { name, transformer }: ILabelOptionsValue = {}
  ) => {
    labels[id] = normalizeLabel({
      name: name || id,
      transformer
    });
    refreshFields();
  };

  const refreshFields = () => {
    let highestLength = defaultLength;
    fields = Object.entries(labels)
      .map(
        ([type, { name, transformer }]): INormalizedLabel => {
          const transformed = (transformer as FieldTextTransformer)(
            name as string
          );
          const length = stripColor(transformed).length;
          if (length > highestLength) {
            highestLength = length;
          }
          return {
            length,
            name: name as string,
            transformed,
            type
          };
        }
      )
      .map(
        ({ type, length, transformed, name }): IFields => {
          return {
            [type]: {
              data: name,
              name: defaultName,
              text: padEnd(
                transformed,
                transformed.length + (highestLength - length)
              )
            }
          };
        }
      )
      .reduce((prev, curr) => Object.assign(prev, curr), {});
  };

  const normalizeLabel = ({
    name,
    transformer = defaultTransformer
  }: ILabelOptionsValue): ILabelOptionsValue => ({
    name,
    transformer
  });

  return function handler(message: IMessage): IField {
    const id = message.type.id || "";
    if (isLabelMissing(id)) {
      if (message.type.options) {
        const options = message.type.options as ILabelOptions;
        registerLabel(id, options.label as ILabelOptionsValue);
      } else {
        registerLabel(id, {});
      }
    }
    return fields[id];
  };
}
