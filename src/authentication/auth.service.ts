import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {
    this.loadUsers();
  }

  loadUsers(): void {
    try {
      const filePath = path.join(__dirname, '../data/users.json');
      if (!fs.existsSync(filePath)) {
        throw new Error('Users file not found');
      }

      const rawData = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(rawData);

      if (!parsedData.users || !Array.isArray(parsedData.users)) {
        throw new Error('Invalid users file format');
      }

      this.users = parsedData.users;
    } catch (error) {
      console.error('Error loading users:', error.message);
      throw new InternalServerErrorException('Failed to load users');
    }
  }

  validateUser(email: string, password: string): User | null {
    return this.users.find(user => user.email === email && user.password === password) || null;
  }

  login(email: string, password: string): string {
    const user = this.validateUser(email, password);
    if (!user) { throw new UnauthorizedException('Invalid credentials'); }

    const payload = { email: user.email, role: user.role, domain: user.domain };
    return this.jwtService.sign(payload);
  }
}
