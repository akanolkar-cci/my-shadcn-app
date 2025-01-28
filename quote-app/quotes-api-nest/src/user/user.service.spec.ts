import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '@Test123',
};

const mockUserRepository = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getOneById: jest.fn(),
  getOneByEmail: jest.fn(),
  updateData: jest.fn(),
  deleteData: jest.fn(),
};

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return newly created user', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: '@Test123',
      };
      mockUserRepository.createUser.mockReturnValueOnce(mockUser);

      const result = await service.createUser(newUser);

      expect(result).toEqual(mockUser);
    });

    it('Should return bad request with proper message if Email format is not valid', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test',
        password: '@Test123',
      };

      const errorMsg = 'email must be an email';
      mockUserRepository.createUser.mockRejectedValueOnce(
        new BadRequestException(errorMsg),
      );

      const result = service.createUser(newUser);

      await expect(result).rejects.toThrowError(BadRequestException);
      await expect(result).rejects.toThrowError(errorMsg);
    });

    it('Should return bad request with proper message if password not valid', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test',
      };

      const mockError = {
        message: [
          'Password must contain at least one uppercase letter.',
          'password must be longer than or equal to 8 characters',
        ],
      };

      mockUserRepository.createUser.mockRejectedValueOnce(
        new BadRequestException(mockError),
      );

      const result = service.createUser(newUser);

      await expect(result).rejects.toThrowError(BadRequestException);
      await expect(result).rejects.toThrowError(mockError[0]);
      await expect(result).rejects.toThrowError(mockError[1]);
    });

    it('Should return bad request with proper message if any field is missing', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: '',
        email: 'test@example.com',
        password: '@Test123',
      };

      const errorMsg = 'lastName should not be empty';

      mockUserRepository.createUser.mockRejectedValueOnce(
        new BadRequestException(errorMsg),
      );

      const result = service.createUser(newUser);

      await expect(result).rejects.toThrowError(BadRequestException);
      await expect(result).rejects.toThrowError(errorMsg);
    });
  });

  describe('findAll', () => {
    it('should return all user', async () => {
      const mockResult = [mockUser];
      mockUserRepository.getAllUsers.mockReturnValueOnce(mockResult);

      const result = await service.findAll();

      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return user not found if user with passed id is not there', async () => {
      const id = mockUser.id;
      const errorMsg = `User with ID: ${id} not found`;

      mockUserRepository.getOneById.mockRejectedValueOnce(
        new NotFoundException(errorMsg),
      );

      const result = service.findOne(id);
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(errorMsg);
    });

    it('should return an users detail based on id passed', async () => {
      mockUserRepository.getOneById.mockReturnValueOnce(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
    });
  });

  describe('readEmail', () => {
    it('should return user not found if user with passed email is not there', async () => {
      const email = mockUser.email;
      const errorMsg = `User with Email: ${email} not found`;

      mockUserRepository.getOneByEmail.mockRejectedValueOnce(
        new NotFoundException(errorMsg),
      );

      const result = service.readEmail(email);

      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(errorMsg);
    });

    it('should return an users detail based on Email passed', async () => {
      mockUserRepository.getOneByEmail.mockReturnValueOnce(mockUser);

      const result = await service.readEmail(mockUser.email);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    const id = mockUser.id;
    const updateUser = {
      lastName: 'Something else',
    };

    it('should return user not found if user with passed id is not there', async () => {
      const errorMsg = `User with ID: ${id} not found`;

      mockUserRepository.updateData.mockRejectedValueOnce(
        new NotFoundException(errorMsg),
      );
      const result = service.updateUser(id, updateUser);

      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(errorMsg);
    });

    it('should return updated users detail', async () => {
      const updatedMockUser = { ...mockUser, lastName: updateUser.lastName };
      mockUserRepository.updateData.mockReturnValueOnce(updatedMockUser);

      const result = await service.updateUser(id, updateUser);

      expect(result).toEqual(updatedMockUser);
    });
  });

  describe('deleteUser', () => {
    const id = mockUser.id;
    it('should return user not found if user with passed id is not there', async () => {
      const errorMsg = `User with ID: ${id} not found`;

      mockUserRepository.deleteData.mockRejectedValueOnce(
        new NotFoundException(errorMsg),
      );
      const result = service.deleteUser(id);

      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(errorMsg);
    });

    it('should return string if user is removed or not', async () => {
      const mockResult = `user with ID: ${id} removed.`;
      mockUserRepository.deleteData.mockReturnValueOnce(mockResult);

      const result = await service.deleteUser(id);

      expect(result).toEqual(mockResult);
    });
  });
});
