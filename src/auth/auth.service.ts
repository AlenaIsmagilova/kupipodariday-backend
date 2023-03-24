import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async auth(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { privateKey: 'jwtKey' }),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserWithPasswordByUsername(
      username,
    );

    const decodedPswrd = await this.hashService.comparePassword(
      pass,
      user.password,
    );

    if (user && decodedPswrd) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
