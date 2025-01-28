import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as address from 'address';
import { AnonymousUserRepository } from 'src/user/anonymous-user.repository';
import { OrderValue } from '../enum/order-value.enum';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private logger = new Logger(RateLimitMiddleware.name);
  constructor(
    private anonymousUserRepo: AnonymousUserRepository,
    private jwtService: JwtService,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const authHeader = req.headers.authorization;
    let token: string;
    if (authHeader) {
      token = authHeader.split(' ')[1];
      try {
        await this.jwtService.verify(token);
      } catch (error) {
        throw new BadRequestException(`Token not valid`);
      }
    }
    try {
      if (!token) {
        let mac: string;

        address.mac(function (err, addr) {
          mac = addr;
        });

        if (req.method !== 'GET' && req.path !== '/quotes') {
          return res.status(401).send({
            status: 401,
            message: 'Unauthorized',
            description: 'You need to be logged in to access this route.',
          });
        }

        let unauthenticatedUser = await this.anonymousUserRepo.getOneByMac(mac);

        if (!unauthenticatedUser) {
          unauthenticatedUser = await this.anonymousUserRepo.createRecord({
            uniqueAddress: mac,
            rateLimit: 10,
          });
          unauthenticatedUser = await this.anonymousUserRepo.getOneByMac(mac);
        } else {
          if (unauthenticatedUser.rateLimit <= 0) {
            const updatedAt = await this.anonymousUserRepo.findOne({
              where: { id: unauthenticatedUser.id },
              order: { updated_at: OrderValue.DESC },
            });
            if (updatedAt) {
              const lastUpdated = new Date(updatedAt.updated_at);
              const now: any = new Date();
              const timezoneOffset = now.getTimezoneOffset();
              const localLastUpdatedAt: any = new Date(
                lastUpdated.getTime() - timezoneOffset * 60 * 1000,
              );

              const hoursDiff = Math.abs(now - localLastUpdatedAt) / 36e5;
              if (hoursDiff > 24) {
                await this.anonymousUserRepo.updateData(
                  unauthenticatedUser.id,
                  { rateLimit: 10 },
                );
              }
            }
            unauthenticatedUser = await this.anonymousUserRepo.getOneByMac(mac);
          }
        }
        const originalRateLimit = unauthenticatedUser.rateLimit;
        const currentRateLimit = originalRateLimit - 1;

        if (currentRateLimit < 0) {
          return res.status(429).send({
            status: 429,
            message: 'Too many requests',
          });
        }
        await this.anonymousUserRepo.updateData(unauthenticatedUser.id, {
          rateLimit: currentRateLimit,
        });
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RateLimitMiddleware.name}`,
      );
      throw new InternalServerErrorException();
    }
    next();
  }
}
