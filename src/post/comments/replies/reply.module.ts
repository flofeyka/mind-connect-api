import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ImageModule } from 'src/images/images.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/post/entities/reply.entity';

@Module({
  imports: [ImageModule, TypeOrmModule.forFeature([Reply])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
