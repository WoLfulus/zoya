<div align="center">
  <img src="media/logo.png">
</div>

<h4 align="center">
  Truly highly composable logging utility written in TypeScript
</h4>

<div align="center">
  <img alt="Header" src="media/header.png" width="90%">
</div>

<p align="center">
  <a href="https://travis-ci.org/wolfulus/zoya">
    <img alt="Build Status" src="https://travis-ci.org/wolfulus/zoya.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/WoLfulus/zoya?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/WoLfulus/zoya/badge.svg?branch=master" />
  </a>
  <a href="https://www.npmjs.com/package/zoya">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/zoya">
  </a>
</p>

## Description

Zoya is a highly composable logging library used for both client and server applications.

Visit the [contributing guidelines](https://github.com/wolfulus/zoya/blob/master/contributing.md#translating-documentation) to learn more on how to translate this document into more languages.

Come over to [Discord](https://discord.gg/X7gp2kV) or [Twitter](https://twitter.com/wolfulus) to share your thoughts on the project.

> This is a complete rewrite of the awesome [Signale](https://github.com/klaussinani/signale) from [Klaus Siani](https://github.com/klaussinani), and it's **NOT** intended to be a drop-in replacement.

## Highlights

- Easy to setup and compose as you like
- Easy to control how things look
- Easy to extend
- Clean and beautiful output, configure as you wish
- Supports JSON outputs
- Extensible fields with several fields built in
  - Labels, Badge (emoji), Scopes, Level, Separators, Message, Context
- Multiple configurable writable streams with stream level filtering
- Simple and minimal syntax
- Written in TypeScript

## Contents

- [Description](#description)
- [Highlights](#highlights)
- [Contents](#contents)
- [Install](#install)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Related](#related)
- [Team](#team)
- [FAQ](#faq)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Install

### Yarn

```bash
yarn add zoya
```

### NPM

```bash
npm install zoya
```

## Usage

### Overview

Zoya tries to make it simple to configure and compose your loggers, so you can easily control how the output will look like. This is possible due to the field chain passed to the logger in its creation.

To use the default exported logger you just import and use it.

```ts
import zoya from "zoya";

zoya.info("Hello world!");
```

To see all the available examples check the [examples folder](./examples)

### Default logger

The default export of zoya is an instance of a logger (called the default logger). This instance is preconfigured to write to `process.stdout` with all logging levels enabled (so you can use `debug` and `trace` for example).

These are all the available loggers in the default logger.

```ts
import log from "zoya";

log.trace("trace messages...");
log.debug("debug messages...");
log.info("info messages...");
log.warn("warn messages...");
log.error("error messages...");
log.fatal("fatal messages...");
```

The fields configured in the default logger are:

> \[scope\]\[separator\]\[badge\]\[label\]\[level\]\[message\]\[context\]

More on _fields_ later.

#### On new instances

To create a new Zoya instance, use `zoya` function passing the proper configs you want. Note that all first level values uses the default values from the default logger, so you don't need to specify all of them if you want for example to just enable `json` logging.

Note that if you pass value to an object, for example `types`, all the child values are overwritten.

```ts
import { zoya, Level } from "zoya";

// Just enables json
const jsonLogger = zoya({ json: true });

// Only outputs to stderr
const stderrLogger = zoya({
  streams: [
    {
      level: Level.error,
      stream: process.stderr
    }
  ]
});
```

#### Enhancing loggers

Zoya allows you to enhance existing loggers in order to add new logging types. Enhancing logger will create a new logger instance and will keep the old logger intact.

```ts
import { bold, underline } from "chalk";
import log, { Level } from "zoya";

const xmasLogger = log.enhance({
  santa: {
    level: Level.info,
    options: {
      badge: "santa"
      label: {
        name: "santa",
        transformer: label => bold(underline(label))
      }
      scope: ["xmas"]
    }
  }
});

xmasLogger.santa("Hohoho!");
```

The above logger will output something like this

<pre>
<span style="color: gray;">[xmas] »</span> 🎅  <span style="color: red;"><u><strong>santa</strong></u></span> Hohoho!
</pre>

## Configuration

### Fields

Zoya has the concept of fields. All log messages are built by a chain of fields that are configured when creating a new logger through `zoya` function. Fields are context sensitive, this means that you can output different things in a field depending on what the message contains.

#### Configuring fields

For example, if you just want to show the message and its context, you can configure zoya like this:

```ts
import { context, message, zoya } from "zoya";

const custom = zoya({
  fields: [message(), context()]
});

custom.info("Hello world", { ip: "127.0.0.1" });
```

This will output something like this in text mode:

<pre>
Hello world {
  "ip": "127.0.0.1"
}
</pre>

And this in JSON mode:

<pre>{"message":"Hello world","context":{"ip":"127.0.0.1"}}</pre>

#### Zoya fields

Zoya contains several fields that can be imported from `zoya` package.

**Badge**

> Used to display emojis in the log text

**Context**

> Displays the message context

**Label**

> Displays a customizable label for each message type

**Level**

> Adds the message level only on json outputs

**Message**

> Displays the message itself

**Scope**

> Display the message scope(s)

**Separator**

> Displays a customizable separator only in text mode

---

#### Custom fields

You can easily write custom fields.

> TODO: write example custom fields. For now you can take the bundled ones as an example from [here](./src/fields).

## Development

For more info on how to contribute to the project, please read the [contributing guidelines](https://github.com/wolfulus/zoya/blob/master/contributing.md).

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd zoya`
- Install the project dependencies: `npm install` or `yarn install`
- Lint code for errors: `npm test` or `yarn test`

## Related

- [Signale](https://github.com/klaussinani/signale) - Highly configurable logging utility

## Team

- João Biondo [(@wolfulus)](https://github.com/wolfulus)

## FAQ

### Why "Zoya"?

Because I like [Trine](https://store.steampowered.com/franchise/Trine) :)

## Acknowledgements

### Thanks

Huge thanks to **brain** (brain#4221), **Micah** (Micha#6878) and **undefined.toString()** (elderapo#8225) for the helpful insights over [TypeScript discord channel](https://discord.gg/typescript)

## License

[MIT](https://github.com/wolfulus/zoya/blob/master/license.md)
