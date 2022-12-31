import path from "path";
import cliMissingLocales from "../src/cliMissingLocales";
import cli from "../test-utils/cli";
import type { CLIResult } from "../test-utils/cli";

describe("missingLocales props", () => {
  test("empty in locale folders", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_empty")),
    }).output;
    expect(missing).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("no missed in single locale", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_single-locale")),
    }).output;
    expect(missing).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("no missed", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_regular")),
    }).output;
    expect(missing).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("missing keys in both languages", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_missed-both")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] fr/translation.json:--> 'answer{}.one'[cli-missing-locales] uk/translation.json:--> 'answer{}.two'--> 'love.this.package'`,
    );
  });

  test("empty in some namespaces", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_some-ns")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] li/messages.json:--> 'ERROR: li/messages.json not found'[cli-missing-locales] li/errors.json:--> '500'[cli-missing-locales] ua/errors.json:--> '405{}.{message}'--> '405'`,
    );
  });

  test("missed in nested folders", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_nested")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] oneLang/test/none.json:--> 'ERROR: oneLang/test/none.json not found'[cli-missing-locales] oneLang/translation.json:--> 'answer{}.one'[cli-missing-locales] twoLang/test/all.json:--> 'asd'[cli-missing-locales] twoLang/translation.json:--> 'answer{}.four.key'--> 'answer{}.tree'--> 'answer{}.two'--> 'love.this.package'`,
    );
  });

  test("more languages", () => {
    const missing = cliMissingLocales({
      path: String(path.resolve("../../mock", "./locales_more-languages")),
    }).output;
    expect(String(missing).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] one/test/none.json:--> 'ERROR: one/test/none.json not found'[cli-missing-locales] one/test/testNS.json:--> 'ERROR: one/test/testNS.json not found'[cli-missing-locales] one/translation.json:--> 'package2'[cli-missing-locales] three/test/none.json:--> 'ERROR: three/test/none.json not found'[cli-missing-locales] three/test/all.json:--> 'ERROR: three/test/all.json not found'--> 'ERROR: three/test/all.json not found'[cli-missing-locales] three/translation.json:--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[cli-missing-locales] two/test/testNS.json:--> 'ERROR: two/test/testNS.json not found'[cli-missing-locales] two/test/all.json:--> 'asd'[cli-missing-locales] two/translation.json:--> 'package2'--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'`,
    );
  });
});

//====================================================================================================
const scriptPath = String(path.resolve("./dist/cli"));

describe("missingLocales args", () => {
  test("empty in locale folders", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_empty"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("no missed in single locale", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_single-locale"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("no missed", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_regular"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual("[cli-missing-locales] No missing keys found");
  });

  test("missing keys in both languages", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_missed-both"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] fr/translation.json:--> 'answer{}.one'[cli-missing-locales] uk/translation.json:--> 'answer{}.two'--> 'love.this.package'[cli-missing-locales] Total: 3`,
    );
  });

  test("empty in some namespaces", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_some-ns"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] li/messages.json:--> 'ERROR: li/messages.json not found'[cli-missing-locales] li/errors.json:--> '500'[cli-missing-locales] ua/errors.json:--> '405{}.{message}'--> '405'[cli-missing-locales] Total: 4`,
    );
  });

  test("missed in nested folders", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_nested"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] oneLang/test/none.json:--> 'ERROR: oneLang/test/none.json not found'[cli-missing-locales] oneLang/translation.json:--> 'answer{}.one'[cli-missing-locales] twoLang/test/all.json:--> 'asd'[cli-missing-locales] twoLang/translation.json:--> 'answer{}.four.key'--> 'answer{}.tree'--> 'answer{}.two'--> 'love.this.package'[cli-missing-locales] Total: 7`,
    );
  });

  test("more languages", async () => {
    const localePath = String(path.resolve("../../mock", "./locales_more-languages"));
    const result = (await cli(scriptPath, ["-p", localePath])) as CLIResult;
    expect(String(result?.stdout).replace(/(\r\n|\n|\r)/gm, "")).toEqual(
      `[cli-missing-locales] one/test/none.json:--> 'ERROR: one/test/none.json not found'[cli-missing-locales] one/test/testNS.json:--> 'ERROR: one/test/testNS.json not found'[cli-missing-locales] one/translation.json:--> 'package2'[cli-missing-locales] three/test/none.json:--> 'ERROR: three/test/none.json not found'[cli-missing-locales] three/test/all.json:--> 'ERROR: three/test/all.json not found'--> 'ERROR: three/test/all.json not found'[cli-missing-locales] three/translation.json:--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[cli-missing-locales] two/test/testNS.json:--> 'ERROR: two/test/testNS.json not found'[cli-missing-locales] two/test/all.json:--> 'asd'[cli-missing-locales] two/translation.json:--> 'package2'--> 'one{}.{nested.key, nested.key2}'--> 'one'--> 'package1'[cli-missing-locales] Total: 15`,
    );
  });
});
