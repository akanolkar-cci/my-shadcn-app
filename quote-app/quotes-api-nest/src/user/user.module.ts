import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteModule } from 'src/quote/quote.module';
import { User } from './entities/user.entity';
import { AnonymousUser } from './entities/anonymous-user.entity';
import { AnonymousUserRepository } from './anonymous-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AnonymousUser]),
    forwardRef(() => QuoteModule),
  ],
  controllers: [UsersController],
  providers: [
    UserService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    UserRepository,
    AnonymousUserRepository,
  ],
  exports: [
    UserService,
    'UserServiceInterface',
    UserRepository,
    AnonymousUserRepository,
  ],
})
export class UserModule {}
