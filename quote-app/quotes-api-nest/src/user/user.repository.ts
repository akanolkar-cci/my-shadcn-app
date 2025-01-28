import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Stage } from 'src/core/enum/stage.enum';
import { MockLogger } from 'src/core/logger/mock-logger';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger =
    process.env.STAGE === Stage.TEST
      ? new MockLogger()
      : new Logger(UserRepository.name);
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.create(createUserDto);
      await this.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `User with Email:${createUserDto.email} already exists`,
        );
      }
      this.logger.error(
        error.message,
        error.stack,
        `${UserRepository.name}/createUser`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.find();
      return users;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserRepository.name}/getAllusers`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneById(id: string): Promise<User> {
    const user = await this.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException(`User with Email: ${email} not found`);
    }
    return user;
  }

  async updateData(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const data = await this.getOneById(id);
    try {
      const updateData = Object.assign(data, updateUserDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<string> {
    await this.getOneById(id);
    try {
      const result = await this.softDelete(id);
      if (result.affected !== 0) {
        return `user with ID: ${id} removed.`;
      } else {
        return `user with ID: ${id} not removed.`;
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
