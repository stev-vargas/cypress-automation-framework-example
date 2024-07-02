import {TestEnv, TestEnvArg} from "../environments";

export const getBaseUrlConfig = (env: TestEnvArg) => {
    switch (env.name as keyof typeof TestEnv) { 
        case "dev": 
            const module = require(`./env/${env.name}`)
    }
}