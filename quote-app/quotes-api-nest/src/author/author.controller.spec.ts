import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';

describe('AuthorController', () => {
  let controller: AuthorController;
  const mockAuthorsServiceInterface = {
    fetchAllAuthors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: 'AuthorServiceInterface',
          useValue: mockAuthorsServiceInterface,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAuthors', () => {
    it('should return an array of authors', async () => {
      const authors = [{ author: 'Mahatma' }];

      mockAuthorsServiceInterface.fetchAllAuthors.mockReturnValue(authors);

      const result = await controller.getAllAuthors();

      expect(result).toEqual(authors);
      expect(mockAuthorsServiceInterface.fetchAllAuthors).toBeCalled();
    });

    it('should return an empty array if no authors exists', async () => {
      const authors = [];
      mockAuthorsServiceInterface.fetchAllAuthors.mockReturnValue(authors);

      const result = await controller.getAllAuthors();

      expect(result).toEqual(authors);
      expect(mockAuthorsServiceInterface.fetchAllAuthors).toBeCalled();
    });
  });
});
