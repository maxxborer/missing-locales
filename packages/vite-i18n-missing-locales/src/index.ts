import fs from "fs";
import path from "path";

interface ViteI18nMissingLocalesOptions {
  path?: string;
  wait?: number;
  defaultNamespace?: string;
}

type VitePlugin = import("vite").Plugin;

const getJsonFiles = (pathDir: string): string[] => {
  return fs
    .readdirSync(pathDir)
    .reduce((files: string[], file: string) => {
      const name = path.join(pathDir, file);
      return fs.statSync(name).isDirectory()
        ? [...files, ...getJsonFiles(name)]
        : [...files, name];
    }, [])
    .filter((file) => file.endsWith(".json"));
};

const getKeys = (files: string[]): string[] => {
  return files.reduce((acc: string[], file: string) => {
    const content = fs.readFileSync(file, "utf8");
    const json: unknown = JSON.parse(content);
    const keys: string[] = Object.keys(json as Record<string, unknown>);
    return [...acc, ...keys];
  }, []);
};

const getLocales = (pathDir: string): string[] => {
  return fs
    .readdirSync(pathDir)
    .filter((name: string) =>
      fs.statSync(path.join(pathDir, name)).isDirectory(),
    );
};

const getMissedKeys = ({
  files,
  keys,
  locales,
  defaultNamespace,
}: {
  files: string[];
  keys: string[];
  locales: string[];
  defaultNamespace: string;
}) => {
  const missedKeys = [];
  for (const locale of locales) {
    const localeFiles = files.filter(
      (file) => file.indexOf(`/${locale}/`) !== -1,
    );
    if (localeFiles.length) {
      const localeKeys = getKeys(localeFiles);
      const localeFolderName = localeFiles[0].split("/").pop() || "";
      const namespace = localeFolderName.split(".").shift() || defaultNamespace;
      for (const key of keys) {
        if (localeKeys.indexOf(key) === -1) {
          missedKeys.push(
            `[vite-plugin-missing-locales] ${locale}/${namespace}.json -> '${key}'`,
          );
        }
      }
    }
  }
  return missedKeys;
};

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  delay: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * `ViteI18nMissingLocales`
 * Script for finding missed keys in localization in `src/locales/{locale}/*.json`
 * The search is conducted through all files ending in `*.json` in the `src/locales/` directory and nested directories `{locale}/`
 * `src/locales` may contain directories with localizations, such as en, ua, ru, and these directories contain namespace files, such as `common.json`, `auth.json`
 * Output: a list of strings in the format - `[vite-plugin-missing-locales] ${locale}/${namespace}.json -> '${key}'`
 * Written with GitHub Copilot and ChatGPT :)
 * @param path - path to locales directory
 * @param wait - time to wait before run
 * @param defaultNamespace - default namespace
 * @returns console.log with missed keys
 * @example
 * ```ts
 * import { defineConfig } from "vite";
 * import viteI18nMissingLocales from "vite-plugin-missing-locales";
 * export default defineConfig({
 *  plugins: [
 *    viteI18nMissingLocales({
 *      path: "./src/locales",
 *      wait: 300,
 *      defaultNamespace: "translation",
 *    }),
 *   ],
 * });
 * ```
 */
export default function viteI18nMissingLocalesWith(
  options?: ViteI18nMissingLocalesOptions,
): VitePlugin {
  const dirPath = options?.path || "./src/locales";
  const waitBeforeRun = options?.wait || 300;
  const defaultNamespace = options?.defaultNamespace || "translation";

  // const firstRun = true;

  const showMissedKeys = () => {
    const localesPath = path.resolve(dirPath);
    if (!fs.existsSync(localesPath)) {
      console.log(
        `\x1b[31m[vite-plugin-missing-locales] Error: localesPath not exist\x1b[0m`,
      );
    } else {
      const files = getJsonFiles(localesPath);
      console.log(
        getMissedKeys({
          files,
          keys: getKeys(files),
          locales: getLocales(localesPath),
          defaultNamespace,
        }).join("\r\n"),
      );
      return console.log("\x1b[32m[vite-plugin-missing-locales] Done\x1b[0m");
    }
  };

  return {
    name: "vite-plugin-missing-locales",
    load: debounce(showMissedKeys, waitBeforeRun),
    // configResolved: firstRun
    //   ? debounce(showMissedKeys, waitBeforeRun)
    //   : undefined,
  };
}
