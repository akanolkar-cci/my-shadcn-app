import { Module, forwardRef } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteRepository } from './quote.repository';
import { UserModule } from 'src/user/user.module';
import { UserQuoteReactionRepository } from './user-quote-reaction.repository';
import { Quote } from './entities/quote.entity';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quote, UserQuoteReaction]),
    forwardRef(() => UserModule),
  ],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    {
      provide: 'QuoteServiceInterface',
      useClass: QuoteService,
    },
    QuoteRepository,
    UserQuoteReactionRepository,
  ],
  exports: [
    QuoteService,
    'QuoteServiceInterface',
    QuoteRepository,
    UserQuoteReactionRepository,
  ],
})
export class QuoteModule {}
