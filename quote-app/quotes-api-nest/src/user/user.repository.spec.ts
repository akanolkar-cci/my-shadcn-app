import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: '@Test123',
  deletedAt: undefined,
  created_at: undefined,
  updated_at: undefined,
};

const mockDataSource = {
  createEntityManager: jest.fn(),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    const newUser: CreateUserDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'email@example.com',
      password: '@Test123',
    };
    const mockResult = {
      ...newUser,
      id: '1',
      created_at: undefined,
      updated_at: undefined,
      deletedAt: undefined,
    };

    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(mockResult);

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({} as User);

      const result = await userRepository.createUser(newUser);

      expect(result).toEqual(mockResult);
    });

    it('should handle duplicate email and throw BadRequestException', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(mockResult);
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(userRepository.createUser(newUser)).rejects.toThrow(
        new BadRequestException(
          `User with Email:${newUser.email} already exists`,
        ),
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(userRepository.createUser(newUser)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([mockUser]);

      const result = await userRepository.getAllUsers();

      expect(result).toBeDefined();
      expect(result).toEqual([mockUser]);
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(userRepository.getAllUsers()).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('getOneById', () => {
    it('should return an user by ID', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const result = await userRepository.getOneById(mockUser.id);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
    });

    it('should throw NotFoundException if user with given ID is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(userRepository.getOneById('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getOneByEmail', () => {
    it('should return an user by email', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const result = await userRepository.getOneByEmail(mockUser.email);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should throw NotFoundException if user with given email is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(userRepository.getOneByEmail('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateData', () => {
    const updateUser: UpdateUserDto = {
      lastName: 'sdomething else',
    };
    const updatedMockUser = { ...mockUser, lastName: updateUser.lastName };

    it('should return updated user object', async () => {
      jest.spyOn(userRepository, 'getOneById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedMockUser);

      const result = await userRepository.updateData(mockUser.id, updateUser);

      expect(result).toEqual(updatedMockUser);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest.spyOn(userRepository, 'getOneById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        userRepository.updateData(mockUser.id, updateUser),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteData', () => {
    const id = mockUser.id;
    it('should return user removed if delete is successful', async () => {
      const mockDeltedResult = { affected: 1, raw: '', generatedMaps: [] };
      const mockResult = `user with ID: ${id} removed.`;
      jest.spyOn(userRepository, 'getOneById').mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, 'softDelete')
        .mockResolvedValueOnce(mockDeltedResult);

      const result = await userRepository.deleteData(id);

      expect(result).toEqual(mockResult);
    });

    it('should return user not removed if delete is unsuccessful', async () => {
      const mockDeltedResult = { affected: 0, raw: '', generatedMaps: [] };
      const mockResult = `user with ID: ${id} not removed.`;
      jest.spyOn(userRepository, 'getOneById').mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, 'softDelete')
        .mockResolvedValueOnce(mockDeltedResult);

      const result = await userRepository.deleteData(id);

      expect(result).toEqual(mockResult);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest.spyOn(userRepository, 'getOneById').mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      await expect(userRepository.deleteData(id)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
