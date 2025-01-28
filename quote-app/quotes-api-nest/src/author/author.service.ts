import { Inject, Injectable } from '@nestjs/common';
import { QuoteServiceInterface } from 'src/quote/quote.service.interface';
import { AuthorServiceInterface } from './author.service.interface';
import { GetAuthorsDto } from './dto/get-authors.dto';

@Injectable()
export class AuthorService implements AuthorServiceInterface {
  constructor(
    @Inject('QuoteServiceInterface')
    private readonly quoteService: QuoteServiceInterface,
  ) {}

  async fetchAllAuthors(): Promise<GetAuthorsDto[]> {
    return await this.quoteService.getAllAuthors();
  }
}
