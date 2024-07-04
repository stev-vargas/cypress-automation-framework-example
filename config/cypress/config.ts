/* eslint-disable @typescript-eslint/no-var-requires */
import { getConfig } from ".";
import { TestEnvArg } from "../environments";

type PluginEvents = Cypress.PluginEvents;
type PluginConfig = Cypress.PluginConfigOptions;

function setupNodeEvents(on: PluginEvents, config: PluginConfig): PluginConfig {
    on(
        "before:browser:launch",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (browser: { family?: string; name?: string; isHeadless?: boolean }, launchOptions: any) => {
            if (browser.family === "chromium" || browser.name === "chrome") {
                launchOptions.args.push("--disable-dev-shm-usage");
                if (browser.isHeadless) {
                    launchOptions.args.push("--headless=new");
                }
            }
            return launchOptions;
        },
    );

    on("task", {
        ...require("utils/custom/tasks"),
    });

    // Getting test environment name from environment variable.
    // Default added to allow common vscode plugins, e.g. cypress helper, to work.
    const env = ((config.env.environment ?? "stg") as string).toLowerCase();
    // Validation for environment config on a per module basis.
    const envValidation = (configName: string, throwException?: boolean): void => {
        if (throwException) {
            throw new Error(`ERROR: ${configName} config for the ${env} is required`);
        } else {
            console.log(`WARNING: ${configName} config is not supported. Value will be undefined.`);
        }
    };
    const envConfigArgs: TestEnvArg = {
        name: env,
        validation: envValidation,
        testTimeout: config.env.test_timeout,
    };
    if (config.env.cws === false) {
        config.chromeWebSecurity = false;
    }

    if (config.env.timeout) {
        config.defaultCommandTimeout = config.env.timeout;
        config.requestTimeout = config.env.timeout;
        config.responseTimeout = config.env.timeout;
    } else {
        const defaultTimeout = 60000;
        config.defaultCommandTimeout = defaultTimeout;
        config.requestTimeout = defaultTimeout;
        config.responseTimeout = defaultTimeout;
    }

    if (config.env.keepInMemory !== undefined && typeof config.env.keepInMemory === "number") {
        config.numTestsKeptInMemory = config.env.keepInMemory;
    } else {
        config.numTestsKeptInMemory = 15;
    }
    const envConfig = getConfig(envConfigArgs, config);
    require("@cypress/grep/src/plugin")(envConfig);
    return envConfig;
}

export interface TestProjectConfig {
    timeout?: number;
    viewport?: {
        height?: number;
        width?: number;
    };
    watch?: boolean;
    retries?: {
        runMode?: number;
        openMode?: number;
    };
    specPattern?: string;
    fixturesFolder?: string;
    chromeWebSecurity?: boolean;
}

export const genConfig = (config?: TestProjectConfig): Partial<PluginConfig> => {
    const cfg: Partial<PluginConfig> = {
        projectId: "q136vd",
        fixturesFolder: config?.fixturesFolder ?? "../../fixtures",
        screenshotsFolder: "../../artifacts/screenshots",
        videosFolder: "../../artifacts/videos",
        downloadsFolder: "../../artifacts/downloads",
        video: true,
        viewportHeight: config?.viewport?.height ?? 900,
        viewportWidth: config?.viewport?.width ?? 1800,
        requestTimeout: config?.timeout,
        defaultCommandTimeout: config?.timeout,
        responseTimeout: config?.timeout,
        watchForFileChanges: config?.watch ?? false,
        pageLoadTimeout: config?.timeout,
        execTimeout: config?.timeout,
        taskTimeout: config?.timeout,
        experimentalMemoryManagement: true,
        retries: {
            runMode: config?.retries?.runMode ?? 1,
            openMode: config?.retries?.openMode ?? 0,
        },
        e2e: {
            experimentalStudio: true,
            supportFile: "./support.ts",
            specPattern: config?.specPattern ?? "./tests/**/*.spec.ts",
            setupNodeEvents,
            chromeWebSecurity: config?.chromeWebSecurity ?? true,
        },
    };
    const debug = process.env.DEBUG;
    if (debug === "1") {
        console.log(cfg);
    }
    return cfg;
};


