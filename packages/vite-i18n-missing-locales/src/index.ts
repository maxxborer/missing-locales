/*
 * Script for finding missed keys in localization in `src/locales/{locale}/*.json`
 * The search is conducted through all files ending in `*.json` in the `src/locales/` directory and nested directories `{locale}/`
 * `src/locales` may contain directories with localizations, such as en, ua, ru, and these directories contain namespace files, such as `common.json`, `auth.json`
 * Output: a list of strings in the format - `[missing-locale] ${locale}/${namespace}.json -> '${key}'`
 * Written with GitHub Copilot and ChatGPT :)
 */

import fs from "fs";
import path from "path";

function debounce<F extends (...args: any[]) => void>(fn: F, delay: number): F {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as F;
}

interface ViteI18nMissingLocalesOptions {
  path?: string;
  wait?: number;
}

type VitePlugin = import("vite").Plugin;

export default function viteI18nMissingLocales(
  options: ViteI18nMissingLocalesOptions
): VitePlugin {
  const { path: dirPath = "./src/locales", wait: waitBeforeRun = 500 } =
    options;
  let isFirstRun = true;

  return {
    name: "vite-i18n-missing-locales",
    load: debounce(() => {
      if (isFirstRun) {
        const localesPath = path.resolve(dirPath);
        if (!fs.existsSync(localesPath)) {
          return console.error(
            `\x1b[31m[vite-i18n-missing-locales] Error: locales path '${localesPath}' not found\x1b[0m`
          );
        }

        const locales = fs
          .readdirSync(localesPath)
          .filter((name: string) =>
            fs.statSync(path.join(localesPath, name)).isDirectory()
          );

        const getJsonFiles = (pathDir: string): string[] => {
          return fs
            .readdirSync(pathDir)
            .reduce(
              (
                files: string[],
                file: string,
                _currentIndex: number,
                _array: string[]
              ) => {
                const name = path.join(pathDir, file);
                return fs.statSync(name).isDirectory()
                  ? [...files, ...getJsonFiles(name)]
                  : [...files, name];
              },
              []
            )
            .filter((file) => file.endsWith(".json"));
        };

        const files = getJsonFiles(localesPath);

        const keys = files.reduce((keys: string[], file: string) => {
          const content = fs.readFileSync(file, "utf8");
          const json = JSON.parse(content);
          return [...keys, ...Object.keys(json)];
        }, []);

        const missedKeys = [];

        for (const locale of locales) {
          const localeFiles = files.filter(
            (file) => file.indexOf(`/${locale}/`) !== -1
          );
          if (localeFiles.length) {
            const localeKeys = localeFiles.reduce(
              (keys: string[], file: string) => {
                const content = fs.readFileSync(file, "utf8");
                const json = JSON.parse(content);
                return [...keys, ...Object.keys(json)];
              },
              []
            );
            const localeFolderName = localeFiles[0].split("/").pop() || "";
            const namespace = localeFolderName.split(".").shift();
            for (const key of keys) {
              if (localeKeys.indexOf(key) === -1) {
                missedKeys.push(
                  `[missing-locale] ${locale}/${namespace}.json -> '${key}'`
                );
              }
            }
          }
        }

        console.log(...missedKeys);
      } else {
        isFirstRun = false;
      }
    }, waitBeforeRun),
  };
}
