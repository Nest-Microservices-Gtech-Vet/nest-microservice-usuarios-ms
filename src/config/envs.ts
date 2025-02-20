import 'dotenv/config';
import * as joi from 'joi'

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string,
    EMPRESAS_MICROSERVICE_HOST: string;
    EMPRESAS_MICROSERVICE_PORT: number;

    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT: number

}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    EMPRESAS_MICROSERVICE_HOST: joi.string().required(),
    EMPRESAS_MICROSERVICE_PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),
})
    .unknown(true)

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error('config validation error: ${error.message}');
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseurl: envVars.DATABASE_URL,
    secret: envVars.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ||'1h',
    empresasMicroserviceHost: envVars.EMPRESAS_MICROSERVICE_HOST,
    empresasMicroservicePort: envVars.EMPRESAS_MICROSERVICE_PORT,

    usersMicroserviceHost: envVars.USERS_MICROSERVICE_HOST,
    usersMicroservicePort: envVars.USERS_MICROSERVICE_PORT,

}