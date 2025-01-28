import { Module } from '@nestjs/common';
import { QuoteModule } from 'src/quote/quote.module';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [QuoteModule],
  controllers: [AuthorController],
  providers: [
    AuthorService,
    {
      provide: 'AuthorServiceInterface',
      useClass: AuthorService,
    },
  ],
})
export class AuthorModule {}
