import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { ErrorLogOptions } from './core/logger/logger-transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new DailyRotateFile(ErrorLogOptions),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Quotes-App', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });

  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<number>('PORT') || 4000;

  const API_VERSIONING_HEADER =
    configService.get<string>('API_VERSIONING_HEADER') || 'API-Version';

  const API_VERSIONING_TYPE =
    configService.get<string>('API_VERSIONING_TYPE') || 'HEADER';

  const config = new DocumentBuilder()
    .setTitle('Quotes Management')
    .setDescription('Manage quotes created by a user')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType[API_VERSIONING_TYPE],
    header: API_VERSIONING_HEADER,
  });

  await app.listen(PORT);
  logger.log(`Applicaion running on Port: ${PORT}`);
}
bootstrap();
