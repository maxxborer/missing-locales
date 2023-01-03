import * as fs from "fs";
import * as path from "path";
import v8 from "v8";
import compareObjects from "./compareObjects";
import type { JSONValue } from "./compareObjects";

/**
 * Deep clones the given value using v8.serialize and v8.deserialize.
 * @param value - The value to clone.
 * @returns A deep copy of the given value.
 */
export function structuredClone<T>(obj: T): T {
  return v8.deserialize(v8.serialize(obj)) as T;
}

export type MissingLocalesNamespace = {
  locale: string;
  path: string;
  nestPath?: string;
  children?: MissingLocalesNamespace[];
};

export type MissingLocalesTranslation = {
  key: string;
  namespace: string;
  locale: string;
  path?: string;
};

export type MissingLocalesProps = {
  path?: string;
};

export const folderSeparator = "|";

/**
 * Find missing keys in locales
 * @param path - Path to locales folder (default: src/locales)
 * @returns Array of missing keys with namespace, locale and path to file
 * @example
 * ```ts
 * import missingLocales from "@borert/missing-locales";
 *
 * const missingKeys = missingLocales({ path: "src/locales" });
 *
 * console.log(missingKeys);
 *
 * // [
 * //   {
 * //     key
 * //     namespace
 * //     locale
 * //     path
 * //   }
 * // ]
 * ```
 */
export default function missingLocales({ path: pathProp }: MissingLocalesProps): MissingLocalesTranslation[] {
  const defaultRootDir = "src/locales";
  const rootDir = pathProp || defaultRootDir;

  const locales: string[] = [];
  const namespaces: MissingLocalesNamespace[] = [];
  // const keys: KeyObject[] = [];
  const foundMissingKeys: MissingLocalesTranslation[] = [];
  // find all locales with directory check
  // and push with type string
  const localesDirs: string[] = fs.readdirSync(String(path.resolve(rootDir))).filter((name: string) => {
    const fullPath = String(path.join(rootDir, name));
    return !!fs.statSync(fullPath).isDirectory();
  });

  locales.push(...localesDirs);

  // find all namespaces and nesting namespaces in locales folders with file check ending with .json and push with type Namespaces
  const getNamespaces = (pathDir: string, locale: string): MissingLocalesNamespace[] => {
    if (!fs.existsSync(pathDir)) return [];
    return fs
      .readdirSync(pathDir)
      .map((name: string) => {
        const dirPath = name.split(".").shift() || "";
        const fullPath = String(path.join(pathDir, name));

        if (fs.statSync(fullPath).isDirectory()) {
          return { path: dirPath, children: getNamespaces(fullPath, locale), locale };
        } else if (name.endsWith(".json")) {
          return { path: dirPath, locale };
        }
      })
      .filter(Boolean) as MissingLocalesNamespace[];
  };

  locales.forEach((locale) => namespaces.push(...getNamespaces(String(path.join(rootDir, locale)), locale)));
  if (namespaces.length === 0) return [];

  // find all missing keys and missing nested keys in namespaces between locales with for loop
  const namespacesNodes: MissingLocalesNamespace[] = structuredClone(namespaces);

  while (namespacesNodes.length > 0) {
    const namespaceNode = namespacesNodes.shift()!;
    const { path: dirPath, children = undefined, nestPath = undefined, locale } = namespaceNode;

    if (children) {
      children.forEach((child) =>
        namespacesNodes.push({
          ...child,
          nestPath: nestPath ? `${nestPath}${folderSeparator}${dirPath}` : dirPath,
        }),
      );
      continue;
    }

    const namespacePath = (nestPath ? `${nestPath}${folderSeparator}${dirPath}` : dirPath)
      .split(folderSeparator)
      .join("/");

    const joinedPath = String(path.join(rootDir, locale, namespacePath));
    const namespaceFullPath = String(
      path.join(
        rootDir,
        locale,
        namespacePath + `${fs.existsSync(joinedPath) && fs.lstatSync(joinedPath).isDirectory() ? "" : ".json"}`,
      ),
    );

    const anotherNamespacesFullPath = locales
      .map((compareLocale) => {
        if (compareLocale === locale) return;
        const anotherJoinedPath = String(path.join(rootDir, compareLocale, namespacePath));
        return {
          path: String(
            path.join(
              rootDir,
              compareLocale,
              namespacePath +
                `${fs.existsSync(anotherJoinedPath) && fs.lstatSync(anotherJoinedPath).isDirectory() ? "" : ".json"}`,
            ),
          ),
          locale: compareLocale,
        };
      })
      .filter(Boolean) as { path: string; locale: string }[];

    anotherNamespacesFullPath.forEach((anotherNamespaceFullPath) => {
      if (!fs.existsSync(anotherNamespaceFullPath.path))
        return foundMissingKeys.push({
          key: `ERROR: ${anotherNamespaceFullPath.locale + "/" + namespacePath + ".json"} not found`,
          namespace: namespacePath + ".json",
          locale: anotherNamespaceFullPath.locale,
          path: anotherNamespaceFullPath.locale + "/" + namespacePath + ".json",
        });

      // check for to avoid double search for same locales and namespaces
      if (anotherNamespaceFullPath.locale.localeCompare(locale) < 0) return;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const namespaceObject = JSON.parse(fs.readFileSync(namespaceFullPath, "utf8")) as object;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const anotherNamespaceObject = JSON.parse(fs.readFileSync(anotherNamespaceFullPath?.path, "utf8")) as object;

      const { missingInFirst, missingInSecond } = compareObjects(namespaceObject, anotherNamespaceObject);

      foundMissingKeys.push(
        ...missingInFirst.map((key) => ({
          key,
          namespace: namespacePath + ".json",
          locale,
          path: locale + "/" + namespacePath + ".json",
        })),
        ...missingInSecond.map((key) => ({
          key,
          namespace: namespacePath + ".json",
          locale: anotherNamespaceFullPath.locale,
          path: anotherNamespaceFullPath.locale + "/" + namespacePath + ".json",
        })),
      );
    });
  }

  return foundMissingKeys.sort((a, b) => (a.locale > b.locale ? 1 : -1));
}

export { compareObjects, JSONValue };
