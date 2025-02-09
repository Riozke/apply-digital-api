import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsers = [
    {
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
      domain: 'example.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are correct', () => {
      const email = 'test@example.com';
      const password = 'password123';

      service['users'] = mockUsers;

      const user = service.validateUser(email, password);

      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null if credentials are incorrect', () => {
      const email = 'wrong@example.com';
      const password = 'wrongPassword';

      service['users'] = mockUsers;

      const user = service.validateUser(email, password);

      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', () => {
      const email = 'test@example.com';
      const password = 'password123';

      service['users'] = mockUsers;

      const token = 'fake-jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.login(email, password);

      expect(result).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUsers[0].email,
        role: mockUsers[0].role,
        domain: mockUsers[0].domain,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', () => {
      const email = 'wrong@example.com';
      const password = 'wrongPassword';

      service['users'] = mockUsers;

      try {
        service.login(email, password);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });
});
