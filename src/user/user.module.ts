import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from 'src/images/images.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSubscription } from './entities/user-subscription.entity';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User, UserSubscription]),
    forwardRef((): typeof ImageModule => ImageModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
