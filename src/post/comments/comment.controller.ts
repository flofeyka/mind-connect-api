import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { CommentService } from './comment.service';
import { RequestType } from '../../../types/RequestType';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { CommentOutputDto } from './dtos/comment-output-dto';
import { CommentGuard } from './comment.guard';

@Controller('/post/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:comment_id')
  @UseGuards(AuthGuard)
  async getComment(
    @Param('comment_id') comment_id: number,
  ): Promise<CommentOutputDto> {
    return await this.commentService.getCommentById(comment_id);
  }

  @Post('/:post_id') @UseGuards(AuthGuard) async createComment(
    @Param('post_id') post_id: number,
    @Body() commentDto: CreateCommentDto,
    @Req() req: RequestType,
  ): Promise<CommentOutputDto> {
    return await this.commentService.createComment(
      post_id,
      commentDto,
      req.user.id,
    );
  }

  @Put('/:comment_id') @UseGuards(AuthGuard, CommentGuard) async editComment(
    @Req() request: RequestType,
    @Body() commentDto: CreateCommentDto,
  ): Promise<CommentOutputDto> {
    return await this.commentService.editComment(request.comment, commentDto);
  }

  @Delete('/:comment_id')
  @UseGuards(AuthGuard, CommentGuard)
  async deleteComment(@Req() request: RequestType): Promise<{
    success: boolean;
    message: string;
  }> {
    return await this.commentService.deleteComment(request.comment);
  }
}
