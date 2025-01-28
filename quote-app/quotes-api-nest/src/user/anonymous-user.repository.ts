import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AnonymousUser } from './entities/anonymous-user.entity';
import { CreateAnonymousUserDto } from './dto/create-anonymous-user.dto';
import { UpdateAnonymousUserDto } from './dto/update-anonymous-user.dto';
import { Stage } from 'src/core/enum/stage.enum';
import { MockLogger } from 'src/core/logger/mock-logger';

@Injectable()
export class AnonymousUserRepository extends Repository<AnonymousUser> {
  private logger =
    process.env.STAGE === Stage.TEST
      ? new MockLogger()
      : new Logger(AnonymousUser.name);
  constructor(private dataSource: DataSource) {
    super(AnonymousUser, dataSource.createEntityManager());
  }

  async createRecord(
    createAnonymousUserDto: CreateAnonymousUserDto,
  ): Promise<AnonymousUser> {
    try {
      const newData = this.create(createAnonymousUserDto);
      const createdData = await this.save(newData);
      return createdData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${AnonymousUser.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneById(id: string): Promise<AnonymousUser> {
    const data = await this.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(`User with ID:${id} not found`);
    }
    return data;
  }

  async getOneByMac(mac: string): Promise<AnonymousUser> {
    const data = await this.findOneBy({ uniqueAddress: mac });
    return data;
  }

  async updateData(
    id: string,
    updateAnonymousUserDto: UpdateAnonymousUserDto,
  ): Promise<AnonymousUser> {
    const data = await this.getOneById(id);
    try {
      const updateData = Object.assign(data, updateAnonymousUserDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${AnonymousUser.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
