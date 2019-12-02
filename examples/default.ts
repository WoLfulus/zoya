// import log from "zoya";
import log from "../src";

log.trace("Hello from zoya!");
log.debug("Hello from zoya!");
log.info("Hello from zoya!");
log.warn("Hello from zoya!");
log.error("Hello from zoya!");
log.fatal("Hello from zoya!");

log.info("Hello from zoya!", {
  this: {
    is: {
      some: "context"
    }
  }
});
