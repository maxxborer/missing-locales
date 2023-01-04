import fs from "fs";
import { resolve } from "path";
import type { Plugin, ViteDevServer } from "vite";
import { core } from "@boergrp/missing-locales-cli";
import type { CoreCliMissingLocalesProps } from "@boergrp/missing-locales-cli";
import debounce from "./debounce";

interface VitePluginMissingLocalesProps extends CoreCliMissingLocalesProps {
  wait?: number;
  path?: string;
  hot?: boolean;
}

/**
 * Vite plugin that helps find missing locales in Vite projects.
 * @param options - Options for the plugin.
 * @param options.wait - The amount of time to wait in milliseconds before running the plugin after a change is detected. Defaults to 300.
 * @param options.path - The path to the locales files. Defaults to "./src/locales".
 * @param options.hot - Whether to run the plugin in hot mode. If true, the plugin will run after the specified wait time after any change is detected. If false, the plugin will run only if files in the locales path are changed. Defaults to false.
 * @returns A Vite plugin that can be installed in a Vite project.
 */
export default function viteMissingLocales(options?: VitePluginMissingLocalesProps): Plugin {
  const path: string = resolve(options?.path || "./src/locales");
  const wait: number = options?.wait || 300;
  const hot: boolean = options?.hot || false;

  const showMissedKeys = () => {
    fs.access(path, function (err) {
      if (err) {
        console.log(`\x1b[31m[missing-locales/vite] Error: path not exist\x1b[0m`);
      } else {
        core({
          path: path,
          logPrefix: "[missing-locales/vite]",
        });
      }
    });
  };

  return {
    name: "missing-locales/vite",
    configResolved: hot ? debounce(showMissedKeys, wait) : () => {},
    configureServer(server: ViteDevServer) {
      server.watcher.on("change", (id) => {
        if (!!id.startsWith(path)) {
          server.config.logger.info("locales file changed, searching missing locales...", {
            clear: true,
            timestamp: true,
          });
          return debounce(showMissedKeys, wait)();
        }
      });
    },
  };
}
