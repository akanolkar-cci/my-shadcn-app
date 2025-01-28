import { TestingModule, Test } from '@nestjs/testing';
import { QuoteRepository } from './quote.repository';
import { QuoteService } from './quote.service';
import { UserQuoteReactionRepository } from './user-quote-reaction.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

const mockQuote = {
  id: '1',
  quote: 'Test Quote',
  author: 'CM',
  likes: 12,
  dislikes: 2,
  tags: 'Motivational',
  user: mockUser,
};

const mockUserQuoteReaction = {
  user: mockUser,
  quote: mockQuote,
  like: true,
  dislike: false,
};

const invalidUUID = '88df1a01-d79c-4e9c-a9a2';

const mockIGetUser = {
  id: '1',
  email: 'test@example.com',
};

const mockTriggerCronQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  getRawMany: jest
    .fn()
    .mockReturnValue([{ quoteId: '1', likes: 4, dislikes: 3 }]),
};

const mockQuoteRepository = {
  createQuote: jest.fn(),
  getAllQuotes: jest.fn(),
  getOneById: jest.fn(),
  getUniqueAuthors: jest.fn(),
  getAllQuoteIds: jest.fn(),
  findByTags: jest.fn(),
  updateData: jest.fn(),
  deleteData: jest.fn(),
  find: jest.fn(),
  triggerCronFunction: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const mockUserQuoteReactionRepository = {
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
  createRecord: jest.fn(),
  getOneByUserAndQuoteId: jest.fn(),
  getAllByUserAndQuoteId: jest.fn(),
  updateData: jest.fn(),
  userId: jest.fn(),
  deleteByQuoteAndUserId: jest.fn(),
};

describe('QuoteService', () => {
  let quoteService: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: QuoteRepository,
          useValue: mockQuoteRepository,
        },
        {
          provide: 'UserServiceInterface',
          useValue: mockUsersService,
        },
        {
          provide: UserQuoteReactionRepository,
          useValue: mockUserQuoteReactionRepository,
        },
      ],
    }).compile();

    quoteService = module.get<QuoteService>(QuoteService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(quoteService).toBeDefined();
  });

  describe('likedQuoteUsers', () => {
    it('should return all quotes that has like as true and has passed quote ID', async () => {
      const mockResult = [mockUserQuoteReaction];
      mockUserQuoteReactionRepository.find.mockResolvedValueOnce(mockResult);

      const result = await quoteService.likedQuoteUsers(mockQuote.id);

      expect(result).toEqual(mockResult);
      expect(mockUserQuoteReactionRepository.find).toHaveBeenCalledWith({
        where: { quote: { id: mockQuote.id }, like: true },
        order: {
          created_at: 'DESC',
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUserQuoteReactionRepository.find.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.likedQuoteUsers(invalidUUID),
      ).rejects.toThrowError(InternalServerErrorException);
    });

    it('should return empty object if no quote is there with passed ID and like true', async () => {
      mockUserQuoteReactionRepository.find.mockReturnValueOnce([]);

      const result = await quoteService.likedQuoteUsers(mockQuote.id);

      expect(result).toEqual([]);
    });
  });

  describe('dislikedQuoteUsers', () => {
    it('should return all quotes that has dislike as true and has passed quote ID', async () => {
      const mockResult = [mockUserQuoteReaction];
      mockUserQuoteReactionRepository.find.mockReturnValueOnce(mockResult);

      const result = await quoteService.dislikedQuoteUsers(mockQuote.id);

      expect(result).toEqual(mockResult);
      expect(mockUserQuoteReactionRepository.find).toHaveBeenCalledWith({
        where: { quote: { id: mockQuote.id }, dislike: true },
        order: {
          created_at: 'DESC',
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUserQuoteReactionRepository.find.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.dislikedQuoteUsers(invalidUUID),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return empty object if no quote is there with passed ID and dislike true', async () => {
      mockUserQuoteReactionRepository.find.mockReturnValueOnce([]);

      const result = await quoteService.dislikedQuoteUsers(mockQuote.id);

      expect(result).toEqual([]);
    });
  });

  describe('userAddedQuotes', () => {
    it('should return all quotes that has dislike as true and has passed user ID', async () => {
      const mockResult = [mockQuote];
      mockQuoteRepository.find.mockReturnValueOnce(mockResult);

      const result = await quoteService.userAddedQuotes(mockUser.id);

      expect(result).toEqual(mockResult);
      expect(mockQuoteRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        order: {
          created_at: 'DESC',
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockQuoteRepository.find.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(quoteService.userAddedQuotes(invalidUUID)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return empty object if no quote is there with passed ID', async () => {
      mockQuoteRepository.find.mockReturnValueOnce([]);

      const result = await quoteService.userAddedQuotes(mockUser.id);

      expect(result).toEqual([]);
    });
  });

  describe('userLikedQuotes', () => {
    it('should return Not Found Exception if user with id is not found', async () => {
      mockUsersService.findOne.mockRejectedValueOnce(new NotFoundException());

      await expect(quoteService.userLikedQuotes(invalidUUID)).rejects.toThrow(
        NotFoundException,
      );
    });

    const mockResult = [mockUserQuoteReaction];
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValueOnce(mockResult),
    };

    it('should return all UserQuoteReaction that has like as true for the passed userId', async () => {
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );

      const result = await quoteService.userLikedQuotes(mockUser.id);

      expect(result).toEqual(mockResult);
      expect(
        mockUserQuoteReactionRepository.createQueryBuilder,
      ).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
        id: mockUser.id,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.like = :value',
        { value: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.created_at',
        'DESC',
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUsersService.findOne.mockReturnValueOnce(mockUser);
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );
      mockQueryBuilder.getMany.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.userLikedQuotes(invalidUUID),
      ).rejects.toThrowError(InternalServerErrorException);

      expect(
        mockUserQuoteReactionRepository.createQueryBuilder,
      ).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
        id: invalidUUID, // Use the invalidUUID here
      });
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should return empty array if no quote is there with passed user ID and like true', async () => {
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );
      mockQueryBuilder.getMany.mockReturnValueOnce([]); // Empty array when there are no matching quotes

      const result = await quoteService.userLikedQuotes(mockUser.id);

      expect(result).toEqual([]); // Expecting an empty array
      expect(
        mockUserQuoteReactionRepository.createQueryBuilder,
      ).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
        id: mockUser.id,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.like = :value',
        { value: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.created_at',
        'DESC',
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('userDislikedQuotes', () => {
    it('should return all quotes that has dislike as true and has matching userID', async () => {
      const mockResult = [mockUserQuoteReaction];
      mockUserQuoteReactionRepository.find.mockReturnValueOnce(mockResult);

      const result = await quoteService.userDislikedQuotes(mockUser.id);

      expect(result).toEqual(mockResult);
      expect(mockUserQuoteReactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, dislike: true },
        order: {
          created_at: 'DESC',
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUserQuoteReactionRepository.find.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.userDislikedQuotes(invalidUUID),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return empty object if no quote is there with passed ID and dislike true', async () => {
      mockUserQuoteReactionRepository.find.mockReturnValueOnce([]);

      const result = await quoteService.userDislikedQuotes(mockUser.id);

      expect(result).toEqual([]);
    });
  });

  describe('createQuote', () => {
    const newQuote = {
      quote: 'Some nice Quote.',
      author: 'CM',
      tags: 'Motivational',
      likes: 0,
      dislikes: 0,
    };

    it('should return newly created quote', async () => {
      const mockResult = {
        ...newQuote,
        id: '1',
        user: { id: '1' },
      };
      mockQuoteRepository.createQuote.mockReturnValueOnce(mockResult);

      await expect(
        quoteService.createQuote(mockUser.id, newQuote),
      ).resolves.toEqual(mockResult);
    });

    it('should return InternalServerError exception if any error occurs', async () => {
      mockQuoteRepository.createQuote.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.createQuote(mockUser.id, newQuote),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getAllQuotes', () => {
    it('should return all quotes if no filter is passed', async () => {
      const mockResult = [mockQuote];
      mockQuoteRepository.find.mockReturnValueOnce(mockResult);

      await expect(
        quoteService.getAllQuotes(null, null, null),
      ).resolves.toEqual(mockResult);
    });

    it('should return all quotes depending on the filter from repositories function', async () => {
      const mockResult = [mockQuote];
      mockQuoteRepository.getAllQuotes.mockReturnValueOnce(mockResult);

      await expect(
        quoteService.getAllQuotes(null, null, 'CM'),
      ).resolves.toEqual(mockResult);
      expect(mockQuoteRepository.getAllQuotes).toHaveBeenCalledWith(
        undefined,
        null,
        mockQuote.author,
      );
    });
  });

  describe('getQuote', () => {
    it('should return single quote with passed id', () => {
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      expect(quoteService.getQuote(mockQuote.id)).resolves.toEqual(mockQuote);
    });

    it('should return NotFound exception if record with id not present', async () => {
      mockQuoteRepository.getOneById.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(quoteService.getQuote(mockQuote.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateQuote', () => {
    const updateQuote = {
      quote: 'Something else',
    };
    const updatedMockQuote = { ...mockQuote, quote: updateQuote.quote };

    it('should return updated quote object', async () => {
      mockQuoteRepository.updateData.mockReturnValue(updatedMockQuote);

      const result = await quoteService.updateQuote(mockQuote.id, updateQuote);

      expect(result).toEqual(updatedMockQuote);
    });

    it('should return InternalServerError exception if any error occurs', async () => {
      mockQuoteRepository.updateData.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        quoteService.updateQuote(mockUser.id, updateQuote),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteQuote', () => {
    it('should return object with deleted as true if successful', async () => {
      const mockResult = { deleted: true };
      mockQuoteRepository.deleteData.mockReturnValue(mockResult);

      const result = await quoteService.deleteQuote(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should return object with deleted as false if not deleted', async () => {
      const mockResult = { deleted: false };
      mockQuoteRepository.deleteData.mockReturnValue(mockResult);

      const result = await quoteService.deleteQuote(mockQuote.id);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllAuthors', () => {
    it('should return array of objects with author names', async () => {
      const mockResult = [{ author: 'CM' }, { author: 'Test' }];
      mockQuoteRepository.getUniqueAuthors.mockReturnValue(mockResult);

      const result = await quoteService.getAllAuthors();

      expect(result).toEqual(mockResult);
    });

    it('should return empty array if no data is present', async () => {
      const mockResult = [];
      mockQuoteRepository.getUniqueAuthors.mockReturnValue(mockResult);

      const result = await quoteService.getAllAuthors();

      expect(result).toEqual(mockResult);
    });
  });

  describe('findByTags', () => {
    it('should return the quotes with mentioned tags if found', async () => {
      const tags = 'tag1;tag2;tag3';
      const expectedTagsArray = ['tag1', 'tag2', 'tag3'];
      const mockResult = [mockQuote];

      mockQuoteRepository.findByTags.mockResolvedValueOnce(mockResult);

      const result = await quoteService.findByTags(tags);

      expect(result).toEqual(mockResult);

      expect(mockQuoteRepository.findByTags).toHaveBeenCalledWith(
        expectedTagsArray,
      );
    });
  });

  describe('likeUp', () => {
    const user = mockIGetUser;
    const quoteId = mockQuote.id;

    it('should update dislike as false and like as true for existing user quote reaction', async () => {
      const existingUserQuoteReaction = [mockUserQuoteReaction];
      const updateData = { like: true, dislike: false };

      mockUserQuoteReactionRepository.getAllByUserAndQuoteId.mockResolvedValueOnce(
        existingUserQuoteReaction,
      );
      mockUserQuoteReactionRepository.updateData.mockResolvedValueOnce({
        ...updateData,
        ...mockUserQuoteReaction,
      });
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValue(
        mockTriggerCronQueryBuilder,
      );
      mockQuoteRepository.getAllQuoteIds.mockReturnValue(['1', '2']);
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      expect(await quoteService.likeUp(user, quoteId)).toEqual(mockQuote);

      expect(mockUserQuoteReactionRepository.updateData).toHaveBeenCalledWith(
        user.id,
        quoteId,
        updateData,
      );
    });

    it('should create a new user quote reaction record if none exists', async () => {
      mockUserQuoteReactionRepository.getAllByUserAndQuoteId.mockResolvedValueOnce(
        [],
      );
      mockUserQuoteReactionRepository.createRecord.mockReturnValueOnce(
        mockUserQuoteReaction,
      );
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      expect(await quoteService.likeUp(user, quoteId)).toEqual(mockQuote);

      expect(mockUserQuoteReactionRepository.createRecord).toHaveBeenCalledWith(
        {
          userId: user.id,
          quoteId: mockQuote.id,
          like: true,
          dislike: false,
        },
      );
      expect(mockQuoteRepository.getOneById).toHaveBeenCalledWith(mockQuote.id);
    });
  });

  describe('dislikeUp', () => {
    const user = mockIGetUser;
    const quoteId = mockQuote.id;

    it('should update dislike as true and like as false for existing user quote reaction', async () => {
      const existingUserQuoteReaction = [mockUserQuoteReaction];
      const updateData = { like: false, dislike: true };

      mockUserQuoteReactionRepository.getAllByUserAndQuoteId.mockResolvedValueOnce(
        existingUserQuoteReaction,
      );
      mockUserQuoteReactionRepository.updateData.mockResolvedValueOnce({
        ...updateData,
        ...mockUserQuoteReaction,
      });
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValue(
        mockTriggerCronQueryBuilder,
      );
      mockQuoteRepository.getAllQuoteIds.mockReturnValue(['1', '2']);
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      expect(await quoteService.dislikeUp(user, quoteId)).toEqual(mockQuote);

      expect(mockUserQuoteReactionRepository.updateData).toHaveBeenCalledWith(
        user.id,
        quoteId,
        updateData,
      );
    });

    it('should create a new user quote reaction record if none exists', async () => {
      mockUserQuoteReactionRepository.getAllByUserAndQuoteId.mockResolvedValueOnce(
        [],
      );
      mockUserQuoteReactionRepository.createRecord.mockReturnValueOnce(
        mockUserQuoteReaction,
      );
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      expect(await quoteService.dislikeUp(user, quoteId)).toEqual(mockQuote);

      expect(mockUserQuoteReactionRepository.createRecord).toHaveBeenCalledWith(
        {
          userId: user.id,
          quoteId: mockQuote.id,
          like: false,
          dislike: true,
        },
      );
      expect(mockQuoteRepository.getOneById).toHaveBeenCalledWith(mockQuote.id);
    });
  });

  describe('likeDown', () => {
    const user = mockIGetUser;
    const quoteId = mockQuote.id;

    it('should delete the quote from user quote reaction and return the updated quote', async () => {
      mockUserQuoteReactionRepository.getOneByUserAndQuoteId.mockReturnValueOnce(
        mockUserQuoteReaction,
      );

      mockUserQuoteReactionRepository.deleteByQuoteAndUserId.mockReturnValueOnce(
        'Data deleted',
      );

      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValue(
        mockTriggerCronQueryBuilder,
      );
      mockQuoteRepository.getAllQuoteIds.mockReturnValue(['1', '2']);
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      const result = await quoteService.likeDown(user, quoteId);
      expect(result).toEqual(mockQuote);
    });
  });

  describe('dislikeDown', () => {
    const user = mockIGetUser;
    const quoteId = mockQuote.id;

    it('should delete the quote from user quote reaction and return the updated quote', async () => {
      mockUserQuoteReactionRepository.getOneByUserAndQuoteId.mockReturnValueOnce(
        mockUserQuoteReaction,
      );

      mockUserQuoteReactionRepository.deleteByQuoteAndUserId.mockReturnValueOnce(
        'Data deleted',
      );

      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValue(
        mockTriggerCronQueryBuilder,
      );
      mockQuoteRepository.getAllQuoteIds.mockReturnValue(['1', '2']);
      mockQuoteRepository.getOneById.mockReturnValueOnce(mockQuote);

      const result = await quoteService.dislikeDown(user, quoteId);
      expect(result).toEqual(mockQuote);
    });
  });

  describe('updateLikeDislikeCount', () => {
    it('should update likes and dislikes of quotes by checking the user_quote_reaction table,', async () => {
      mockUserQuoteReactionRepository.createQueryBuilder.mockReturnValue(
        mockTriggerCronQueryBuilder,
      );
      mockQuoteRepository.getAllQuoteIds.mockReturnValue(['1', '2']);

      await quoteService.updateLikeDislikeCount();
      expect(mockTriggerCronQueryBuilder.select).toHaveBeenCalledWith(
        'entity.quoteId',
        'quoteId',
      );
      expect(mockTriggerCronQueryBuilder.addSelect).toHaveBeenCalledWith(
        'SUM(CASE WHEN entity.like = true THEN 1 ELSE 0 END)',
        'likes',
      );
      expect(mockTriggerCronQueryBuilder.addSelect).toHaveBeenCalledWith(
        'SUM(CASE WHEN entity.dislike = true THEN 1 ELSE 0 END)',
        'dislikes',
      );
      expect(mockTriggerCronQueryBuilder.groupBy).toHaveBeenCalledWith(
        'entity.quoteId',
      );
    });
  });
});
