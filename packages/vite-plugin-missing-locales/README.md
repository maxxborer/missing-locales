# @borertm/missing-locales/vite

A Vite plugin that helps you find missed keys in your localization files.

## Installation

```bash
npm install @borertm/missing-locales/vite
```

```bash
yarn add @borertm/missing-locales/vite
```

```bash
pnpm add @borertm/missing-locales/vite
```

## Usage

Add the plugin to your `vite.config.js` file:

```js
import missingLocales from '@borertm/missing-locales/vite';

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
[missing-locales/vite] ${locale}/${namespace}.json -> '${key}'
```

For example:

```log
[missing-locales/vite] en/common.json -> 'hello'
[missing-locales/vite] ua/auth.json -> 'login'
[missing-locales/vite] ru/error.json -> 'help'
```

This indicates that the `'hello'` key is missing from the `en/common.json` file.
