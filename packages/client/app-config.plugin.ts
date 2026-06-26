import { PluginOption } from "vite";

//Load .env file
import dotenv from "dotenv";
dotenv.config({ quiet: true });

import CONFIGURATION, { AppConfig } from "./components/common/lib/env";

//Data for public config endpoint
const appCfg = JSON.stringify({
  api: CONFIGURATION.DEFAULT_API_URL,
  gifbox: CONFIGURATION.DEFAULT_GIFBOX_URL,
} as AppConfig);

export default function appConfigPlugin(): PluginOption {
  return {
    name: "app-config",
    //For dev / serve mode
    configureServer(server) {
      server.middlewares.use("/stoat-config.json", (_, res) => {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(appCfg);
      });
    },
    //For static build
    buildStart() {
      //TODO: This throws warning "context method emitFile() is not supported in serve mode. This plugin is likely not vite-compatible."
      //Need to add a conditional and detect serve mode somehow
      this.emitFile({
        fileName: "stoat-config.json",
        source: appCfg,
        type: "asset",
      });
    },
  };
}
