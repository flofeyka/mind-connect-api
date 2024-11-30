import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dtos/CreateUserDto';
import { AuthService } from './auth.service';
import { AuthOutputDto } from './dtos/auth-output-dto';
import { LoginDto } from './dtos/login-dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';

@ApiTags('Auth API')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Sign up' })
  @ApiOkResponse({ type: AuthOutputDto })
  @ApiBadRequestResponse({
    example: new BadRequestException(
      'User with this email already exists',
    ).getResponse(),
  })
  @Post('/sign-up')
  async signUp(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthOutputDto> {
    const authData: AuthOutputDto = await this.authService.signUp(userDto);
    response.cookie('refreshToken', authData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });

    return authData;
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiOkResponse({ type: AuthOutputDto })
  @ApiUnauthorizedResponse({
    example: new UnauthorizedException('Wrong email or password').getResponse(),
  })
  @Post('/sign-in')
  async signIn(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthOutputDto> {
    const authData: AuthOutputDto = await this.authService.signIn(userDto);
    response.cookie('refreshToken', authData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });

    return authData;
  }

  @ApiOperation({ summary: 'Refresh token and get user data' })
  @ApiOkResponse({ type: AuthOutputDto })
  @ApiBadRequestResponse({
    example: new UnauthorizedException('Wrong refresh token').getResponse(),
  })
  @Post('/refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthOutputDto> {
    const authData: AuthOutputDto = await this.authService.refreshToken(
      request.cookies?.refreshToken,
    );
    response.cookie('refreshToken', authData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });

    return authData;
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiOkResponse({ example: true })
  @ApiUnauthorizedResponse({
    example: new UnauthorizedException('Wrong refresh token').getResponse(),
  })
  @Delete('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const logoutData: boolean = await this.authService.logout(
      request.cookies?.refreshToken,
    );
    response.clearCookie('refreshToken');
    return logoutData;
  }

  @ApiOperation({ summary: 'Send email-request to password reset ' })
  @ApiOkResponse({ example: true })
  @ApiNotFoundResponse({
    example: new NotFoundException(
      "Account with this email isn't existing",
    ).getResponse(),
  })
  @ApiBadRequestResponse({
    example: new BadRequestException(
      'You cannot resend the password reset email. Please wait 5 minutes',
    ).getResponse(),
  })
  @Post('/request-password-reset')
  requestPasswordReset(
    @Query('email') email: string,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.authService.requestPasswordReset(email, request.headers.host);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ example: true })
  @ApiNotFoundResponse({
    example: new NotFoundException('Token is not found').getResponse(),
  })
  @ApiBadRequestResponse({
    example: new NotFoundException('Link is expired').getResponse(),
  })
  @Put('/reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() { password }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, password);
  }

  // @Get("/yandex/callback/:token")
  // async yandexCallback(@Param('token') token: string) {
  //     const {data} = await fetch(`https://login.yandex.ru/info?jwt_secret=55fe52e445bf412eaacb22064a6f60c1&format=json`, {
  //         headers: {
  //             'Authorization': `Bearer ${token}`
  //         }
  //     }).then(res => res.json());
  //     console.log(data);
  // }
}
