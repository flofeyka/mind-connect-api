import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CommentModule } from './comments/comment.module';
import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    UserModule,
    forwardRef(() => CommentModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [CommentModule, PostService],
})
export class PostModule {}
