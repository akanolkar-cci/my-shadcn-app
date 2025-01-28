import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

const mockUserService = {
  findOne: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') {
      return 'test';
    }
    return null;
  }),
};

const mockPayload = {
  userId: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  iat: 20,
  exp: 40,
};

const mockUser = {
  firstName: 'Nandini',
  lastName: 'Naik',
  email: 'test@creativecapsule.com',
  deletedAt: null,
  id: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  created_at: '2024-01-03T04:27:50.972Z',
  updated_at: '2024-01-03T04:27:50.972Z',
  password: '$2b$10$2IzjbmvJeRPWise0KbLmXOISvJ5cb3O2zHl9QYSTSzxTj3/0k2N4K',
};

const mockValidateResponse = {
  id: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  email: 'test@creativecapsule.com',
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        UserService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user details if user exists', async () => {
      mockUserService.findOne.mockReturnValue(mockUser);
      const result = await jwtStrategy.validate(mockPayload);
      expect(result).toEqual(mockValidateResponse);
    });

    it('should throw an error if user does not exist', async () => {
      mockUserService.findOne.mockReturnValue(null);
      await expect(jwtStrategy.validate(mockPayload)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
