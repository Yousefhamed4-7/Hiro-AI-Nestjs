import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(signupDto: SignupDto) {
    const { username, email } = signupDto;

    const userExists = await this.userService.findByUsernameOrEmail(
      username,
      email,
    );

    if (userExists) {
      if (userExists.email == email) {
        throw new ConflictException('Email is already in use');
      }
      if (userExists.username == username) {
        throw new ConflictException('username is already taken');
      }
    }

    const user = await this.userService.create(signupDto);

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number, provideRefresh: boolean = true) {
    const payload = { userId };

    // Might be faster if we isolated each promise according to the provideRefresh boolean
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return provideRefresh ? { accessToken, refreshToken } : { accessToken };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByUsernameOrEmail('', email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const validPassword = await this.userService.isValidPassword(
      password,
      user.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const { accessToken } = await this.generateTokens(user.id, false);

    return {
      user,
      accessToken,
    };
  }

  //   async refresh(refreshDto: RefreshDto) {
  //     const accessToken = this.generateTokens(,false);
  //   }
}
