# @borertm/missing-locales/cli

A Vite plugin that helps you find missed keys in your localization files.

## Installation

```bash
npm install @borertm/missing-locales/cli
```

```bash
yarn add @borertm/missing-locales/cli
```

```bash
pnpm add @borertm/missing-locales/cli
```

## Usage

Add the plugin to your `vite.config.js` file:

```js
import missingLocales from '@borertm/missing-locales/cli';

export default {
  // ...other options
  plugins: [
    // ...other plugins
    // `command === 'serve'` for run plugin only in dev mode
    command === 'serve' && missingLocales({
      path: './src/locales', // optional, default is './src/locales'
      wait: 500, // optional, default is 500 (milliseconds),
      defaultNamespace: 'translation', // optional, default is 'translation'
    }),
  ],
};
```

## Options

- `path` (optional, default is `'./src/locales'`): the path to the `src/locales` directory.
- `wait` (optional, default is `500`): the number of milliseconds to wait before running the plugin.
- `defaultNamespace` (optional, default is `'translation'`): the default namespace to use when the namespace is not specified.

## Output

The plugin will output a list of strings in the following format:

```log
[missing-locales/cli] ${locale}/${namespace}.json -> '${key}'
```

For example:

```log
[missing-locales/cli] en/common.json -> 'hello'
[missing-locales/cli] ua/auth.json -> 'login'
[missing-locales/cli] ru/error.json -> 'help'
```

This indicates that the `'hello'` key is missing from the `en/common.json` file.
