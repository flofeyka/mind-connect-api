import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './images/images.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PGHOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false 
      }
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ImageModule)
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
