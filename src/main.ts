import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swagger } from './swagger';
import { Logger } from '@nestjs/common';
import { mkdir } from 'fs';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const servicePort = config.get<string>('PORT', '3000');
  const NODE_ENV = config.get<string>('NODE_ENV', 'development');

  mkdir(
    config.get<string>('UPLOAD_PATH', './upload'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    },
  );

  let CORS_ORIGIN: CorsOptions['origin'] = [];
  if (config.get<string>('CORS_ORIGIN')) {
    CORS_ORIGIN.push(...config.get<string>('CORS_ORIGIN', '*').split(','));
  }
  if (config.get<string>('CORS_REGEX_ORIGIN')) {
    CORS_ORIGIN.push(
      ...config
        .get<string>('CORS_REGEX_ORIGIN', '')
        .split(',')
        .map((regex) => new RegExp(regex)),
    );
  }
  if (CORS_ORIGIN.length === 0) {
    CORS_ORIGIN = true;
  }

  app.enableCors({
    origin: CORS_ORIGIN,
    methods: config.get<string>('CORS_METHODS', 'GET,PUT,PATCH,POST,DELETE'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });

  if (config.get<boolean>('SWAGGER_ENABLED', NODE_ENV === 'development')) {
    await swagger(app);
  }

  await app.listen(servicePort);

  Logger.log(
    `Server is running on localhost:${servicePort} withd ${NODE_ENV} mode`,
    'Bootstrap',
  );
}
bootstrap();
