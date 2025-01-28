import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseAsyncConfig } from './config/database-config';
import { configVaidationSchema } from './core/config.schema';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthorModule } from './author/author.module';
import { RateLimitMiddleware } from './core/middleware/rate-limit.middleware';
import { QuoteModule } from './quote/quote.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestLoggerMiddleware } from './core/middleware/request-logger.middleware';
import { CustomLogger } from './core/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      isGlobal: true,
      validationSchema: configVaidationSchema,
    }),
    TypeOrmModule.forRootAsync(databaseAsyncConfig),
    ScheduleModule.forRoot(),
    QuoteModule,
    AuthorModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: '/quotes', method: RequestMethod.GET });
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
