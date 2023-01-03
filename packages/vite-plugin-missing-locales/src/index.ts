import fs from "fs";
import { resolve } from "path";
import type { Plugin, ViteDevServer } from "vite";
import { core } from "@borertm/missing-locales-cli";
import type { CoreCliMissingLocalesProps } from "@borertm/missing-locales-cli";
import debounce from "./debounce";

interface VitePluginMissingLocalesProps extends CoreCliMissingLocalesProps {
  wait?: number;
  path?: string;
  hot?: boolean;
}

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
