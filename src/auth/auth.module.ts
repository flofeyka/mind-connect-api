import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "./token/token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "./token/token.entity";
import { AppModule } from "src/app.module";
import { ResetPasswordToken } from "./token/ResetPasswordToken.entity";

@Module({
    imports: [
        forwardRef(() => AppModule),
        TypeOrmModule.forFeature([Token, ResetPasswordToken]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        })
        , forwardRef(() => UserModule)],
    controllers: [AuthController],
    providers: [AuthService, TokenService],
    exports: [TokenService]
})
export class AuthModule { }