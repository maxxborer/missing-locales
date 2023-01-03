import { Command } from "commander";
import { version } from "../../package.json";
import missingLocales, { compareObjects } from "@borertm/missing-locales-core";
import type { MissingLocalesTranslation } from "@borertm/missing-locales-core";

export type CoreCliMissingLocalesProps = {
  path?: string;
  logPrefix?: string;
};

export type CliMissingLocalesArgs = CoreCliMissingLocalesProps;

export type CombinedMissingKeys = {
  path?: string;
  keys?: MissingLocalesTranslation[];
};

export type CoreCliMissingLocalesResult = {
  output: string;
  missingKeys: MissingLocalesTranslation[];
};

export default function coreCliMissingLocales(props?: CoreCliMissingLocalesProps): CoreCliMissingLocalesResult {
  const path = props && props.path;
  const logPrefix = (props && props.logPrefix) || "[missing-locales/cli]";

  const missingKeys = missingLocales({ path });

  if (missingKeys.length === 0) {
    const output = `${logPrefix} No missing keys found`;
    console.log(output);
    return { output, missingKeys };
  }

  // combine errors by the same path
  const combinedMissingKeys = missingKeys.reduce(
    (acc, { path: missingKeyPath, locale, ...rest }: MissingLocalesTranslation) => {
      const found = acc.find((item) => item.path === missingKeyPath && locale === locale);
      if (found) {
        if (found.keys) {
          found.keys.push({ locale, ...rest });
        } else {
          found.keys = [{ locale, ...rest }];
        }
      } else {
        acc.push({
          path: missingKeyPath,
          keys: [{ locale, ...rest }],
        });
      }
      return acc;
    },
    [] as CombinedMissingKeys[],
  );

  const formattedOutput = combinedMissingKeys.map(({ path: missingKeyPath, keys }) => {
    const formattedKeys = keys?.length && keys.map(({ key }) => `--> '${key}'`).join("\r\n");
    return `${logPrefix} ${missingKeyPath || ""}:\r\n${formattedKeys || ""}`;
  });

  const output = formattedOutput.join("\r\n\n");
  console.log(output);
  console.log(`${logPrefix} Total: ${missingKeys.length}`);
  return { output, missingKeys };
}

export const cli = (logPrefix?: string) => {
  const program = new Command();
  const options: CoreCliMissingLocalesProps = program
    .version(version)
    .option("-p, --path <path>", "Path to the locales folder")
    .option("-l, --log-prefix <prefix>", "Log prefix for the output")
    .parse()
    .opts();

  coreCliMissingLocales({ ...options, ...(logPrefix && { logPrefix }) });
};

export { compareObjects };
