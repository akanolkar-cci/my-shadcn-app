import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserServiceInterface } from './user.service.interface';
import { User } from './entities/user.entity';

@Injectable()
export class UserService implements UserServiceInterface {
  private saltOrRounds = 10;
  private logger = new Logger(UserService.name);
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        this.saltOrRounds,
      );
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${UserService.name}/createUser`,
      );
      throw new InternalServerErrorException(error.message);
    }

    return await this.userRepository.createUser(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.getOneById(id);
  }

  async readEmail(email: string): Promise<User> {
    return await this.userRepository.getOneByEmail(email);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltOrRounds,
      );
    }
    const updatedData = await this.userRepository.updateData(id, updateUserDto);
    return updatedData;
  }

  deleteUser(id: string): Promise<string> {
    return this.userRepository.deleteData(id);
  }
}
