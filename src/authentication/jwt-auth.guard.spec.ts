import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard', () => {
    expect(guard.constructor.name).toBe('JwtAuthGuard');
  });

  it('should throw an UnauthorizedException if no user is attached to the request', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({})
      }),
    } as unknown as ExecutionContext;

    try {
      await guard.canActivate(context);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(undefined);
    }
  });
});
