import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';
import { UpdateUserQuoteReactionDto } from './dto/update-user-quote-reaction.dto';
import { CreateUserQuoteReactionDto } from './dto/create-user-quote-reaction.dto';
import { MockLogger } from 'src/core/logger/mock-logger';
import { Stage } from 'src/core/enum/stage.enum';

@Injectable()
export class UserQuoteReactionRepository extends Repository<UserQuoteReaction> {
  private logger =
    process.env.STAGE === Stage.TEST
      ? new MockLogger()
      : new Logger(UserQuoteReactionRepository.name);
  constructor(private dataSource: DataSource) {
    super(UserQuoteReaction, dataSource.createEntityManager());
  }

  async createRecord(
    createUserQuoteReactionDto: CreateUserQuoteReactionDto,
  ): Promise<UserQuoteReaction> {
    try {
      const { userId, quoteId } = createUserQuoteReactionDto;
      const newData = this.create({
        ...createUserQuoteReactionDto,
        user: { id: userId },
        quote: { id: quoteId },
      });
      await this.save(newData);
      return newData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserQuoteReactionRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneByUserAndQuoteId(
    userId: string,
    quoteId: string,
  ): Promise<UserQuoteReaction> {
    const data = await this.findOne({
      where: { user: { id: userId }, quote: { id: quoteId } },
    });
    if (!data) {
      throw new NotFoundException(
        `Quote with id:${quoteId} and userId:${userId} is not found in the database`,
      );
    }
    return data;
  }

  async getAllByUserAndQuoteId(
    userId: string,
    quoteId: string,
  ): Promise<UserQuoteReaction[]> {
    return await this.find({
      where: { user: { id: userId }, quote: { id: quoteId } },
    });
  }

  async updateData(
    userId: string,
    quoteId: string,
    updateUserQuoteReactionDto: UpdateUserQuoteReactionDto,
  ): Promise<UserQuoteReaction> {
    const data = await this.getOneByUserAndQuoteId(userId, quoteId);
    try {
      const updateData = Object.assign(data, updateUserQuoteReactionDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserQuoteReactionRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteByQuoteAndUserId(
    quoteId: string,
    userId: string,
  ): Promise<string> {
    await this.getOneByUserAndQuoteId(userId, quoteId);
    try {
      const deletedData = await this.delete({
        quote: { id: quoteId },
        user: { id: userId },
      });
      if (deletedData.affected != 0) {
        return `Data deleted`;
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserQuoteReactionRepository.name}/deleteByQuoteAndUserId`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
