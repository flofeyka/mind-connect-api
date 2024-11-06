import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { InsertResult, Repository } from "typeorm";
import { ResetPasswordToken } from "./ResetPasswordToken.entity";
import { Token } from "./token.entity";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
        @InjectRepository(ResetPasswordToken) private readonly resetTokenRepository: Repository<ResetPasswordToken>
    ) { }

    async saveToken(refreshToken: string): Promise<string> {
        const tokenVerifiedData: {
            _id: number;
            email: string;
        } = await this.verifyRefreshToken(refreshToken);
        const tokenExisted: Token | null = await this.tokenRepository.findOneBy({ user: { _id: tokenVerifiedData._id } });
        if (!tokenExisted) {
            const insertTokenResult: InsertResult = await this.tokenRepository.createQueryBuilder().insert().into(Token).values({ token: refreshToken, user: { _id: tokenVerifiedData._id } }).execute();
            const tokenCreated: Token = await this.tokenRepository.findOneBy({ _id: insertTokenResult.identifiers[0].id });
            return tokenCreated.token;
        }

        tokenExisted.token = refreshToken;
        const tokenUpdateResult: Token = await this.tokenRepository.save(tokenExisted);

        return tokenUpdateResult.token;
    }

    generateTokens(payload: { _id: number, email: string }): { accessToken: string; refreshToken: string } {
        const accessToken: string = this.jwtService.sign(payload, {
            expiresIn: "15m",
            secret: process.env.JWT_ACCESS_SECRET
        });

        const refreshToken: string = this.jwtService.sign(payload, {
            expiresIn: "14d",
            secret: process.env.JWT_REFRESH_SECRET
        });

        return { accessToken, refreshToken };


    }

    async verifyAccessToken(accessToken: string): Promise<{ _id: number, email: string }> {
        const verified: { _id: number, email: string } = this.jwtService.verify(accessToken, {
            secret: process.env.JWT_ACCESS_SECRET
        });

        if (!verified) {
            throw new UnauthorizedException("Unauthorized");
        }

        return verified;
    }

    async findRefreshToken(refreshToken: string) {
        return await this.tokenRepository.findOne({where: {token: refreshToken}, relations: {
            user: true
        }});
    }

    verifyRefreshToken(refreshToken: string): { _id: number, email: string } {
        return this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET
        });
    }

    async deleteToken(refreshToken: string): Promise<boolean> {
        const deleteResult = await this.tokenRepository.delete({ token: refreshToken });
        if (deleteResult.affected !== 1) {
            throw new UnauthorizedException("Wrong refresh token");
        }

        return deleteResult.affected === 1;
    }

    async generateResetPasswordToken(user: User): Promise<ResetPasswordToken> {
        const tokenExists: ResetPasswordToken | null = await this.resetTokenRepository.findOneBy({ user });
        const FIVE_MINUTES: number = 5 * 60 * 1000;
        if (tokenExists && Date.now() - new Date(tokenExists.updatedAt).getTime() < FIVE_MINUTES) {
            throw new BadRequestException("You cannot resend the password reset email. Please wait 5 minutes")
        }
        const tokenCreated: string = this.jwtService.sign({
            _id: user._id,
            email: user.email
        }, {
            secret: process.env.JWT_RESET_PASSWORD_SECRET,
            expiresIn: "24h"
        });

        const resetPasswordToken: ResetPasswordToken = await this.resetTokenRepository.save({
            ...tokenExists,
            token: tokenCreated,
            user
        });

        return resetPasswordToken;
    }

    async findResetPasswordToken(token: string): Promise<ResetPasswordToken> {
        return await this.resetTokenRepository.findOne({
            where: {
                token
            }, relations: {
                user: true
            }
        })
    }

    async deleteResetPasswordToken(token: string) {
        return (await this.resetTokenRepository.delete({token})).affected === 1;
    }
}