import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomLogger } from '../logger/logger.service';
import { IGetUser } from 'src/auth/interface/get-user.interface';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(RequestLoggerMiddleware.name);
  constructor(private readonly loggerService: CustomLogger) {}

  use(req: any, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = req;

    //const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      try {
        const { statusCode } = res;
        const user: IGetUser = req.user;
        let formattedBody;
        if (Object.keys(body).length !== 0) {
          if (originalUrl == '/auth/sign-in') {
            formattedBody = JSON.stringify({ email: body.email });
          } else if (originalUrl == '/auth/sign-up') {
            formattedBody = JSON.stringify({
              email: body.email,
              firstName: body.firstName,
              lastName: body.lastName,
            });
          } else {
            formattedBody = JSON.stringify(body);
          }
        } else {
          formattedBody = '';
        }
        // Log request information
        this.loggerService.log(
          `[${new Date().toISOString()}] ${ip} ${method} ${originalUrl} ${formattedBody} ${statusCode} ${
            user !== undefined ? user.email : ''
          } `,
        );
      } catch (error) {
        this.logger.error(
          error.message,
          error.stack,
          `${RequestLoggerMiddleware.name}`,
        );
        throw new InternalServerErrorException(error);
      }
    });

    // Continue with the request-response cycle
    next();
  }
}
