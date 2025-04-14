import { UserOutputDto } from '../../../user/dtos/UserOutputDto';
import { Comment } from '../../entities/comment.entity';

export class CommentOutputDto {
  public id: number;
  public user: UserOutputDto;
  public value: string;
  public createdAt: Date;
  public isChanged: boolean;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.user = new UserOutputDto(comment.user);
    this.value = comment.value;
    this.createdAt = new Date(comment.createdAt);
    this.isChanged = new Date(comment.createdAt) < new Date(comment.updatedAt);
  }
}
