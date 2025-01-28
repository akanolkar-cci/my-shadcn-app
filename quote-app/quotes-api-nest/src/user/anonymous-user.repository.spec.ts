import { TestingModule, Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AnonymousUserRepository } from './anonymous-user.repository';
import { CreateAnonymousUserDto } from './dto/create-anonymous-user.dto';
import { AnonymousUser } from './entities/anonymous-user.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAnonymousUserDto } from './dto/update-anonymous-user.dto';

const mockAnonymousUser: AnonymousUser = {
  id: '1',
  uniqueAddress: 'unq1',
  rateLimit: 9,
  created_at: undefined,
  updated_at: undefined,
};
const mockDataSource = {
  createEntityManager: jest.fn(),
};

describe('AnonymousUserRepository', () => {
  let anonymousUserRepository: AnonymousUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnonymousUserRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    anonymousUserRepository = module.get<AnonymousUserRepository>(
      AnonymousUserRepository,
    );
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(anonymousUserRepository).toBeDefined();
  });

  describe('createUser', () => {
    const newAnonymousUser: CreateAnonymousUserDto = {
      uniqueAddress: 'unq1',
      rateLimit: 10,
    };
    const mockResult = {
      ...newAnonymousUser,
      id: '1',
      created_at: undefined,
      updated_at: undefined,
    };

    it('should create a new anonymous user', async () => {
      jest.spyOn(anonymousUserRepository, 'create').mockReturnValue(mockResult);
      jest
        .spyOn(anonymousUserRepository, 'save')
        .mockResolvedValueOnce(mockResult as AnonymousUser);

      const result = await anonymousUserRepository.createRecord(
        newAnonymousUser,
      );

      expect(result).toEqual(mockResult);
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(
        anonymousUserRepository.createRecord(newAnonymousUser),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getOneById', () => {
    it('should return an anonymous user by ID', async () => {
      jest
        .spyOn(anonymousUserRepository, 'findOneBy')
        .mockResolvedValueOnce(mockAnonymousUser);

      const result = await anonymousUserRepository.getOneById(
        mockAnonymousUser.id,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockAnonymousUser);
      expect(anonymousUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockAnonymousUser.id,
      });
    });

    it('should throw NotFoundException if user with given ID is not found', async () => {
      jest
        .spyOn(anonymousUserRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(
        anonymousUserRepository.getOneById('2'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getOneByMac', () => {
    it('should return an anonymous user by mac address', async () => {
      jest
        .spyOn(anonymousUserRepository, 'findOneBy')
        .mockResolvedValueOnce(mockAnonymousUser);

      const result = await anonymousUserRepository.getOneByMac(
        mockAnonymousUser.uniqueAddress,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockAnonymousUser);
      expect(anonymousUserRepository.findOneBy).toHaveBeenCalledWith({
        uniqueAddress: mockAnonymousUser.uniqueAddress,
      });
    });

    it('should return null if user with given mac address is not found', async () => {
      jest
        .spyOn(anonymousUserRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(
        anonymousUserRepository.getOneByMac('2'),
      ).resolves.toBeNull();
    });
  });

  describe('updateData', () => {
    const updateAnonymousUser: UpdateAnonymousUserDto = {
      rateLimit: 7,
    };
    const updatedMockUser = {
      ...mockAnonymousUser,
      rateLimit: updateAnonymousUser.rateLimit,
    };

    it('should return updated anonymous user object', async () => {
      jest
        .spyOn(anonymousUserRepository, 'getOneById')
        .mockResolvedValue(mockAnonymousUser);
      jest
        .spyOn(anonymousUserRepository, 'save')
        .mockResolvedValueOnce(updatedMockUser);

      const result = await anonymousUserRepository.updateData(
        mockAnonymousUser.id,
        updateAnonymousUser,
      );

      expect(result).toEqual(updatedMockUser);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest
        .spyOn(anonymousUserRepository, 'getOneById')
        .mockResolvedValue(mockAnonymousUser);
      jest
        .spyOn(anonymousUserRepository, 'save')
        .mockRejectedValueOnce(new Error());

      await expect(
        anonymousUserRepository.updateData(
          mockAnonymousUser.id,
          updateAnonymousUser,
        ),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
