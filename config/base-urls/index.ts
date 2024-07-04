import {TestEnv, TestEnvArg} from "../environments";

export const getBaseUrlConfig = (env: TestEnvArg) => {
    switch (env.name as keyof typeof TestEnv) {
        case "dev":
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const module = require(`./env/${env.name}`);
            return module.config;
        default:
            env.validation("Base urls", true);
    }
};

export * from "./schema";