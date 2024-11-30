import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dtos/CreateUserDto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthOutputDto } from './dtos/auth-output-dto';
import { LoginDto } from './dtos/login-dto';
import { ResetPasswordToken } from './token/ResetPasswordToken.entity';
import { TokenService } from './token/token.service';
import { Token } from './token/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthOutputDto> {
    const userExisted: User | null = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (userExisted) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt: string = await bcrypt.genSalt(10, 'a');
    const password: string = await bcrypt.hash(createUserDto.password, salt);

    const userCreated: User = await this.userService.createUser({
      ...createUserDto,
      password,
    });
    const { refreshToken, accessToken } = this.tokenService.generateTokens({
      _id: userCreated._id,
      email: userCreated.email,
    });
    await this.tokenService.saveToken(refreshToken);

    return new AuthOutputDto({ user: userCreated, refreshToken, accessToken });
  }

  async signIn(loginDto: LoginDto): Promise<AuthOutputDto> {
    const userExisted: User | null = await this.userService.findUserByEmail(
      loginDto.email,
    );
    if (!userExisted) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      loginDto.password,
      userExisted.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const {
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    } = this.tokenService.generateTokens({
      _id: userExisted._id,
      email: userExisted.email,
    });
    await this.tokenService.saveToken(refreshToken);

    return new AuthOutputDto({ user: userExisted, accessToken, refreshToken });
  }

  async refreshToken(currentRefreshToken: string = ''): Promise<AuthOutputDto> {
    const tokenData: Token =
      await this.tokenService.findRefreshToken(currentRefreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('Wrong refresh token');
    }
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      _id: tokenData.user._id,
      email: tokenData.user.email,
    });
    await this.tokenService.saveToken(refreshToken);

    return new AuthOutputDto({
      user: tokenData.user,
      refreshToken,
      accessToken,
    });
  }

  async logout(refreshToken: string): Promise<boolean> {
    return await this.tokenService.deleteToken(refreshToken);
  }

  async requestPasswordReset(email: string, host: string): Promise<boolean> {
    const existedUser: User = await this.userService.findUserByEmail(email);

    if (!existedUser) {
      throw new NotFoundException("Account with this email isn't existing");
    }

    const tokenModelGenerated: ResetPasswordToken =
      await this.tokenService.generateResetPasswordToken(existedUser);
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           https://${host}/auth/reset-password/${tokenModelGenerated.token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    this.mailerService.sendMail({
      from: 'Mind-Connect <mindconnect@mail.ru>',
      to: existedUser.email,
      subject: 'Reset password',
      text: message,
    });

    return true;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const tokenFound: ResetPasswordToken =
      await this.tokenService.findResetPasswordToken(token);
    if (!tokenFound) {
      throw new NotFoundException('Token is not found');
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (new Date(tokenFound.updatedAt) < new Date(Date.now() - ONE_DAY)) {
      throw new BadRequestException('Link is expired');
    }

    await this.userService.changePassword(tokenFound.user._id, password);
    await this.tokenService.deleteResetPasswordToken(tokenFound.token);

    return true;
  }
}
