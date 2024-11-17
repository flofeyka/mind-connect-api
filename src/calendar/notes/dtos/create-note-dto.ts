import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNumber()
  @ApiProperty({ title: 'Идентификатор календаря', example: 1 })
  public calendar_id: number;

  @IsString()
  @ApiProperty({ title: 'Note value', example: 'Around this day i felt good' })
  public note: string;
}
