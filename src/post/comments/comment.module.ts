import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Comment } from '../entities/comment.entity';
import { PostModule } from '../post.module';
import { CommentController } from './comment.controller';
import { CommentGuard } from './comment.guard';
import { CommentService } from './comment.service';
import { ReplyModule } from './replies/reply.module';

@Module({
  imports: [
    ReplyModule,
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([Comment]),
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentGuard],
  exports: [ReplyModule],
})
export class CommentModule {}
