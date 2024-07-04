import { TestEnv, TestEnvArg } from "../environments";
import { UserConfigs } from "./schema";

const getUserConfigs = (env: TestEnvArg):  UserConfigs | undefined => {
    switch (env.name as keyof typeof TestEnv) {
        case "dev":
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const userModule = require(`./env/${env.name}`);
            return userModule;
        default:
            env.validation("User config");
            return undefined;
    }
};

export { getUserConfigs, UserConfigs };