import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/types';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  describe('constructor', () => {
    it('should correctly initialize with the given parameters', () => {
      expect(strategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should throw an UnauthorizedException if payload is invalid', async () => {
      try {
        await strategy.validate(null as unknown as JwtPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid token');
      }
    });

    it('should return the user object if payload is valid', async () => {
      const payload: JwtPayload = {
        sub: '123',
        username: 'testUser',
        role: 'admin',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: '123',
        username: 'testUser',
        role: 'admin',
      });
    });
  });
});
