import { TestEnv, TestEnvArg } from "config/environments";
import { CypressConfig, CypressEnvConfig } from "./schema";
import { getBaseUrlConfig } from "config/base-urls";
import { getUserConfigs } from "config/users";

export const defaultUserAgent = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1)",
    "AppleWebKit/537.36 (KHTML, like Gecko)",
    "Cypress/5.6.0 Chrome/88.0.4324.192 Safari/537.36",
].join(" ");

export const getEnvConfig = (env: TestEnvArg, envConfig?: CypressEnvConfig) => {
    let cypressConfig: CypressConfig | undefined = undefined;
    switch (env.name as keyof typeof TestEnv) {
        case "dev":
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const module = require(`./env/${env.name}`);
            cypressConfig = module.config;
            if (cypressConfig && envConfig) {
                cypressConfig.env = envConfig;
                if (!cypressConfig.userAgent) {
                    cypressConfig.userAgent = defaultUserAgent;
                }
            }
            break;
        default:
            env.validation("Cypress Config", true);
            break;
    }
    return cypressConfig;
};

export const getConfig = (env: TestEnvArg, baseConfig: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions => {
    const envConfig: CypressEnvConfig = {
        baseUrls: getBaseUrlConfig(env),
        users: getUserConfigs(env),
        environment: env.name,
        testTimeout: env.testTimeout,
    };
    const cypressConfig = getEnvConfig(env, envConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseConfig.env = cypressConfig?.env as any;
    baseConfig.userAgent = cypressConfig?.userAgent ?? null;
    baseConfig.baseUrl = cypressConfig?.baseUrl ?? null;

    return baseConfig;

};

export * from "./config";