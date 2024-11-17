import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ title: 'Note id', example: 1 })
  public note_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ title: 'Note value', example: 'Around this day I felt good' })
  public note: string;
}
