import {
  ConflictException,
  Injectable,
  Logger,
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
      if (userExists.username == username) {
        throw new ConflictException('auth.userExists.username');
      }
      if (userExists.email == email) {
        throw new ConflictException('auth.userExists.email');
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
      throw new UnauthorizedException('auth.login.invalidCredentials');
    }

    const validPassword = await this.userService.isValidPassword(
      password,
      user.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException('auth.login.invalidCredentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshDto: RefreshDto) {
    Logger.log(refreshDto.refreshToken);
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );
      const accessToken = await this.generateTokens(payload.userId, false);
      return accessToken;
    } catch (err: any) {
      Logger.log(err);
      if (err.name == 'TokenExpiredError') {
        throw new UnauthorizedException('token.expired');
      }
      throw new UnauthorizedException('token.invalid');
    }
  }
}
