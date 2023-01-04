# @boergrp/missing-locales-core

A utility for finding missing keys in locales.

## Installation

```shell
npm install @boergrp/missing-locales-core
```

```shell
yarn add @boergrp/missing-locales-core
```

```shell
pnpm add @boergrp/missing-locales-core
```

## Usage

```js
import missingLocales from "@boergrp/missing-locales-core";

const missingKeys = missingLocales({ path: "src/locales" });
console.log(missingKeys);

// [
//   {
//     key
//     namespace
//     locale
//     path
//   },
//   ...
// ]
```

## API

- `path` - Type: `string` (optional, default is `'./src/locales'`): the path to the locales directory.

## License

MIT

## Links

- [Repository](https://github.com/boergrp/missing-locales/packages/missing-locales-core)
- [Issues](https://github.com/boergrp/missing-locales/issues)
- [NPM](https://www.npmjs.com/package/@boergrp/missing-locales-core)
