import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CalendarStatusDto {
  @IsNumber()
  @ApiProperty({ title: 'Айди календаря', example: 1 })
  public id: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({
    title: 'Self-esteem from 0 to 5',
    example: 1,
  })
  public status: number;
}
