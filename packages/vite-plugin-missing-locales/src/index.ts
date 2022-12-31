import fs from "fs";
import { resolve } from "path";
import { missingLocales } from "@borerteam/cli-missing-locales";
import type { CliMissingLocalesProps } from "@borerteam/cli-missing-locales";
import debounce from "./debounce";

type VitePlugin = import("vite").Plugin;

interface VitePluginMissingLocalesProps extends CliMissingLocalesProps {
  wait?: number;
  path?: string;
  hot?: boolean;
}

export default function viteMissingLocales(options?: VitePluginMissingLocalesProps): VitePlugin {
  const path: string = options?.path || "";
  const wait: number = options?.wait || 300;
  const hot: boolean = options?.hot || false;

  const showMissedKeys = () => {
    const localesPath = !!path ? resolve(path) : undefined;
    if (localesPath ? fs.existsSync(localesPath) : false) {
      console.log(`\x1b[31m[vite-plugin-missing-locales] Error: localesPath not exist\x1b[0m`);
    } else {
      missingLocales({
        path: localesPath,
        logPrefix: "[vite-plugin-missing-locales]",
      });
      console.log("\x1b[32m[vite-plugin-missing-locales] Done\x1b[0m");
    }
  };

  return {
    name: "vite-plugin-missing-locales",
    load: !hot ? debounce(showMissedKeys, wait) : () => {},
    configResolved: hot ? debounce(showMissedKeys, wait) : () => {},
  };
}
