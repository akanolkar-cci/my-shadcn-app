import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';

describe('AuthorService', () => {
  let service: AuthorService;

  const mockQuoteRepository = {
    getAllAuthors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: 'QuoteServiceInterface',
          useValue: mockQuoteRepository,
        },
      ],
    }).compile();
    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAllAuthors', () => {
    it('should return an array of authors', async () => {
      const authors = [{ author: 'Mahatma' }];

      mockQuoteRepository.getAllAuthors.mockReturnValue(authors);

      const result = await service.fetchAllAuthors();
      expect(result).toEqual(authors);
      expect(mockQuoteRepository.getAllAuthors).toBeCalled();
    });

    it('should return an empty array if there are no authors', async () => {
      const authors = [];

      mockQuoteRepository.getAllAuthors.mockReturnValue(authors);

      const result = await service.fetchAllAuthors();
      expect(result).toEqual(authors);
      expect(mockQuoteRepository.getAllAuthors).toBeCalled();
    });
  });
});
