import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Translate } from '../common/decorators/translate.decorator';

@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @Translate('auth.signup')
  async signup(@Body() signupDto: SignupDto) {
    const data = await this.authService.signup(signupDto);
    return {
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data,
    };
  }

  @Post('login')
  @Translate('auth.login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Logged in successfully',
      data,
    };
  }

  @Post('refresh')
  @Translate('token.refreshed')
  async refresh(@Body() refreshDto: RefreshDto) {
    const data = await this.authService.refresh(refreshDto);
    return {
      success: true,
      statusCode: 200,
      message: 'Token refreshed successfully',
      data,
    };
  }
}
