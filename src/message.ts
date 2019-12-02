import { IType } from "./types";

/**
 * Field
 */
export interface IField {
  name?: string;
  data?: any;
  text?: string;
  // options?: object;
}

/**
 * Middleware handler
 */
export type Field = (message: IMessage) => IField[] | IField | null;

/**
 * Field transformer
 */
export type FieldTextTransformer = (text: string) => string;

/**
 * Message interface
 */
export interface IMessage {
  type: IType;
  fields: IField[];
  message: string;
  context: any;
}

/**
 * Formatted message
 */
export interface IFormattedMessage {
  json: string;
  text: string;
}
