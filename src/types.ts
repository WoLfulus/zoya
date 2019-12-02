import { Level } from "./levels";

/**
 * Zoya types
 */
export interface IType {
  id?: string;
  level: Level;
  options?: object;
}

/**
 * Type
 */
export interface ITypes {
  [name: string]: IType;
}
