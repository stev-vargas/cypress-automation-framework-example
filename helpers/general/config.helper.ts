import { CypressEnvConfig } from "config/cypress/schema";
import { UserConfigs } from "config/users";

const getEnv = (): CypressEnvConfig => Cypress.env() as CypressEnvConfig;

const getUsers = (): UserConfigs => {
    const users = getEnv().users;
    if (!users) {
        throw new Error("Users not configured for environment.");
    }
    return users;
};

export { getEnv, getUsers };