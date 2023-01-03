#!/usr/bin/env node
import core, { cli, compareObjects } from "./core";
import type {
  CoreCliMissingLocalesProps,
  CliMissingLocalesArgs,
  CombinedMissingKeys,
  CoreCliMissingLocalesResult,
} from "./core";

cli();

export {
  CoreCliMissingLocalesProps,
  CliMissingLocalesArgs,
  CombinedMissingKeys,
  CoreCliMissingLocalesResult,
  core,
  compareObjects,
};
export default cli;
