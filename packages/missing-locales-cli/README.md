# @borertm/missing-locales-cli

A command line interface for finding missing keys in locales using the @borertm/missing-locales-core package.

## Installation

```shell
npm install @borertm/missing-locales-cli
```

```shell
yarn add @borertm/missing-locales-cli
```

```shell
pnpm add @borertm/missing-locales-cli
```

## Usage

```shell
@borertm/missing-locales-cli [options]
```

## Options

- `-p, --path <path>`: Path to the locales folder.
- `-l, --log-prefix <prefix>`: Log prefix for the output.

## API

- `path` - Type: `string` (optional, default is `'./src/locales'`): the path to the locales directory.
- `logPrefix` - Type: `string` (optional, default is `[missing-locales/cli]`): Log prefix for the output.

## Output

Object containing the output string and the missing keys array.

__Example__

```shell
[missing-locales/cli] en/main.json:
--> 'any.key1'
--> 'any.key2'
[missing-locales/cli] Total: 2
```

## License

MIT
