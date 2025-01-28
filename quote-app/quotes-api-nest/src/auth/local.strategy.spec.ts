import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

const mockAuthService = {
  validateUser: jest.fn(),
};

const mockValidateUserResponse = {
  firstName: 'Nandini',
  lastName: 'Naik',
  email: 'test@creativecapsule.com',
  deletedAt: null,
  id: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  created_at: '2024-01-03T04:27:50.972Z',
  updated_at: '2024-01-03T04:27:50.972Z',
};

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user details if username and password is valid', async () => {
      const email = 'test@creativecapsule.com';
      const password = 'Test@123';

      mockAuthService.validateUser.mockReturnValue(mockValidateUserResponse);
      const result = await localStrategy.validate(email, password);
      expect(result).toEqual(mockValidateUserResponse);
    });

    it('should throw an error if username and password does not match', async () => {
      const email = 'test@creativecapsule.com';
      const password = 'Test@12';

      mockAuthService.validateUser.mockReturnValue(null);
      await expect(
        localStrategy.validate(email, password),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
