import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { CommentOutputDto } from './dtos/comment-output-dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly postService: PostService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
  ) {}

  async findComment(
    id: number,
    relations?: { key: string }[],
  ): Promise<Comment> {
    const relationOptions = relations?.reduce(
      (acc, rel: { key: string }) => ({
        ...acc,
        [rel.key]: true,
      }),
      {},
    );
    return await this.commentRepository.findOne({
      where: { id },
      relations: relationOptions || undefined,
    });
  }

  async createComment(
    post_id: number,
    commentDto: CreateCommentDto,
    user_id: number,
  ): Promise<CommentOutputDto> {
    const postExists: Post = await this.postService.findPost(post_id);
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const user: User = await this.userService.findUserById(user_id);

    const newCommentInsertResult: InsertResult = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({
        post: postExists,
        value: commentDto.value,
        user,
      })
      .execute();

    const comment: Comment = await this.findComment(
      newCommentInsertResult.identifiers[0].id,
    );

    return new CommentOutputDto(comment);
  }

  async editComment(
    comment: Comment,
    commentDto: CreateCommentDto,
  ): Promise<CommentOutputDto> {
    comment.value = commentDto.value;
    const commentEdited: Comment = await this.commentRepository.save(comment);
    return new CommentOutputDto(commentEdited);
  }

  async deleteComment(comment: Comment): Promise<{
    success: boolean;
    message: string;
  }> {
    const commentDeleteResult: DeleteResult =
      await this.commentRepository.delete({ id: comment.id });
    if (commentDeleteResult.affected !== 1) {
      throw new NotFoundException('Cannot delete comment');
    }

    return {
      success: true,
      message: 'Comment successfully deleted',
    };
  }

  async getCommentById(comment_id: number): Promise<CommentOutputDto> {
    const comment: Comment = await this.findComment(comment_id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return new CommentOutputDto(comment);
  }
}
