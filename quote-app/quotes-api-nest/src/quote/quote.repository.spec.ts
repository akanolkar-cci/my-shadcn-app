import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRepository } from './quote.repository';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from './entities/quote.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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

const mockDataSource = {
  createEntityManager: jest.fn(),
};

describe('QuoteRepository', () => {
  let quoteRepository: QuoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    quoteRepository = module.get<QuoteRepository>(QuoteRepository);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(quoteRepository).toBeDefined();
  });

  describe('createQuote', () => {
    const newQuote: CreateQuoteDto = {
      quote: 'Some test Quote',
      author: 'CM',
      likes: 0,
      dislikes: 0,
      tags: '',
    };

    it('should create a new quote', async () => {
      const mockResult = {
        ...newQuote,
        id: '1',
        user: mockUser,
        userQuoteReaction: [],
        created_at: undefined,
        updated_at: undefined,
      };

      jest.spyOn(quoteRepository, 'create').mockReturnValue(mockResult);

      jest.spyOn(quoteRepository, 'save').mockResolvedValueOnce({} as Quote);

      const result = await quoteRepository.createQuote(mockUser.id, newQuote);

      expect(result).toEqual(mockResult);
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(
        quoteRepository.createQuote(mockUser.id, newQuote),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getAllQuotes', () => {
    const mockQuoteSearch = 'Some';
    const mockAuthorSearch = 'Some';
    const mockTagSearch = ['motivational', 'test', 'something'];

    it('should return an array of quotes without filters', async () => {
      const mockedQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockQuote]),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);

      const result = await quoteRepository.getAllQuotes(undefined, null, null);
      expect(result).toEqual([mockQuote]);
      expect(mockedQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'entity.user',
        'user',
      );
      expect(mockedQueryBuilder.orderBy).toHaveBeenCalledWith(
        `entity.created_at`,
        'DESC',
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.quote ILIKE :quote',
        {
          quote: `%${mockQuote.quote}%`,
        },
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.author ILIKE :author',
        {
          author: `%${mockQuote.author}%`,
        },
      );
    });

    it('should return an array of quotes with quote filter', async () => {
      const mockedQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockQuote]),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);

      const result = await quoteRepository.getAllQuotes(
        undefined,
        mockQuoteSearch,
        null,
      );
      expect(result).toEqual([mockQuote]);
      expect(mockedQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'entity.user',
        'user',
      );
      expect(mockedQueryBuilder.orderBy).toHaveBeenCalledWith(
        `entity.created_at`,
        'DESC',
      );
      expect(mockedQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.quote ILIKE :quote',
        {
          quote: `%${mockQuoteSearch}%`,
        },
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.author ILIKE :author',
        {
          author: `%${mockQuote.author}%`,
        },
      );
    });

    it('should return an array of quotes with author filter', async () => {
      const mockedQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockQuote]),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);

      const result = await quoteRepository.getAllQuotes(
        undefined,
        null,
        mockAuthorSearch,
      );
      expect(result).toEqual([mockQuote]);
      expect(mockedQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'entity.user',
        'user',
      );
      expect(mockedQueryBuilder.orderBy).toHaveBeenCalledWith(
        `entity.created_at`,
        'DESC',
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.quote ILIKE :quote',
        {
          quote: `%${mockAuthorSearch}%`,
        },
      );
      expect(mockedQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.author ILIKE :author',
        {
          author: `%${mockAuthorSearch}%`,
        },
      );
    });

    it('should return an array of quotes with tags filter', async () => {
      const mockedQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockQuote]),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);

      const result = await quoteRepository.getAllQuotes(
        mockTagSearch,
        null,
        null,
      );
      expect(result).toEqual([mockQuote]);
      expect(mockedQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'entity.user',
        'user',
      );
      expect(mockedQueryBuilder.orderBy).toHaveBeenCalledWith(
        `entity.created_at`,
        'DESC',
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.quote ILIKE :quote',
        {
          quote: `%${mockAuthorSearch}%`,
        },
      );
      expect(mockedQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'entity.author ILIKE :author',
        {
          author: `%${mockAuthorSearch}%`,
        },
      );
      expect(mockedQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.tags ILIKE :tag0 OR entity.tags ILIKE :tag1 OR entity.tags ILIKE :tag2',
        {
          tag0: `%${mockTagSearch[0]}%`,
          tag1: `%${mockTagSearch[1]}%`,
          tag2: `%${mockTagSearch[2]}%`,
        },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      await expect(
        quoteRepository.getAllQuotes(undefined, null, null),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getOneById', () => {
    it('should return a quote by ID', async () => {
      jest.spyOn(quoteRepository, 'findOneBy').mockResolvedValueOnce(mockQuote);

      const result = await quoteRepository.getOneById(mockQuote.id);

      expect(result).toBeDefined();
      expect(result).toEqual(mockQuote);
      expect(quoteRepository.findOneBy).toHaveBeenCalledWith({
        id: mockQuote.id,
      });
    });

    it('should throw NotFoundException if quote with given ID is not found', async () => {
      jest.spyOn(quoteRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(quoteRepository.getOneById('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getUniqueAuthors', () => {
    it('should return a array of objects with all unique authors name', async () => {
      const mockUniqueAuthors = [{ author: 'CM' }, { author: 'Test' }];

      const mockedQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockUniqueAuthors),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);
      const result = await quoteRepository.getUniqueAuthors();

      expect(result).toBeDefined();
      expect(result).toEqual(mockUniqueAuthors);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      await expect(quoteRepository.getUniqueAuthors()).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllQuoteIds', () => {
    it('should return a array of strings with all unique quote IDs', async () => {
      const mockQuoteIds = ['1', '2'];

      const mockedQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
      } as unknown as SelectQueryBuilder<Quote>;

      jest
        .spyOn(quoteRepository, 'createQueryBuilder')
        .mockReturnValue(mockedQueryBuilder);

      const result = await quoteRepository.getAllQuoteIds();

      expect(result).toBeDefined();
      expect(result).toEqual(mockQuoteIds);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      await expect(quoteRepository.getAllQuoteIds()).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('updateData', () => {
    const updateQuote = {
      quote: 'Something else',
    };
    const updatedMockQuote = { ...mockQuote, quote: updateQuote.quote };

    it('should return updated quote object', async () => {
      jest.spyOn(quoteRepository, 'getOneById').mockResolvedValue(mockQuote);
      jest
        .spyOn(quoteRepository, 'save')
        .mockResolvedValueOnce(updatedMockQuote);

      const result = await quoteRepository.updateData(
        mockQuote.id,
        updateQuote,
      );

      expect(result).toEqual(updatedMockQuote);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest.spyOn(quoteRepository, 'getOneById').mockResolvedValue(mockQuote);
      jest.spyOn(quoteRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        quoteRepository.updateData(mockQuote.id, updateQuote),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteData', () => {
    it('should return deleted as true if delete is successful', async () => {
      const mockDeltedResult = { affected: 1, raw: '' };
      const mockResult = { deleted: true };
      jest.spyOn(quoteRepository, 'getOneById').mockResolvedValue(mockQuote);
      jest
        .spyOn(quoteRepository, 'delete')
        .mockResolvedValueOnce(mockDeltedResult);

      const result = await quoteRepository.deleteData(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should return deleted as false if delete is unsuccessful', async () => {
      const mockDeltedResult = { affected: 0, raw: '' };
      const mockResult = { deleted: false };
      jest.spyOn(quoteRepository, 'getOneById').mockResolvedValue(mockQuote);
      jest
        .spyOn(quoteRepository, 'delete')
        .mockResolvedValueOnce(mockDeltedResult);

      const result = await quoteRepository.deleteData(mockQuote.id);

      expect(result).toEqual(mockResult);
    });

    it('should throw InternalServerError exception if any error occurs', async () => {
      jest.spyOn(quoteRepository, 'getOneById').mockResolvedValue(mockQuote);
      jest.spyOn(quoteRepository, 'delete').mockRejectedValueOnce(new Error());

      await expect(
        quoteRepository.deleteData(mockQuote.id),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
