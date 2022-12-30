# @borerteam/cli-missing-locales

A Vite plugin that helps you find missed keys in your localization files.

## Installation

```bash
npm install @borerteam/cli-missing-locales
```

```bash
yarn add @borerteam/cli-missing-locales
```

```bash
pnpm add @borerteam/cli-missing-locales
```

## Usage

Add the plugin to your `vite.config.js` file:

```js
import missingLocales from '@borerteam/cli-missing-locales';

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
[cli-missing-locales] ${locale}/${namespace}.json -> '${key}'
```

For example:

```log
[cli-missing-locales] en/common.json -> 'hello'
[cli-missing-locales] ua/auth.json -> 'login'
[cli-missing-locales] ru/error.json -> 'help'
```

This indicates that the `'hello'` key is missing from the `en/common.json` file.
