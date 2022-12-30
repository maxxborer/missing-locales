import { Command } from "commander";
import { version } from "../package.json";
import cliMissingLocales from "./cliMissingLocales";
import type {
  CliMissingLocalesProps,
  CliMissingLocalesArgs,
  CombinedMissingKeys,
  CliMissingLocalesResult,
} from "./cliMissingLocales";

const program = new Command();
const options: CliMissingLocalesProps = program
  .version(version)
  .option("-p, --path <path>", "Path to the locales folder")
  .option("-l, --log-prefix <prefix>", "Log prefix for the output")
  .parse()
  .opts();

cliMissingLocales(options);

export { CliMissingLocalesProps, CliMissingLocalesArgs, CombinedMissingKeys, CliMissingLocalesResult };
export default cliMissingLocales;
