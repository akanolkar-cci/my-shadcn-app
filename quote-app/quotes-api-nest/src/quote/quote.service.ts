import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { UserQuoteReactionRepository } from './user-quote-reaction.repository';
import { QuoteRepository } from './quote.repository';
import { QuoteServiceInterface } from './quote.service.interface';
import { UserServiceInterface } from 'src/user/user.service.interface';
import { Cron } from '@nestjs/schedule';
import { GetAuthorsDto } from 'src/author/dto/get-authors.dto';
import { Quote } from './entities/quote.entity';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';
import { IGetUser } from 'src/auth/interface/get-user.interface';
import { OrderValue } from 'src/core/enum/order-value.enum';
import { MockLogger } from 'src/core/logger/mock-logger';
import { Stage } from 'src/core/enum/stage.enum';

@Injectable()
export class QuoteService implements QuoteServiceInterface {
  private logger =
    process.env.STAGE === Stage.TEST
      ? new MockLogger()
      : new Logger(QuoteService.name);
  constructor(
    private quoteRepository: QuoteRepository,
    @Inject('UserServiceInterface')
    private usersService: UserServiceInterface,
    private userQuoteReactionRepository: UserQuoteReactionRepository,
  ) {}

  async likedQuoteUsers(id: string): Promise<UserQuoteReaction[]> {
    try {
      const data = await this.userQuoteReactionRepository.find({
        where: { quote: { id }, like: true },
        order: {
          created_at: OrderValue.DESC,
        },
      });
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/likedQuoteUsers`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async dislikedQuoteUsers(id: string): Promise<UserQuoteReaction[]> {
    try {
      const data = await this.userQuoteReactionRepository.find({
        where: { quote: { id }, dislike: true },
        order: {
          created_at: OrderValue.DESC,
        },
      });
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/dislikedQuoteUsers`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async userAddedQuotes(id: string): Promise<Quote[]> {
    try {
      const data = await this.quoteRepository.find({
        where: { user: { id: id } },
        order: {
          created_at: OrderValue.DESC,
        },
      });
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/userAddedQuotes`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async userLikedQuotes(id: string): Promise<UserQuoteReaction[]> {
    await this.usersService.findOne(id);
    try {
      const query = await this.userQuoteReactionRepository
        .createQueryBuilder('entity')
        .leftJoinAndSelect('entity.user', 'user')
        .leftJoinAndSelect('entity.quote', 'quote')
        .where('user.id = :id', { id })
        .andWhere('entity.like = :value', { value: true })
        .orderBy('entity.created_at', OrderValue.DESC)
        .getMany();
      // const data = await this.userQuoteReactionRepository.find({
      //   where: { user: { id: id }, like: true },
      //   order: {
      //     created_at: OrderValue.DESC,
      //   },
      // });
      return query;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/userLikedQuotes`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async userDislikedQuotes(id: string): Promise<UserQuoteReaction[]> {
    try {
      const data = await this.userQuoteReactionRepository.find({
        where: { user: { id: id }, dislike: true },
        order: {
          created_at: OrderValue.DESC,
        },
      });
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/userDislikedQuotes`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async createQuote(
    userId: string,
    createQuoteDto: CreateQuoteDto,
  ): Promise<Quote> {
    return await this.quoteRepository.createQuote(userId, createQuoteDto);
  }

  async getAllQuotes(tags, quote: string, author: string): Promise<Quote[]> {
    if (!tags && !quote && !author) {
      const quotes = await this.quoteRepository.find({
        order: {
          author: OrderValue.ASC,
        },
      });

      return quotes;
    }
    const tagArray = tags ? tags.split(';') : undefined;
    const quotes = await this.quoteRepository.getAllQuotes(
      tagArray,
      quote,
      author,
    );
    return quotes;
  }

  async getQuote(id: string): Promise<Quote> {
    const data = await this.quoteRepository.getOneById(id);
    return data;
  }

  async updateQuote(
    id: string,
    updateQuoteDto: UpdateQuoteDto,
  ): Promise<Quote> {
    return await this.quoteRepository.updateData(id, updateQuoteDto);
  }

  async deleteQuote(id: string): Promise<{ deleted: boolean }> {
    return this.quoteRepository.deleteData(id);
  }

  async getAllAuthors(): Promise<GetAuthorsDto[]> {
    return await this.quoteRepository.getUniqueAuthors();
  }

  async findByTags(tags) {
    return await this.quoteRepository.findByTags(tags.split(';'));
  }

  async likeUp(user: IGetUser, id: string): Promise<Quote> {
    const unFavQuote =
      await this.userQuoteReactionRepository.getAllByUserAndQuoteId(
        user.id,
        id,
      );
    if (unFavQuote.length > 0) {
      await this.userQuoteReactionRepository.updateData(user.id, id, {
        like: true,
        dislike: false,
      });
    } else {
      await this.userQuoteReactionRepository.createRecord({
        userId: user.id,
        quoteId: id,
        like: true,
        dislike: false,
      });
    }
    // Trigger the cron function
    await this.triggerCronFunction();
    return await this.quoteRepository.getOneById(id);
  }

  async dislikeUp(user: IGetUser, id: string): Promise<Quote> {
    const favQuote =
      await this.userQuoteReactionRepository.getAllByUserAndQuoteId(
        user.id,
        id,
      );
    if (favQuote.length > 0) {
      await this.userQuoteReactionRepository.updateData(user.id, id, {
        like: false,
        dislike: true,
      });
    } else {
      await this.userQuoteReactionRepository.createRecord({
        userId: user.id,
        quoteId: id,
        like: false,
        dislike: true,
      });
    }
    // Trigger the cron function
    await this.triggerCronFunction();
    return await this.quoteRepository.getOneById(id);
  }

  async likeDown(user: IGetUser, id: string): Promise<Quote> {
    await this.userQuoteReactionRepository.getOneByUserAndQuoteId(user.id, id);

    await this.userQuoteReactionRepository.deleteByQuoteAndUserId(id, user.id);
    await this.triggerCronFunction();
    return await this.quoteRepository.getOneById(id);
  }

  async dislikeDown(user: IGetUser, id: string): Promise<Quote> {
    await this.userQuoteReactionRepository.getOneByUserAndQuoteId(user.id, id);

    await this.userQuoteReactionRepository.deleteByQuoteAndUserId(id, user.id);
    await this.triggerCronFunction();
    return await this.quoteRepository.getOneById(id);
  }

  @Cron('*/30 * * * * *', { name: 'updateLikesDislikes' })
  async updateLikeDislikeCount(): Promise<void> {
    try {
      const likesAndDislikes = await this.userQuoteReactionRepository
        .createQueryBuilder('entity')
        .select('entity.quoteId', 'quoteId')
        .addSelect(
          'SUM(CASE WHEN entity.like = true THEN 1 ELSE 0 END)',
          'likes',
        )
        .addSelect(
          'SUM(CASE WHEN entity.dislike = true THEN 1 ELSE 0 END)',
          'dislikes',
        )
        .groupBy('entity.quoteId')
        .getRawMany();

      const allQuoteIds = await this.quoteRepository.getAllQuoteIds();

      for (const { quoteId, likes, dislikes } of likesAndDislikes) {
        await this.quoteRepository.updateData(quoteId, {
          likes: +likes,
          dislikes: +dislikes,
        });
      }

      // Find quoteIds that are missing in userQuoteReaction
      const existingQuoteIds = likesAndDislikes.map(({ quoteId }) => quoteId);
      const missingQuoteIds = allQuoteIds.filter(
        (quoteId) => !existingQuoteIds.includes(quoteId),
      );

      // Update missing quoteIds with likes and dislikes set to 0
      for (const missingQuoteId of missingQuoteIds) {
        await this.quoteRepository.updateData(missingQuoteId, {
          likes: 0,
          dislikes: 0,
        });
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteService.name}/updateLikeDislikeCount`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  // Function to trigger the cron job after a delay
  async triggerCronFunction(): Promise<void> {
    await this.updateLikeDislikeCount();
  }
}
