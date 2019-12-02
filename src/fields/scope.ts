import { gray } from "chalk";
import { Field, IField, IMessage } from "../message";

/**
 * Scope transformer
 */
export type ScopeTextTransformer = (scopes: string[]) => string;

/**
 * Scope configuration
 */
export interface IScopeConfig {
  name?: string;
  scopes?: string[];
  transformer?: ScopeTextTransformer;
}

/**
 * Scope options
 */
export interface IScopeOptions {
  scope?: string[];
}

/**
 * Scope field
 * @param config Field configuration
 */
export default function({
  name: defaultName = "scope",
  scopes: defaultScopes = ["zoya"],
  transformer: defaultTransformer = scopeList =>
    gray(scopeList.map(scope => `[${scope}]`).join(""))
}: IScopeConfig = {}): Field {
  return function handler(message: IMessage): IField {
    const options = message.type.options as IScopeOptions;
    const scope = (options || {}).scope || defaultScopes;
    return {
      data: defaultScopes,
      name: defaultName,
      text: defaultTransformer(scope)
    };
  };
}
