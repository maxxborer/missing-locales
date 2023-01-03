import path from "path";
import coreCliMissingLocales from "../src/core";
import cli from "../../../utils/cli";
import type { CLIResult } from "../../../utils/cli";

describe("missingLocales props", () => {
  test("empty in locale folders", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_empty")),
    }).output;
    expect(missing).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("no missed in single locale", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_single-locale")),
    }).output;
    expect(missing).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("no missed", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_regular")),
    }).output;
    expect(missing).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("missing keys in both languages", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_missed-both")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] fr/translation.json:--> 'answer{}.one'[missing-locales/cli] uk/translation.json:--> 'answer{}.two'--> 'love.this.package'`,
    );
  });

  test("empty in some namespaces", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_some-ns")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] li/messages.json:--> 'ERROR: li/messages.json not found'[missing-locales/cli] li/errors.json:--> '500'[missing-locales/cli] ua/errors.json:--> '405{}.{message}'--> '405'`,
    );
  });

  test("missed in nested folders", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_nested")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] oneLang/test/none.json:--> 'ERROR: oneLang/test/none.json not found'[missing-locales/cli] oneLang/translation.json:--> 'answer{}.one'[missing-locales/cli] twoLang/test/all.json:--> 'asd'[missing-locales/cli] twoLang/translation.json:--> 'answer{}.four.key'--> 'answer{}.tree'--> 'answer{}.two'--> 'love.this.package'`,
    );
  });

  test("more languages", () => {
    const missing = coreCliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_more-languages")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] one/test/none.json:--> 'ERROR: one/test/none.json not found'[missing-locales/cli] one/test/testNS.json:--> 'ERROR: one/test/testNS.json not found'[missing-locales/cli] one/translation.json:--> 'package2'[missing-locales/cli] three/test/none.json:--> 'ERROR: three/test/none.json not found'[missing-locales/cli] three/test/all.json:--> 'ERROR: three/test/all.json not found'--> 'ERROR: three/test/all.json not found'[missing-locales/cli] three/translation.json:--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[missing-locales/cli] two/test/testNS.json:--> 'ERROR: two/test/testNS.json not found'[missing-locales/cli] two/test/all.json:--> 'asd'[missing-locales/cli] two/translation.json:--> 'package2'--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'`,
    );
  });
});

//====================================================================================================
const scriptPath = String(path.resolve("./dist"));

describe("missingLocales args", () => {
  test("empty in locale folders", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_empty"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("no missed in single locale", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_single-locale"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("no missed", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_regular"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[missing-locales/cli] No missing keys found");
  });

  test("missing keys in both languages", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_missed-both"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] fr/translation.json:--> 'answer{}.one'[missing-locales/cli] uk/translation.json:--> 'answer{}.two'--> 'love.this.package'[missing-locales/cli] Total: 3`,
    );
  });

  test("empty in some namespaces", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_some-ns"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] li/messages.json:--> 'ERROR: li/messages.json not found'[missing-locales/cli] li/errors.json:--> '500'[missing-locales/cli] ua/errors.json:--> '405{}.{message}'--> '405'[missing-locales/cli] Total: 4`,
    );
  });

  test("missed in nested folders", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_nested"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] oneLang/test/none.json:--> 'ERROR: oneLang/test/none.json not found'[missing-locales/cli] oneLang/translation.json:--> 'answer{}.one'[missing-locales/cli] twoLang/test/all.json:--> 'asd'[missing-locales/cli] twoLang/translation.json:--> 'answer{}.four.key'--> 'answer{}.tree'--> 'answer{}.two'--> 'love.this.package'[missing-locales/cli] Total: 7`,
    );
  });

  test("more languages", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_more-languages"));
    const result = (await cli("./", scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[missing-locales/cli] one/test/none.json:--> 'ERROR: one/test/none.json not found'[missing-locales/cli] one/test/testNS.json:--> 'ERROR: one/test/testNS.json not found'[missing-locales/cli] one/translation.json:--> 'package2'[missing-locales/cli] three/test/none.json:--> 'ERROR: three/test/none.json not found'[missing-locales/cli] three/test/all.json:--> 'ERROR: three/test/all.json not found'--> 'ERROR: three/test/all.json not found'[missing-locales/cli] three/translation.json:--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[missing-locales/cli] two/test/testNS.json:--> 'ERROR: two/test/testNS.json not found'[missing-locales/cli] two/test/all.json:--> 'asd'[missing-locales/cli] two/translation.json:--> 'package2'--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[missing-locales/cli] Total: 15`,
    );
  });
});
