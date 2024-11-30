import { ApiProperty } from '@nestjs/swagger';
import { Calendar } from '../calendar.entity';
import { CalendarDto } from './calendar-dto';

export class CalendarResponseDto {
  @ApiProperty({ title: 'Is request success', example: true })
  public success: boolean;
  @ApiProperty({ title: 'Calendar', type: CalendarDto })
  public calendar: CalendarDto;

  constructor({ success, calendar }: { success: boolean; calendar: Calendar }) {
    this.success = success;
    this.calendar = new CalendarDto(calendar);
  }
}
