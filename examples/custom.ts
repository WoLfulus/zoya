import { red } from "chalk";
import {
  badge,
  DefaultOptions,
  label,
  Level,
  message,
  scope,
  separator,
  zoya
} from "../src";

const custom = zoya({
  fields: [
    scope({
      scopes: ["xmas"]
    }),
    separator({
      separator: "~>"
    }),
    label(),
    badge(),
    message()
  ],
  types: {
    ...DefaultOptions.types,
    santa: {
      level: Level.info,
      options: {
        badge: "santa",
        label: {
          name: "SANTA",
          transformer: (text: string) => red(text)
        }
      }
    }
  }
});

custom.santa("Hohoho!");
custom.info("This comes from the default options");
