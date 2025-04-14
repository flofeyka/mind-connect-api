import { Module } from '@nestjs/common';
import { GigachatController } from './gigachat.controller';
import { GigachatService } from './gigachat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigaChatMessage } from './entities/message.entity';
import { GigaChatDialog } from './entities/dialog.entity';
import { UserModule } from '../user/user.module';
import { ImageModule } from '../images/images.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [GigachatController],
  providers: [GigachatService],
  imports: [
    HttpModule,
    UserModule,
    ImageModule,
    TypeOrmModule.forFeature([GigaChatMessage, GigaChatDialog]),
  ],
  exports: [GigachatService]
})
export class GigachatModule {}
