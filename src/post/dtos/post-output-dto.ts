import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from 'src/user/dtos/UserOutputDto';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { CommentOutputDto } from '../comments/dtos/comment-output-dto';

export class PostOutputDto {
  @ApiProperty({ title: 'Post id', example: 1 }) public readonly id: number;

  @ApiProperty({ title: 'Post text value', example: 'Hello. How are you?' })
  public readonly value: string;

  @ApiProperty({ title: 'Is post pinned?', example: true })
  public readonly pinned: boolean;

  @ApiProperty({ title: 'Date of post creation', example: '2022-01-01' })
  public readonly createdAt: Date;

  @ApiProperty({ title: 'Comments', type: [CommentOutputDto] })
  public readonly comments: CommentOutputDto[];

  @ApiProperty({ title: 'Post creator', type: UserOutputDto })
  public readonly user: UserOutputDto;

  constructor(post: Post) {
    this.id = post.id;
    this.value = post.value;
    this.user = new UserOutputDto(post.user);
    this.pinned = post.pinned;
    this.comments = post.comments.map(
      (comment: Comment): CommentOutputDto => new CommentOutputDto(comment),
    );
    this.createdAt = post.createdAt;
  }
}
