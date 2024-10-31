import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import { UserService } from "src/user/user.service";
import { TokenService } from "./token/token.service";
import { User } from "src/user/entities/user.entity";
import { LoginDto } from "./dtos/login-dto";
import * as bcrypt from 'bcrypt';
import { AuthOutputDto } from "./dtos/auth-output-dto";
import { ResetPasswordToken } from "./token/resetPasswordToken.entity";
import { UserOutputDto } from "src/user/dtos/UserOutputDto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly mailerService: MailerService,
    ) { }

    async signUp(createUserDto: CreateUserDto): Promise<AuthOutputDto> {
        const userExisted: User | null = await this.userService.findUserByEmail(createUserDto.email);
        if (userExisted) {
            throw new BadRequestException('User already existed');
        }

        const salt: string = await bcrypt.genSalt(10, "a");
        const password: string = await bcrypt.hash(createUserDto.password, salt);

        const userCreated: User = await this.userService.createUser({ ...createUserDto, password });
        const { refreshToken, accessToken } = this.tokenService.generateTokens({
            _id: userCreated._id,
            email: userCreated.email
        });
        await this.tokenService.saveToken(refreshToken);


        //should return user-dto and token
        return new AuthOutputDto({ user: userCreated, refreshToken, accessToken })
    }

    async signIn(loginDto: LoginDto): Promise<AuthOutputDto> {
        const userExisted: User | null = await this.userService.findUserByEmail(loginDto.email);
        if (!userExisted) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const isPasswordValid: boolean = await bcrypt.compare(loginDto.password, userExisted.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = this.tokenService.generateTokens({
            _id: userExisted._id,
            email: userExisted.email
        })
        await this.tokenService.saveToken(refreshToken);

        //should return user-dto and token
        return new AuthOutputDto({ user: userExisted, accessToken, refreshToken });
    }

    async logout(refreshToken: string): Promise<boolean> {
        console.log(refreshToken);
        return await this.tokenService.deleteToken(refreshToken);
    }

    async requestPasswordReset(email: string, host: string) {
        const existedUser: User = await this.userService.findUserByEmail(email);

        if (!existedUser) {
            throw new BadRequestException("Account with this email isn't existing");
        }

        const tokenModelGenerated: ResetPasswordToken = await this.tokenService.generateResetPasswordToken(existedUser);
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           https://${host}/auth/reset-password/${tokenModelGenerated.token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        this.mailerService.sendMail({
            from: 'Mind-Connect <mindconnect@mail.ru>',
            to: existedUser.email,
            subject: "Reset password",
            text: message
        })


        return true;
    }

    async resetPassword(token: string, password: string) {
        const tokenFound: ResetPasswordToken = await this.tokenService.findResetPasswordToken(token);
        if (!tokenFound) {
            throw new NotFoundException("Token is not found");
        }

        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (new Date(tokenFound.updatedAt) < new Date(Date.now() - ONE_DAY)) {
            throw new BadRequestException("Link is expired");
        }

        await this.userService.changePassword(tokenFound.user._id, password);

        return true;
    }
};