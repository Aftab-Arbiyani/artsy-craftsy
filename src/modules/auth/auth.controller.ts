import { Controller, Post, Body, Query, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user-signup.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { EmailLoginDto } from './dto/email-login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userSignupDto: UserSignupDto) {
    try {
      const user = await this.authService.findOneWhere({
        where: { email: userSignupDto.email },
      });

      if (user) {
        const message = user.is_email_verified
          ? CONSTANT.ERROR.EMAIL_ALREADY_EXIST
          : CONSTANT.ERROR.EMAIL_NOT_VERIFIED;
        return response.badRequest({ message, data: {} });
      }

      const data = await this.authService.signup(userSignupDto);

      return response.successCreate({
        message: CONSTANT.SUCCESS.COMPLETE_EMAIL_VERIFICATION,
        data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('id') id: string) {
    try {
      const isVerified = await this.authService.verifyEmail(id);

      if (!isVerified) {
        return response.badRequest({
          message: CONSTANT.ERROR.LINK_EXPIRED,
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.EMAIL_VERIFIED,
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Post('login')
  async login(@Body() emailLoginDto: EmailLoginDto, @Req() req: Request) {
    try {
      const user = await this.authService.findOneWhere({
        where: { email: emailLoginDto.email },
      });

      if (!user) {
        return response.badRequest({
          message: CONSTANT.ERROR.WRONG_CREDENTIALS,
          data: {},
        });
      }

      Object.assign(emailLoginDto, {
        device_name: req.headers['user-agent'],
      });

      const result = await this.authService.login(user, emailLoginDto);

      return result;
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
