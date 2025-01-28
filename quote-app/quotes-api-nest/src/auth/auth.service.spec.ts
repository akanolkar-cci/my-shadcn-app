import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

const mockUserServiceInterface = {
  readEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockUser = {
  userName: 'test@example.com',
  id: '47934c77-2f01-46d9-a233-47aa5615c129',
  firstName: 'Test',
  lastName: 'User',
  deletedAt: null,
};

const mockCreateUserResponse = {
  firstName: 'Nandini',
  lastName: 'Naik',
  email: 'test@creativecapsule.com',
  deletedAt: null,
  id: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  created_at: '2024-01-03T04:27:50.972Z',
  updated_at: '2024-01-03T04:27:50.972Z',
  password: '$2b$10$2IzjbmvJeRPWise0KbLmXOISvJ5cb3O2zHl9QYSTSzxTj3/0k2N4K',
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

const mockLoginResponse = {
  firstName: 'Test',
  lastName: 'User',
  access_token: 'token',
  userId: '47934c77-2f01-46d9-a233-47aa5615c129',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: 'UserServiceInterface',
          useValue: mockUserServiceInterface,
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user details along with generated access token', async () => {
      mockJwtService.sign.mockReturnValue('token');
      const result = await service.login(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('validateUser', () => {
    it('Should return user details if email exists', async () => {
      const email = 'test@creativecapsule.com';
      const password = 'Test@123';
      mockUserServiceInterface.readEmail.mockReturnValue(
        mockCreateUserResponse,
      );
      const result = await service.validateUser(email, password);
      expect(mockUserServiceInterface.readEmail).toBeCalled();
      expect(result).toEqual(mockValidateUserResponse);
    });

    it('should return null value if email does not exist', async () => {
      const email = 'test@creativecapsule.com';
      const password = 'test';
      mockUserServiceInterface.readEmail.mockReturnValue(null);

      const result = await service.validateUser(email, password);
      expect(mockUserServiceInterface.readEmail).toBeCalled();
      expect(result).toBeNull();
    });

    it('should return null value if email exists but password does not match', async () => {
      const email = 'test@creativecapsule.com';
      const password = 'password';
      mockUserServiceInterface.readEmail.mockReturnValue(
        mockCreateUserResponse,
      );
      const result = await service.validateUser(email, password);
      expect(mockUserServiceInterface.readEmail).toBeCalled();
      expect(result).toEqual(null);
    });
  });
});
