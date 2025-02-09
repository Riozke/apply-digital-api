import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should call login method from AuthService and return a token', async () => {
      const result = 'token123';
      mockAuthService.login.mockReturnValueOnce(result);

      const response = await controller.login(loginDto);

      expect(response).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const errorMsg = 'Invalid credentials';
      mockAuthService.login.mockImplementationOnce(() => {
        throw new UnauthorizedException(errorMsg);
      });

      try {
        await controller.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMsg);
      }
    });

    it('should return error when login method throws an error', async () => {
      const errorMsg = 'Invalid credentials';
      mockAuthService.login.mockReturnValueOnce(Promise.reject(new UnauthorizedException(errorMsg)));

      try {
        await controller.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMsg);
      }
    });

  });
});
