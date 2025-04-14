import { ApiProperty } from '@nestjs/swagger';
import { Reply } from 'src/post/entities/reply.entity';

export class ReplyOutputDto {
  @ApiProperty({ title: 'Reply id', example: 1 })
  public id: number;

  @ApiProperty({ title: 'Reply text value', example: 'I am sure, and you?' })
  public text: string;

  @ApiProperty({ title: 'Comment id', example: 1 })
  public comment_id: number;

  constructor(reply: Reply) {
    this.id = reply.id;
    this.text = reply.text;
    this.comment_id = reply.comment_id;
  }
}
