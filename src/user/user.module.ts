import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from 'src/images/images.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef((): typeof ImageModule => ImageModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
