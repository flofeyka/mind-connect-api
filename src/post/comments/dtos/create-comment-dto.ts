import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    title: 'Comment value',
    example: "Hello. It's my first comment!",
  })
  @IsString()
  public readonly value: string;
}
