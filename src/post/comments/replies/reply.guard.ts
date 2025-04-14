import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReplyService } from './reply.service';
import { Reply } from 'src/post/entities/reply.entity';
import { RequestType } from 'types/RequestType';

@Injectable()
export class ReplyGuard implements CanActivate {
  constructor(private readonly replyService: ReplyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestType = context.switchToHttp().getRequest();
    try {
      const reply_id: number =
        request.body.reply_id ||
        request.params.reply_id ||
        request.body.id ||
        request.params.id;
      if (!reply_id) {
        throw new NotFoundException(`Reply not found`);
      }

      const reply: Reply = await this.replyService.findReply(reply_id);

      if (!reply || reply.user_id !== request.user.id) {
        throw new NotFoundException('Reply not found');
      }

      return true;
    } catch (e) {
      throw new NotFoundException('Reply not found');
    }
  }
}
