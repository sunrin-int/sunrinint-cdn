import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigValidator } from './validators/config';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: ConfigValidator,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => [
        {
          rootPath: join(
            __dirname,
            '..',
            config.get('UPLOAD_PATH', './upload'),
          ),
        },
      ],
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        dest: config.get('UPLOAD_PATH', './upload'),
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, config.get('UPLOAD_PATH', './upload'));
          },
          filename: (req, file, cb) => {
            randomBytes(16, (err, raw) => {
              cb(
                err,
                err
                  ? undefined
                  : raw.toString('hex') + extname(file.originalname),
              );
            });
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
