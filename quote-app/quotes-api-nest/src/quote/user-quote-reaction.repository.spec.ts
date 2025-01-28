import { Test, TestingModule } from '@nestjs/testing';
import { UserQuoteReactionRepository } from './user-quote-reaction.repository';
import { DataSource } from 'typeorm';
import { CreateUserQuoteReactionDto } from './dto/create-user-quote-reaction.dto';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserQuoteReactionDto } from './dto/update-user-quote-reaction.dto';

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

const mockQuote = {
  id: '1',
  quote: 'Test Quote',
  author: 'CM',
  likes: 12,
  dislikes: 2,
  tags: 'Motivational',
  user: mockUser,
  userQuoteReaction: [],
  created_at: undefined,
  updated_at: undefined,
};

const mockUserQuoteReaction = {
  id: '1',
  user: mockUser,
  quote: mockQuote,
  like: true,
  dislike: false,
  created_at: undefined,
  updated_at: undefined,
};

const mockDataSource = {
  createEntityManager: jest.fn(),
};

describe('UserQuoteReactionRepository', () => {
  let userQuoteReactionRepository: UserQuoteReactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserQuoteReactionRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    userQuoteReactionRepository = module.get<UserQuoteReactionRepository>(
      UserQuoteReactionRepository,
    );
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userQuoteReactionRepository).toBeDefined();
  });

  describe('createQuote', () => {
    const newUserQuoteReaction: CreateUserQuoteReactionDto = {
      quoteId: mockQuote.id,
      userId: mockUser.id,
      like: true,
      dislike: false,
    };

    it('should create a new quote', async () => {
      const mockResult = {
        id: '1',
        quote: mockQuote,
        user: mockUser,
        like: true,
        dislike: false,
        created_at: undefined,
        updated_at: undefined,
      };

      jest
        .spyOn(userQuoteReactionRepository, 'create')
        .mockReturnValue(mockResult);

      jest
        .spyOn(userQuoteReactionRepository, 'save')
        .mockResolvedValueOnce({} as UserQuoteReaction);

      const result = await userQuoteReactionRepository.createRecord(
        newUserQuoteReaction,
      );

      expect(result).toEqual(mockResult);
      expect(userQuoteReactionRepository.create).toHaveBeenCalledWith({
        ...newUserQuoteReaction,
        user: { id: mockUser.id },
        quote: { id: mockQuote.id },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(
        userQuoteReactionRepository.createRecord(newUserQuoteReaction),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getOneByUserAndQuoteId', () => {
    it('should return user quote reaction by userId and quoteId', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'findOne')
        .mockResolvedValueOnce(mockUserQuoteReaction);

      const result = await userQuoteReactionRepository.getOneByUserAndQuoteId(
        mockUser.id,
        mockQuote.id,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockUserQuoteReaction);
      expect(userQuoteReactionRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, quote: { id: mockQuote.id } },
      });
    });

    it('should throw NotFoundException if quote with given ID is not found', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        userQuoteReactionRepository.getOneByUserAndQuoteId('1', '1'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getAllByUserAndQuoteId', () => {
    it('should return all  user quote reaction by userId and quoteId', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'find')
        .mockResolvedValueOnce([mockUserQuoteReaction]);

      const result = await userQuoteReactionRepository.getAllByUserAndQuoteId(
        mockUser.id,
        mockQuote.id,
      );

      expect(result).toBeDefined();
      expect(result).toEqual([mockUserQuoteReaction]);
      expect(userQuoteReactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, quote: { id: mockQuote.id } },
      });
    });
  });

  describe('updateData', () => {
    const updateQuote: UpdateUserQuoteReactionDto = {
      dislike: true,
      like: false,
    };
    const updatedMockQuote = {
      ...mockUserQuoteReaction,
      ...updateQuote,
    };

    it('should return updated quote object', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'getOneByUserAndQuoteId')
        .mockResolvedValue(mockUserQuoteReaction);
      jest
        .spyOn(userQuoteReactionRepository, 'save')
        .mockResolvedValueOnce(updatedMockQuote);

      const result = await userQuoteReactionRepository.updateData(
        mockUser.id,
        mockQuote.id,
        updateQuote,
      );

      expect(result).toEqual(updatedMockQuote);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'getOneByUserAndQuoteId')
        .mockResolvedValue(mockUserQuoteReaction);
      jest
        .spyOn(userQuoteReactionRepository, 'save')
        .mockRejectedValueOnce(new Error());

      await expect(
        userQuoteReactionRepository.updateData(
          mockUser.id,
          mockQuote.id,
          updateQuote,
        ),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteByQuoteAndUserId', () => {
    it('should return Data deleted if delete is successful', async () => {
      const mockDeltedResult = { affected: 1, raw: '' };
      const mockResult = `Data deleted`;
      jest
        .spyOn(userQuoteReactionRepository, 'getOneByUserAndQuoteId')
        .mockResolvedValue(mockUserQuoteReaction);
      jest
        .spyOn(userQuoteReactionRepository, 'delete')
        .mockResolvedValueOnce(mockDeltedResult);

      const result = await userQuoteReactionRepository.deleteByQuoteAndUserId(
        mockQuote.id,
        mockUser.id,
      );

      expect(result).toEqual(mockResult);
      expect(userQuoteReactionRepository.delete).toHaveBeenCalledWith({
        quote: { id: mockQuote.id },
        user: { id: mockUser.id },
      });
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest
        .spyOn(userQuoteReactionRepository, 'getOneByUserAndQuoteId')
        .mockResolvedValue(mockUserQuoteReaction);
      jest
        .spyOn(userQuoteReactionRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      await expect(
        userQuoteReactionRepository.deleteByQuoteAndUserId(
          mockQuote.id,
          mockUser.id,
        ),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
