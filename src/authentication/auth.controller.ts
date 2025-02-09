import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
