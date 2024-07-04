import { UserConfigs } from "config/users";
import { BaseUrlConfigs } from "../base-urls/schema";

export interface CypressEnvConfig {
    baseUrls?: BaseUrlConfigs;
    users?: UserConfigs;
    environment: string;
    testTimeout?: number;
    responseDelay?: number;
    responseThrottle?: number;
}

export interface CypressConfig {
    env?: CypressEnvConfig;
    baseUrl: string;
    defaultCommandTimeout?: number;
    requestTimeout?: number;
    responseTimeout?: number;
    videoUploadOnPasses?: boolean;
    viewportHeight?: number;
    viewportWidth?: number;
    screenshotsFolder?: string;
    videosFolder?: string;
    chromeWebSecurity?: boolean;
    watchForFileChanges?: boolean;
    userAgent?: string;
    ignoreTestFiles?: string;
    numTestsKeptInMemory?: number;
}
