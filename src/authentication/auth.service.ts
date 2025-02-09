import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types';

@Injectable()
export class AuthService {
  private users: User[];

  constructor(private readonly jwtService: JwtService) {
    this.loadUsers();
  }

  private loadUsers() {
    const filePath = path.join(__dirname, '../data/users.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    this.users = JSON.parse(rawData).users;
  }

  validateUser(email: string, password: string): User | null {
    return this.users.find(user => user.email === email && user.password === password) || null;
  }

  login(email: string, password: string): string {
    const user = this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, role: user.role, domain: user.domain };
    return this.jwtService.sign(payload);
  }
}
