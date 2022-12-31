import path from "path";
import missingLocales from "../src";

describe("missingLocales", () => {
  test("empty in locale folders", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_empty")),
    });
    expect(missing).toEqual([]);
  });

  test("no missed in single locale", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_single-locale")),
    });
    expect(missing).toEqual([]);
  });

  test("no missed", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_regular")),
    });
    expect(missing).toEqual([]);
  });

  test("missing keys in both languages", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_missed-both")),
    });
    expect(missing).toEqual([
      {
        key: "answer{}.one",
        namespace: "translation.json",
        locale: "fr",
        path: "fr/translation.json",
      },
      {
        key: "answer{}.two",
        namespace: "translation.json",
        locale: "uk",
        path: "uk/translation.json",
      },
      {
        key: "love.this.package",
        namespace: "translation.json",
        locale: "uk",
        path: "uk/translation.json",
      },
    ]);
  });

  test("empty in some namespaces", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_some-ns")),
    });
    expect(missing).toEqual([
      {
        key: "ERROR: li/messages.json not found",
        namespace: "messages.json",
        locale: "li",
        path: "li/messages.json",
      },
      {
        key: "500",
        namespace: "errors.json",
        locale: "li",
        path: "li/errors.json",
      },
      {
        key: "405{}.{message}",
        namespace: "errors.json",
        locale: "ua",
        path: "ua/errors.json",
      },
      {
        key: "405",
        namespace: "errors.json",
        locale: "ua",
        path: "ua/errors.json",
      },
    ]);
  });

  test("missed in nested folders", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_nested")),
    });
    expect(missing).toEqual([
      {
        key: "ERROR: oneLang/test/none.json not found",
        namespace: "test/none.json",
        locale: "oneLang",
        path: "oneLang/test/none.json",
      },
      {
        key: "answer{}.one",
        namespace: "translation.json",
        locale: "oneLang",
        path: "oneLang/translation.json",
      },
      {
        key: "asd",
        namespace: "test/all.json",
        locale: "twoLang",
        path: "twoLang/test/all.json",
      },
      {
        key: "answer{}.four.key",
        namespace: "translation.json",
        locale: "twoLang",
        path: "twoLang/translation.json",
      },
      {
        key: "answer{}.tree",
        namespace: "translation.json",
        locale: "twoLang",
        path: "twoLang/translation.json",
      },
      {
        key: "answer{}.two",
        namespace: "translation.json",
        locale: "twoLang",
        path: "twoLang/translation.json",
      },
      {
        key: "love.this.package",
        namespace: "translation.json",
        locale: "twoLang",
        path: "twoLang/translation.json",
      },
    ]);
  });

  test("more languages", () => {
    const missing = missingLocales({
      path: String(path.resolve("../../mock", "./locales_more-languages")),
    });
    expect(missing).toEqual([
      {
        key: "ERROR: one/test/none.json not found",
        namespace: "test/none.json",
        locale: "one",
        path: "one/test/none.json",
      },
      {
        key: "ERROR: one/test/testNS.json not found",
        namespace: "test/testNS.json",
        locale: "one",
        path: "one/test/testNS.json",
      },
      {
        key: "package2",
        namespace: "translation.json",
        locale: "one",
        path: "one/translation.json",
      },
      {
        key: "ERROR: three/test/none.json not found",
        namespace: "test/none.json",
        locale: "three",
        path: "three/test/none.json",
      },
      {
        key: "ERROR: three/test/all.json not found",
        namespace: "test/all.json",
        locale: "three",
        path: "three/test/all.json",
      },
      {
        key: "ERROR: three/test/all.json not found",
        namespace: "test/all.json",
        locale: "three",
        path: "three/test/all.json",
      },
      {
        key: "one{}.{nested.key, nested.key2}",
        namespace: "translation.json",
        locale: "three",
        path: "three/translation.json",
      },
      {
        key: "one",
        namespace: "translation.json",
        locale: "three",
        path: "three/translation.json",
      },
      {
        key: "package1",
        namespace: "translation.json",
        locale: "three",
        path: "three/translation.json",
      },
      {
        key: "ERROR: two/test/testNS.json not found",
        namespace: "test/testNS.json",
        locale: "two",
        path: "two/test/testNS.json",
      },
      {
        key: "asd",
        namespace: "test/all.json",
        locale: "two",
        path: "two/test/all.json",
      },
      {
        key: "package2",
        namespace: "translation.json",
        locale: "two",
        path: "two/translation.json",
      },
      {
        key: "one{}.{nested.key, nested.key2}",
        namespace: "translation.json",
        locale: "two",
        path: "two/translation.json",
      },
      {
        key: "one",
        namespace: "translation.json",
        locale: "two",
        path: "two/translation.json",
      },
      {
        key: "package1",
        namespace: "translation.json",
        locale: "two",
        path: "two/translation.json",
      },
    ]);
  });
});
