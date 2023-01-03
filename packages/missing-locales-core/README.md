# @borert/missing-locales-core

A utility for finding missing keys in locales.

## Installation

```shell
npm install @borert/missing-locales-core
```

```shell
yarn add @borert/missing-locales-core
```

```shell
pnpm add @borert/missing-locales-core
```

## Usage

```js
import missingLocales from "@borert/missing-locales-core";

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

- [Repository](https://github.com/borert/missing-locales/packages/missing-locales-core)
- [Issues](https://github.com/borert/missing-locales/issues)
- [NPM](https://www.npmjs.com/package/@borert/missing-locales-core)
