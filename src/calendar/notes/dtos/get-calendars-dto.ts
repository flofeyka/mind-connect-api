import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetCalendarsDto {
  @ApiProperty({
    description: 'The start date of the calendar',
    example: '2025-01-01',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'The end date of the calendar',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  end_date: Date = new Date();
}
