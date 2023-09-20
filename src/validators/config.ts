import * as Joi from 'joi';

export const ConfigValidator = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('production'),
  ORIGIN: Joi.string().default('http://localhost:3000'),
  CORS_ORIGIN: Joi.string(),
  CORS_REGEX_ORIGIN: Joi.string(),
  CORS_METHODS: Joi.string().default('GET,PUT,PATCH,POST,DELETE'),
  CORS_CREDENTIALS: Joi.boolean().default(true),
  CORS_PREFLIGHT: Joi.boolean().default(false),
  CORS_OPTIONS_STATUS: Joi.number().default(204),
  SWAGGER_ENABLED: Joi.boolean(),
});
