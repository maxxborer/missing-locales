# @borertm/missing-locales-core

A utility for finding missing keys in locales.

## Installation

```shell
npm install @borertm/missing-locales-core
```

```shell
yarn add @borertm/missing-locales-core
```

```shell
pnpm add @borertm/missing-locales-core
```

## Usage

```js
import missingLocales from "@borertm/missing-locales-core";

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

- [Repository](https://github.com/borertm/missing-locales/packages/missing-locales-core)
- [Issues](https://github.com/borertm/missing-locales/issues)
- [NPM](https://www.npmjs.com/package/@borertm/missing-locales-core)
