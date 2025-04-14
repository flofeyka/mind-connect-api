import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ImageController } from './images.controller';
import { Image } from './images.entity';
import { ImageService } from './images.service';

@Module({
  controllers: [ImageController],
  imports: [
    TypeOrmModule.forFeature([Image]),
    forwardRef((): typeof UserModule => UserModule),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
