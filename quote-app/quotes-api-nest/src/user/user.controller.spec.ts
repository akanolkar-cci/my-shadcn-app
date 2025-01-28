import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { IGetUser } from 'src/auth/interface/get-user.interface';
import { BadRequestException } from '@nestjs/common';

const mockGetUser: IGetUser = {
  id: '1',
  email: 'test@example.com',
};

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
  id: '1',
  like: true,
  dislike: false,
  user: mockUser,
  quote: mockQuote,
};

const invalidUUID = '88df1a01-d79c-4e9c-a9a2';

const invalidUUIDResult = {
  message: `invalid input syntax for type uuid: ${invalidUUID}`,
  error: 'Internal Server Error',
  statusCode: 500,
};

const idEmptyMessage = 'id cannot be empty';

// Mock UsersServiceInterface
const mockUsersService = {
  findOne: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const mockQuoteService = {
  userAddedQuotes: jest.fn(),
  userLikedQuotes: jest.fn(),
  userDislikedQuotes: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'UserServiceInterface',
          useValue: mockUsersService,
        },
        {
          provide: 'QuoteServiceInterface',
          useValue: mockQuoteService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user details', async () => {
      mockUsersService.findOne.mockReturnValueOnce(mockUser);

      const result = await controller.findOne(mockGetUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('fetchUserAddedQuotes', () => {
    const id = mockGetUser.id;

    it('should return quotes added by user', async () => {
      const mockResult = [mockQuote];

      mockQuoteService.userAddedQuotes.mockReturnValue(mockResult);

      const result = await controller.fetchUserAddedQuotes(id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', () => {
      expect(() => {
        controller.fetchUserAddedQuotes('');
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.fetchUserAddedQuotes('');
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.userAddedQuotes.mockReturnValue(invalidUUIDResult);

      const result = await controller.fetchUserAddedQuotes(invalidUUID);

      expect(result).toEqual(invalidUUIDResult);
    });
  });

  describe('fetchUsersFavouriteQuotes', () => {
    const id = mockGetUser.id;

    it('should return quotes liked by user', async () => {
      const mockResult = [mockUserQuoteReaction];

      mockQuoteService.userLikedQuotes.mockReturnValue(mockResult);

      const result = await controller.fetchUsersFavouriteQuotes(id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.fetchUsersFavouriteQuotes('');
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.fetchUsersFavouriteQuotes('');
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.userLikedQuotes.mockReturnValue(invalidUUIDResult);

      const result = await controller.fetchUsersFavouriteQuotes(id);

      expect(result).toEqual(invalidUUIDResult);
    });
  });

  describe('fetchUsersUnfavouriteQuotes', () => {
    const id = mockGetUser.id;

    it('should return quotes disliked by user', async () => {
      const mockResult = [mockUserQuoteReaction];

      mockQuoteService.userDislikedQuotes.mockReturnValue(mockResult);

      const result = await controller.fetchUsersUnfavouriteQuotes(id);

      expect(result).toEqual(mockResult);
    });

    it('should return Bad Request if id is empty', async () => {
      expect(() => {
        controller.fetchUsersUnfavouriteQuotes('');
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.fetchUsersUnfavouriteQuotes('');
      }).toThrowError(idEmptyMessage);
    });

    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockQuoteService.userDislikedQuotes.mockReturnValue(invalidUUIDResult);

      const result = await controller.fetchUsersUnfavouriteQuotes(id);

      expect(result).toEqual(invalidUUIDResult);
    });
  });

  describe('updateUser', () => {
    it('should return user object', async () => {
      const updateUser = {
        lastName: 'Something else',
      };
      const updatedMockUser = { ...mockUser, lastName: updateUser.lastName };
      mockUsersService.updateUser.mockReturnValue(updatedMockUser);

      const result = await controller.updateUser(mockUser, updateUser);

      expect(result).toEqual(updatedMockUser);
    });
  });

  describe('deleteUser', () => {
    const id = mockGetUser.id;
    it('should return invalid type for UUID if invalid uuid is passed', async () => {
      mockUsersService.deleteUser.mockReturnValue(invalidUUIDResult);

      const result = await controller.deleteUser(id);

      expect(result).toEqual(invalidUUIDResult);
    });

    it('should return string', async () => {
      const mockResult = 'Deleted';
      mockUsersService.deleteUser.mockReturnValue(mockResult);

      const result = await controller.deleteUser(id);

      expect(result).toEqual(mockResult);
    });
  });
});
