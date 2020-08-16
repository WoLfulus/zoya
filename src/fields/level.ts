import { Field, IField, IMessage } from "../message";

/**
 * Level config
 */
export interface ILevelConfig {
  name?: string;
}

/**
 * Level field
 * @param config Field configuration
 */
export default function ({ name = "level" }: ILevelConfig = {}): Field {
  return function handler(message: IMessage): IField {
    return {
      data: message.type.level,
      name,
    };
  };
}
