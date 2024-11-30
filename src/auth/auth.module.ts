import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResetPasswordToken } from './token/ResetPasswordToken.entity';
import { Token } from './token/token.entity';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([Token, ResetPasswordToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService],
})
export class AuthModule { }
