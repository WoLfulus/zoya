import { red } from "chalk";
import log, { Level } from "../src";

const enhanced = log.enhance({
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
});

enhanced.santa("Hohoho!");
enhanced.info("Old instance logger still works");
