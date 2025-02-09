import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse, ApiUnauthorizedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User successfully authenticated.',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
  })
  async login(@Body() loginDto: LoginDto): Promise<string> {
    try {
      return this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
