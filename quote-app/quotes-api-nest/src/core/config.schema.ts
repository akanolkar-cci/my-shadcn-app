import * as Joi from 'joi';

export const configVaidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  APP_PORT: Joi.number().default(4000).required(),
  JWT_SECRET: Joi.string().required(),
  JWT_Validity: Joi.string().default('24h').required(),
  API_VERSIONING_TYPE: Joi.string().required(),
  API_VERSIONING_HEADER: Joi.string().required(),
  API_VERSION: Joi.string().required(),
});
