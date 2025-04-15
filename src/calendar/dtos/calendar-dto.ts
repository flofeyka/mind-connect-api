import { ApiProperty } from '@nestjs/swagger';
import { Calendar } from '../calendar.entity';
import { NoteDto } from '../notes/dtos/note-dto';
import { CalendarNote } from '../notes/note.entity';

export class CalendarDto {
  @ApiProperty({ title: 'Идентификатор календаря', example: 1 })
  public id: number;

  @ApiProperty({
    title: 'Самочувствие человека на этот день',
    example: 0,
  })
  public status: number;

  @ApiProperty({ title: '', type: [NoteDto] })
  public notes: NoteDto[];

  @ApiProperty({ title: 'Дата' })
  public date: Date;

  constructor(calendar: Calendar) {
    this.id = calendar.id;
    this.status = calendar.status;
    this.notes =
      calendar.notes?.map(
        (note: CalendarNote) => new NoteDto(note, calendar.id),
      ) || [];
    this.date = new Date(calendar.createdAt);
  }
}
