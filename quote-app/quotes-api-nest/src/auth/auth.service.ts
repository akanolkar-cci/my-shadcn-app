import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthServiceInterface } from './interface/auth.service.interface';
import { UserServiceInterface } from 'src/user/user.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private logger = new Logger(AuthService.name);
  constructor(
    @Inject('UserServiceInterface')
    private usersService: UserServiceInterface,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.readEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      userName: user.userName,
    };
    return {
      access_token: this.jwtService.sign(payload),
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.id,
    };
  }
}
