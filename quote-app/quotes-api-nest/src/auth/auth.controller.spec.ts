import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';

const mockUser = {
  username: 'test@example.com',
  password: 'Test',
};

const mockLoginResponse = {
  firstName: 'test',
  lastName: 'test',
  access_token: 'token',
  userId: '1',
};

const mockSignupPayload = {
  email: 'test@creativecapsule.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'password',
};

const mockSignupResponse = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@creativecapsule.com',
  password: 'password',
  deletedAt: null,
  id: '80190f00-f5b1-4111-91c6-f8edd1ecfc5a',
  created_at: '2024-01-03T04:27:50.972Z',
  updated_at: '2024-01-03T04:27:50.972Z',
};

const mockAuthServiceInterface = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

const mockUserServiceInterface = {
  createUser: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AuthServiceInterface',
          useValue: mockAuthServiceInterface,
        },
        {
          provide: 'UserServiceInterface',
          useValue: mockUserServiceInterface,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user details along with access token', async () => {
      mockAuthServiceInterface.login.mockReturnValue(mockLoginResponse);
      const result = await controller.login(mockUser, mockUser);
      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthServiceInterface.login).toBeCalled();
    });
  });

  describe('signUp', () => {
    it('Should create a new user and return its data', async () => {
      mockUserServiceInterface.createUser.mockReturnValue(mockSignupResponse);

      const result = await controller.signUp(mockSignupPayload);
      expect(mockUserServiceInterface.createUser).toBeCalled();
      expect(mockUserServiceInterface.createUser).toBeCalledWith(
        mockSignupPayload,
      );
      expect(result).toEqual(mockSignupResponse);
    });

    it('should return error if email already exist', async () => {
      mockUserServiceInterface.createUser.mockRejectedValue(
        new BadRequestException(),
      );
      const result = controller.signUp(mockSignupPayload);
      await expect(result).rejects.toThrowError(BadRequestException);
    });
  });
});
