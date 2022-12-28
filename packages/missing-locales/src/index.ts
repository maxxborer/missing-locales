import fs from "fs";
import path from "path";

interface MissingLocalesOptions {
  path?: string;
  defaultNamespace?: string;
}

export const getJsonFiles = (pathDir: string): string[] => {
  return fs
    .readdirSync(pathDir)
    .reduce((files: string[], file: string) => {
      const name = path.join(pathDir, file);
      return fs.statSync(name).isDirectory()
        ? [...files, ...getJsonFiles(name)]
        : [...files, name];
    }, [])
    .filter((file: string) => file.endsWith(".json"));
};

export const getKeys = (files: string[]): string[] => {
  return files.reduce((acc: string[], file: string) => {
    const content = fs.readFileSync(file, "utf8");
    const json: unknown = JSON.parse(content);
    const keys: string[] = Object.keys(json as Record<string, unknown>);
    return [...acc, ...keys];
  }, []);
};

export const getLocales = (pathDir: string): string[] => {
  return fs
    .readdirSync(pathDir)
    .filter((name: string) =>
      fs.statSync(path.join(pathDir, name)).isDirectory(),
    );
};

/**
 * @class MissingLocale
 * @type {Object}
 * @property {string} locale - locale name
 * @property {string} namespace - namespace name
 * @property {string} key - key name
 */

export const getMissedKeys = ({
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
          missedKeys.push({ locale, namespace, key, });
        }
      }
    }
  }
  return missedKeys;
};

/**
 * `missingLocales`
 *
 * Script for finding missed keys in localization in `src/locales/{locale}/*.json` or another path.
 *
 * The search is conducted through all files ending in `*.json` in the `src/locales/` directory and nested directories `{locale}/`.
 *
 * `src/locales` may contain directories with localizations, such as en, ua, ru, and these directories contain namespace files, such as `common.json`, `auth.json`.
 * @param options
 * @param {string} options.path - path to locales folder
 * @param {string} options.defaultNamespace - default namespace
 * @returns {MissingLocale} - missed keys object {locale, namespace, key}
 */
export default function missingLocales(options?: MissingLocalesOptions) {
  const dirPath = options?.path || "./src/locales";
  const defaultNamespace = options?.defaultNamespace || "translation";

  const localesPath = path.resolve(dirPath);
  if (!fs.existsSync(localesPath)) {
    throw new Error(`\x1b[31m[missing-locales] Error: localesPath not exist\x1b[0m`);
  }
  const files = getJsonFiles(localesPath);
  return getMissedKeys({
    files,
    keys: getKeys(files),
    locales: getLocales(localesPath),
    defaultNamespace,
  });
}
