import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  username: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async login(identifier: string): Promise<any> {
    if (!identifier) {
      throw new Error('Identifier is required');
    }

    const payload: JwtPayload = { username: identifier, sub: identifier };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
