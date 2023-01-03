#!/usr/bin/env node

import fs from "fs";
import path from "path";
import semver from "semver";
import { execSync } from "child_process";

const baseDir = path.resolve("./packages");

let latestVersion = "0.0.0";

const bumpVersion = (flag, packageJsonPath) => {
  // Read the contents of the package.json file
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  // Get the current version
  const currentVersion = packageJson.version;

  // Update the version using the provided flag
  let newVersion;
  switch (flag) {
    case "alpha":
      newVersion = semver.inc(currentVersion, "prerelease", "alpha");
      break;
    case "beta":
      newVersion = semver.inc(currentVersion, "prerelease", "beta");
      break;
    case "patch":
      newVersion = semver.inc(currentVersion, "patch");
      break;
    case "minor":
      newVersion = semver.inc(currentVersion, "minor");
      break;
    case "major":
      newVersion = semver.inc(currentVersion, "major");
      break;
    default:
      console.error(`Invalid flag: ${flag}`);
      return;
  }

  // Update the package.json file with the new version
  packageJson.version = newVersion;
  latestVersion = semver.gt(newVersion, latestVersion) ? newVersion : latestVersion;
  let packageName = packageJson.name;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`Updated version ${packageName}:${newVersion}`);
};

// Get the flag from the command line arguments
const flag = process.argv[2];

// Find all package.json files in the src/packages directory
fs.readdirSync(baseDir).forEach((folder) => {
  // check is folder
  if (fs.lstatSync(path.join(baseDir, folder)).isDirectory()) {
    // get package.json
    const packageJsonPath = path.join(baseDir, folder, "package.json");
    // check package.json
    if (fs.existsSync(packageJsonPath) && fs.lstatSync(packageJsonPath).isFile()) {
      bumpVersion(flag, packageJsonPath);
    }
  }
});

try {
  // Commit the changes with the tag of the latest version
  execSync(`git add . && git commit -m "Update to version ${latestVersion}" && git tag ${latestVersion}`);
} catch (error) {
  console.error(`Error: ${error}`);
  console.log("Reverting changes...");

  // Revert the changes made to the repository
  execSync("git reset --hard");
}
