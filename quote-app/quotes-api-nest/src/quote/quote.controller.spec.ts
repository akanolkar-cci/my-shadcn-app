import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import {
  BadRequestException,
  InternalServerErrorException,
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

const invalidUUIDMessage = `invalid input syntax for type uuid: ${invalidUUID}`;

const idEmptyMessage = 'id cannot be empty';

const mockQuoteService = {
  likedQuoteUsers: jest.fn(),
  dislikedQuoteUsers: jest.fn(),
  userAddedQuotes: jest.fn(),
  userLikedQuotes: jest.fn(),
  userDislikedQuotes: jest.fn(),
  createQuote: jest.fn(),
  getAllQuotes: jest.fn(),
  getQuote: jest.fn(),
  updateQuote: jest.fn(),
  deleteQuote: jest.fn(),
  getAllAuthors: jest.fn(),
  findByTags: jest.fn(),
  likeUp: jest.fn(),
  dislikeUp: jest.fn(),
  likeDown: jest.fn(),
  dislikeDown: jest.fn(),
};

describe('QuoteController', () => {
  let controller: QuoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        {
          provide: 'QuoteServiceInterface',
          useValue: mockQuoteService,
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('likeUp', () => {
    it('should return quote with passed id', async () => {
      mockQuoteService.likeUp.mockReturnValueOnce(mockQuote);

      const result = await controller.likeUp(mockUser, mockQuote.id);

      expect(result).toEqual(mockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.likeUp(mockUser, undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.likeUp(mockUser, undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.likeUp.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.likeUp(mockUser, invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('dislikeUp', () => {
    it('should return quote with passed id', async () => {
      mockQuoteService.dislikeUp.mockReturnValueOnce(mockQuote);

      const result = await controller.dislikeUp(mockUser, mockQuote.id);

      expect(result).toEqual(mockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.dislikeUp(mockUser, undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.dislikeUp(mockUser, undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.dislikeUp.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.dislikeUp(mockUser, invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('likeDown', () => {
    it('should return quote with passed id', async () => {
      mockQuoteService.likeDown.mockReturnValueOnce(mockQuote);

      const result = await controller.likeDown(mockUser, mockQuote.id);

      expect(result).toEqual(mockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.likeDown(mockUser, undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.likeDown(mockUser, undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.likeDown.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.likeDown(mockUser, invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('dislikeDown', () => {
    it('should return quote with passed id', async () => {
      mockQuoteService.dislikeDown.mockReturnValueOnce(mockQuote);

      const result = await controller.dislikeDown(mockUser, mockQuote.id);

      expect(result).toEqual(mockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.dislikeDown(mockUser, '');
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.dislikeDown(mockUser, '');
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.dislikeDown.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.dislikeDown(mockUser, invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('addQuote', () => {
    it('should return newly created quote', async () => {
      const newQuote = {
        quote: 'Some nice Quote.',
        author: 'CM',
        tags: 'Motivational',
        likes: 0,
        dislikes: 0,
      };

      const mockResult = {
        ...newQuote,
        id: '1',
        likes: 0,
        dislikes: 0,
        user: { id: '1' },
      };
      mockQuoteService.createQuote.mockReturnValueOnce(mockResult);

      const result = await controller.addQuote(mockUser, newQuote);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad request with proper message if quote is empty or less then 4 characters', async () => {
      const newQuote = {
        quote: '',
        author: 'CM',
        tags: 'Motivational',
        likes: 0,
        dislikes: 0,
      };

      const errorMsg = [
        'quote must be longer than or equal to 4 characters',
        'quote should not be empty',
      ];

      mockQuoteService.createQuote.mockReturnValueOnce(
        new BadRequestException(errorMsg),
      );

      const result: any = await controller.addQuote(mockUser, newQuote);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.response.message).toEqual(expect.arrayContaining(errorMsg));
    });

    it('should return Bad request with proper message if author is empty or less then 4 characters', async () => {
      const newQuote = {
        quote: 'Some nice quote.',
        author: '',
        tags: 'Motivational',
        likes: 0,
        dislikes: 0,
      };

      const errorMsg = [
        'author must be longer than or equal to 2 characters',
        'author should not be empty',
      ];

      mockQuoteService.createQuote.mockReturnValueOnce(
        new BadRequestException(errorMsg),
      );

      const result: any = await controller.addQuote(mockUser, newQuote);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.response.message).toEqual(expect.arrayContaining(errorMsg));
    });
  });

  describe('getQuotes', () => {
    it('should return all quotes', async () => {
      const mockResult = [mockQuote];
      mockQuoteService.getQuote.mockReturnValueOnce(mockResult);

      const result = await controller.getOneQuote(mockQuote.id);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getOneQuote', () => {
    it('should return quote with passed id', async () => {
      mockQuoteService.getQuote.mockReturnValueOnce(mockQuote);

      const result = await controller.getOneQuote(mockQuote.id);

      expect(result).toEqual(mockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.getOneQuote(undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.getOneQuote(undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.getQuote.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.getOneQuote(invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('updateQuote', () => {
    const updateQuote = {
      quote: 'Something else',
    };
    const updatedMockQuote = { ...mockQuote, quote: updateQuote.quote };

    it('should return updated quote object', async () => {
      mockQuoteService.updateQuote.mockReturnValue(updatedMockQuote);

      const result = await controller.updateQuote(mockQuote.id, updateQuote);

      expect(result).toEqual(updatedMockQuote);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.updateQuote(undefined, updatedMockQuote);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.updateQuote(undefined, updatedMockQuote);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.updateQuote.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.updateQuote(invalidUUID, updatedMockQuote);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('deleteQuote', () => {
    it('should return true or false for deleted', async () => {
      const mockResult = { deleted: true };
      mockQuoteService.deleteQuote.mockReturnValueOnce(mockResult);

      const result = await controller.deleteQuote(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.deleteQuote(undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.deleteQuote(undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.deleteQuote.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.deleteQuote(invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('findLikedQuoteUsers', () => {
    it('should return userQuoteReaction object', async () => {
      const mockResult = [mockUserQuoteReaction];
      mockQuoteService.likedQuoteUsers.mockReturnValueOnce(mockResult);

      const result = await controller.findLikedQuoteUsers(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.findLikedQuoteUsers(undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.findLikedQuoteUsers(undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.likedQuoteUsers.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.findLikedQuoteUsers(invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });

  describe('findDislikedQuoteUsers', () => {
    it('should return userQuoteReaction object', async () => {
      const mockResult = [mockUserQuoteReaction];
      mockQuoteService.dislikedQuoteUsers.mockReturnValueOnce(mockResult);

      const result = await controller.findDislikedQuoteUsers(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.findDislikedQuoteUsers(undefined);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.findDislikedQuoteUsers(undefined);
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.dislikedQuoteUsers.mockRejectedValueOnce(
        new InternalServerErrorException(invalidUUIDMessage),
      );

      const result = controller.findDislikedQuoteUsers(invalidUUID);
      await expect(result).rejects.toThrow(InternalServerErrorException);
      await expect(result).rejects.toThrow(invalidUUIDMessage);
    });
  });
});
