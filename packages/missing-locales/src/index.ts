import * as fs from "fs";
import { join, resolve } from "path";
import v8 from "v8";
import compareObjects from "./compareObjects";
import type { JSONValue } from "./compareObjects";

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

export default function missingLocales({ path: pathProp }: MissingLocalesProps): MissingLocalesTranslation[] {
  const defaultRootDir = "src/locales";
  const rootDir = pathProp || defaultRootDir;

  const locales: string[] = [];
  const namespaces: MissingLocalesNamespace[] = [];
  // const keys: KeyObject[] = [];
  const foundMissingKeys: MissingLocalesTranslation[] = [];
  // find all locales with directory check
  locales.push(
    ...fs.readdirSync(resolve(rootDir)).filter((name: string) => fs.statSync(join(rootDir, name)).isDirectory()),
  );

  // find all namespaces and nesting namespaces in locales folders with file check ending with .json and push with type Namespaces
  const getNamespaces = (pathDir: string, locale: string): MissingLocalesNamespace[] => {
    if (!fs.existsSync(pathDir)) return [];
    return fs
      .readdirSync(pathDir)
      .map((name: string) => {
        const path = name.split(".").shift() || "";
        const fullPath = join(pathDir, name);

        if (fs.statSync(fullPath).isDirectory()) {
          return { path, children: getNamespaces(fullPath, locale), locale };
        } else if (name.endsWith(".json")) {
          return { path, locale };
        }
      })
      .filter(Boolean) as MissingLocalesNamespace[];
  };

  locales.forEach((locale) => namespaces.push(...getNamespaces(join(rootDir, locale), locale)));
  if (namespaces.length === 0) return [];

  // find all missing keys and missing nested keys in namespaces between locales with for loop
  const namespacesNodes: MissingLocalesNamespace[] = structuredClone(namespaces);

  while (namespacesNodes.length > 0) {
    const namespaceNode = namespacesNodes.shift()!;
    const { path, children = undefined, nestPath = undefined, locale } = namespaceNode;

    if (children) {
      children.forEach((child) =>
        namespacesNodes.push({
          ...child,
          nestPath: nestPath ? `${nestPath}${folderSeparator}${path}` : path,
        }),
      );
      continue;
    }

    const namespacePath = (nestPath ? `${nestPath}${folderSeparator}${path}` : path).split(folderSeparator).join("/");

    const joinedPath = join(rootDir, locale, namespacePath);
    const namespaceFullPath = join(
      rootDir,
      locale,
      namespacePath + `${fs.existsSync(joinedPath) && fs.lstatSync(joinedPath).isDirectory() ? "" : ".json"}`,
    );

    const anotherNamespacesFullPath = locales
      .map((compareLocale) => {
        if (compareLocale === locale) return;
        const anotherJoinedPath = join(rootDir, compareLocale, namespacePath);
        return {
          path: join(
            rootDir,
            compareLocale,
            namespacePath +
              `${fs.existsSync(anotherJoinedPath) && fs.lstatSync(anotherJoinedPath).isDirectory() ? "" : ".json"}`,
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

      const namespaceObject = JSON.parse(fs.readFileSync(namespaceFullPath, "utf8")) as object;
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
