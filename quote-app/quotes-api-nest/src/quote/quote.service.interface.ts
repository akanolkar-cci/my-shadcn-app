import { GetAuthorsDto } from 'src/author/dto/get-authors.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';
import { IGetUser } from 'src/auth/interface/get-user.interface';

export interface QuoteServiceInterface {
  likedQuoteUsers(id: string): Promise<UserQuoteReaction[]>;
  dislikedQuoteUsers(id: string): Promise<UserQuoteReaction[]>;
  userAddedQuotes(id: string): Promise<Quote[]>;
  userLikedQuotes(id: string): Promise<UserQuoteReaction[]>;
  userDislikedQuotes(id: string): Promise<UserQuoteReaction[]>;
  createQuote(id: string, createQuoteDto: CreateQuoteDto): Promise<Quote>;
  getAllQuotes(tags, quote: string, author: string): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote>;
  updateQuote(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote>;
  deleteQuote(id: string): Promise<{ deleted: boolean }>;
  getAllAuthors(): Promise<GetAuthorsDto[]>;
  findByTags(tags);
  likeUp(user: IGetUser, id: string): Promise<Quote>;
  dislikeUp(user: IGetUser, id: string): Promise<Quote>;
  likeDown(user: IGetUser, id: string): Promise<Quote>;
  dislikeDown(user: IGetUser, id: string): Promise<Quote>;
}
