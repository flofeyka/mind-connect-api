import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError, Observable } from 'rxjs';
import { RequestType } from 'types/RequestType';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Injectable()
export class PostGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestType = context.switchToHttp().getRequest();
    const id: any =
      request.params.post_id ||
      request.body.post_id ||
      request.params.id ||
      request.body.id ||
      request.query.id;
    const userId: number = request.user.id;

    const post: Post = await this.postService.findPost(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new NotFoundException('Post not found');
    }

    request.post = post;
    return true;
  }
}
