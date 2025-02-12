import 'dotenv/config';
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    DATABASE_URL: string;

    JWT_SECRET: string;

    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),

    JWT_SECRET: joi.string().required(),

    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),
})
.unknown(true)

const {error, value} = envsSchema.validate ( process.env );

if (error){
    throw new Error(`config validation error: ${error.message}`);
}

const envVars: EnvVars = value;
console.log('🔍 JWT_SECRET CARGADOen envs:', process.env.JWT_SECRET);
export const envs = {
    port: envVars.PORT,
    databaseurl: envVars.DATABASE_URL,

    jwtSecret: envVars.JWT_SECRET,

    usersMicroserviceHost: envVars.USERS_MICROSERVICE_HOST,
    usersMicroservicePort: envVars.USERS_MICROSERVICE_PORT, 
}