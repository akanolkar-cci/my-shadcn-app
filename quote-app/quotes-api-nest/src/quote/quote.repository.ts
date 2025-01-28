import { DataSource, Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { GetAuthorsDto } from 'src/author/dto/get-authors.dto';
import { MockLogger } from 'src/core/logger/mock-logger';
import { Stage } from 'src/core/enum/stage.enum';
import { OrderValue } from 'src/core/enum/order-value.enum';

@Injectable()
export class QuoteRepository extends Repository<Quote> {
  private logger =
    process.env.STAGE === Stage.TEST
      ? new MockLogger()
      : new Logger(QuoteRepository.name);
  constructor(private dataSource: DataSource) {
    super(Quote, dataSource.createEntityManager());
  }

  async createQuote(
    userId: string,
    createQuoteDto: CreateQuoteDto,
  ): Promise<Quote> {
    try {
      const newQuote = this.create({ ...createQuoteDto, user: { id: userId } });
      await this.save(newQuote);
      return newQuote;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/createQuote`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllQuotes(tags, quote: string, author: string): Promise<Quote[]> {
    try {
      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.user', 'user')
        .orderBy(`entity.created_at`, OrderValue.DESC);

      if (quote) {
        queryBuilder = queryBuilder.andWhere('entity.quote ILIKE :quote', {
          quote: `%${quote}%`,
        });
      }

      if (author) {
        queryBuilder = queryBuilder.andWhere('entity.author ILIKE :author', {
          author: `%${author}%`,
        });
      }
      let query;
      let parameters;
      if (typeof tags !== 'undefined') {
        const tagConditions = tags.map((tag, index) => {
          return `entity.tags ILIKE :tag${index}`;
        });
        query = tagConditions.join(' OR ');
        parameters = tags.reduce((params, tag, index) => {
          params[`tag${index}`] = `%${tag}%`;
          return params;
        }, {});
        queryBuilder = queryBuilder.andWhere(query, parameters);
      }

      const result = await queryBuilder.getMany();
      return result;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/getAllQuotes`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneById(id: string): Promise<Quote> {
    const data = await this.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(`Quote with ID: ${id} not found`);
    }

    return data;
  }

  async getUniqueAuthors(): Promise<GetAuthorsDto[]> {
    try {
      const data = await this.createQueryBuilder()
        .select('author')
        .groupBy('author')
        .getRawMany();
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/getUniqueAuthors`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllQuoteIds(): Promise<string[]> {
    try {
      const quotes = await this.createQueryBuilder('quote')
        .select('quote.id', 'id')
        .getRawMany();

      return quotes.map((quote) => quote.id);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/getAllQuoteIds`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByTags(tags) {
    try {
      const tagsFiltered = tags.filter((el) => el != '');

      const count = tagsFiltered.length;
      const str = `tags LIKE `;
      let condition = 'WHERE ';

      for (let i = 0; i < count; i++) {
        if (i === count - 1)
          condition = condition + str + `'%${tagsFiltered[i]}%' `;
        else condition = condition + str + `'%${tagsFiltered[i]}%' AND `;
      }

      const data = await this.query(
        `select * from public."quotes" ${condition}`,
      );

      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/findByTags`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateData(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    const data = await this.getOneById(id);
    try {
      const updateData = Object.assign(data, updateQuoteDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<{ deleted: boolean }> {
    await this.getOneById(id);
    try {
      const result = await this.delete(id);
      if (result.affected) return { deleted: true };

      return { deleted: false };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuoteRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
