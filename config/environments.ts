export enum TestEnv {
    dev,
    stg
};

export interface TestEnvArg {
    name: string;
    validation: (configName: string, throwException?: boolean) => void;
    testTimeout?: number;
}