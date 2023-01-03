# @borert/vite-plugin-missing-locales

A Vite plugin that helps find missing locales in Vite projects.

## Installation

```shell
npm install @borert/vite-plugin-missing-locales
```

```shell
yarn add @borert/vite-plugin-missing-locales
```

```shell
pnpm add @borert/vite-plugin-missing-locales
```

## Usage

```js
import viteMissingLocales from "@borert/vite-plugin-missing-locales";

export default {
  plugins: [viteMissingLocales({
    path: "./src/locales",
    wait: 300,
    hot: false
  })],
};
```

## API

- `wait` - Type: `number` (optional, default is `'./src/locales'`): the amount of time to wait in milliseconds before running the plugin after a change is detected. Defaults to 300.
- `path` - Type: `string` (optional, default is `'./src/locales'`): the path to the locales directory.
- `hot` - Type: `boolean` (optional, default is `'./src/locales'`): whether to run the plugin in hot mode. If true, the plugin will run after the specified wait time after any change is detected. If false, the plugin will run only if files in the locales path are changed. Defaults to false.

## Output

Object containing the output string and the missing keys array.

```shell
[missing-locales/vite] en/main.json:
--> 'any.key1'
--> 'any.key2'
[missing-locales/vite] Total: 2
```

## License

MIT
