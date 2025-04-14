import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestType } from '../../../types/RequestType';
import { Comment } from '../entities/comment.entity';
import { CommentService } from './comment.service';

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestType = context.switchToHttp().getRequest();

    const comment_id: number =
      request.body.comment_id ||
      request.params.comment_id ||
      request.body.id ||
      request.params.id;
    if (!comment_id) {
      throw new NotFoundException(`Comment not found`);
    }

    const commentFound: Comment = await this.commentService.findComment(
      comment_id,
      [{ key: 'post' }],
    );
    if (
      !commentFound ||
      commentFound.user.id !== request.user.id ||
      commentFound.post.user.id !== request.user.id
    ) {
      throw new NotFoundException(`Comment not found`);
    }

    request.comment = commentFound;

    return true;
  }
}
