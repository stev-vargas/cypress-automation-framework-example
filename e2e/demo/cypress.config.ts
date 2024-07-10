import { defineConfig } from "cypress";
import { genConfig } from "config/cypress";

const pluginConfig = genConfig();
export default defineConfig(pluginConfig);