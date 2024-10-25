import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "./token.entity";
import { InsertResult, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService, @InjectRepository(Token) private readonly tokenRepository: Repository<Token>) { }

    async saveToken(user: User): Promise<string> {
        const token: string = this.generateToken({ _id: user._id, email: user.email });
        console.log(token);
        const tokenExisted: Token | null = await this.tokenRepository.findOneBy({ user });
        if (!tokenExisted) {
            const insertTokenResult: InsertResult = await this.tokenRepository.createQueryBuilder().insert().into(Token).values({ token, user }).execute();
            const tokenCreated: Token = await this.tokenRepository.findOneBy({ _id: insertTokenResult.identifiers[0].id });
            return tokenCreated.token;
        }

        tokenExisted.token = token;
        const tokenUpdateResult: Token = await this.tokenRepository.save(tokenExisted);

        return tokenUpdateResult.token;
    }

    generateToken(payload: { _id: number, email: string }): string {
        return this.jwtService.sign(payload, {
            expiresIn: "7d",
            secret: process.env.JWT_SECRET
        });
    }

    async verifyToken(token: string): Promise<{ _id: number, email: string }> {
        const verified: {_id: number, email: string} = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET
        });

        if (!verified) {
            throw new UnauthorizedException("Unauthorized");
        }

        const tokenFound: Token | null = await this.tokenRepository.findOneBy({ token });
        if (!tokenFound) {
            throw new UnauthorizedException("Unauthorized");
        }

        return verified;
    }
}