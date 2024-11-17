import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './images.controller';
import { Image } from './images.entity';
import { ImageService } from './images.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImageController],
  imports: [
    TypeOrmModule.forFeature([Image]),
    forwardRef((): typeof UserModule => UserModule),
    forwardRef((): typeof AuthModule => AuthModule),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
