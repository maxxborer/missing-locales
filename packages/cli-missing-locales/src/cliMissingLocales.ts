import missingLocales from "@borerteam/missing-locales";
import type { MissingLocalesTranslation } from "@borerteam/missing-locales";

export type CliMissingLocalesProps = {
  path?: string;
  logPrefix?: string;
};

export type CliMissingLocalesArgs = CliMissingLocalesProps;

export type CombinedMissingKeys = {
  path?: string;
  keys?: MissingLocalesTranslation[];
};

export type CliMissingLocalesResult = {
  output: string;
  missingKeys: MissingLocalesTranslation[];
};

export default function cliMissingLocales(props?: CliMissingLocalesProps): CliMissingLocalesResult {
  const path = props && props.path;
  const logPrefix = (props && props.logPrefix) || "[cli-missing-locales]";

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
