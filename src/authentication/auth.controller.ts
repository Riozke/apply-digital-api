import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body('identifier') identifier: string) {
    try {
      return await this.authService.login(identifier);
    } catch (error) {
      throw new Error('Invalid identifier');
    }
  }
}
