# vite-i18n-missing-locales

A Vite plugin that helps you find missed keys in your localization files in `src/locales/{locale}/*.json`.

## Installation

```bash
npm install vite-i18n-missing-locales
```

```bash
yarn add vite-i18n-missing-locales
```

```bash
pnpm add vite-i18n-missing-locales
```

## Usage

Add the plugin to your `vite.config.js` file:

```js
import viteI18nMissingLocales from 'vite-i18n-missing-locales';

export default {
  // ...other options
  plugins: [
    // ...other plugins
    // `command === 'serve'` for run plugin only in dev mode
    command === 'serve' && viteI18nMissingLocales({
      path: './src/localess', // optional, default is './src/localess'
      wait: 500, // optional, default is 500 (milliseconds)
    }),
  ],
};
```

## Options

- `path` (optional, default is `'./src/localess'`): the path to the `src/locales` directory.
- `wait` (optional, default is `500`): the number of milliseconds to wait before running the plugin.

## Output

The plugin will output a list of strings in the following format:

```log
[missing-locale] ${locale}/${namespace}.json -> '${key}'
```

For example:

```log
[missing-locale] en/common.json -> 'hello'
[missing-locale] ua/auth.json -> 'login'
[missing-locale] ru/error.json -> 'help'
```

This indicates that the `'hello'` key is missing from the `en/common.json` file.
