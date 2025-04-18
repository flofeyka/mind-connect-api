import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './UserDto';
import { IsOptional, IsString } from 'class-validator';

export class EditUserDto extends UserDto {
  @ApiProperty({ example: 'd2f5fff6-2df4-4761-a23a-e9f708655ee1.png' })
  @IsOptional()
  @IsString()
  public readonly image?: string;
}
